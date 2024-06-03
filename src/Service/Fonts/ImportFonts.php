<?php

namespace App\Service\Fonts;

use App\AppHelper\Helper;
use App\Entity\AppFonts;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use League\Flysystem\FilesystemException;
use stdClass;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Console\Messenger\RunCommandMessage;

class ImportFonts
{
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly MessageBusInterface    $bus,
        private readonly string                 $publicPath,
        private readonly string                 $fontServicePath
    )
    {

    }

    /**
     * @throws FilesystemException
     * @throws Exception
     */
    public function import(array $import, $make = true): object
    {
        $return = new stdClass();
        $return->status = false;
        $return->msg = '';
        if (!$import) {
            return $return;
        }
        $path = $import['fileInfo']['dirname'] . DIRECTORY_SEPARATOR;
        $basename = $import['fileInfo']['basename'];
        $fileName = $import['fileInfo']['filename'];
        $ext = $import['fileInfo']['extension'];

        $destCssFile = $this->publicPath . 'scss' . DIRECTORY_SEPARATOR . '._font-face.scss';
        $destFontPath = $this->publicPath . 'fonts' . DIRECTORY_SEPARATOR;
        $srcFontServiceCss = $this->fontServicePath . '.default.css.txt';

        $helper = Helper::instance();
        $repo = $this->em->getRepository(AppFonts::class);
        $importFont = $this->font_info($import, $make);

        if ($importFont->status) {
            $font = $repo->findOneBy(['designation' => $importFont->font['family']]);
            if ($make) {
                $ttf = '';
                $woff2 = '';
                $woff = '';
                $types = [];
                $local_Name = [];
                $scan = scandir($path);
                foreach ($scan as $val) {
                    if ($val == "." || $val == "..") {
                        continue;
                    }
                    $info = pathinfo($path . $val);
                    $extension = $info['extension'];
                    $localName = $importFont->font['local_name'];
                    $destDir = $destFontPath . $importFont->font['family'] . DIRECTORY_SEPARATOR;
                    $helper->make_is_dir($destDir);
                    $helper->move_file($path . $val, $destDir . $localName . '.' . $extension, true);

                    if ($font) {
                        $local_Name = array_merge_recursive($font->getLocalName(), [$localName]);
                        if ($font->isTtf()) {
                            $ttf = 'ttf';
                        }
                        if ($font->isWoff()) {
                            $woff = 'woff';
                        }
                        if ($font->isWoff2()) {
                            $woff2 = 'woff2';
                        }
                        $types = [$ttf, $woff, $woff2, $extension];

                    } else {
                        $local_Name[] = $localName;
                        $types[] = $extension;
                    }
                }

                $local_Name = array_merge(array_unique(array_filter($local_Name)));
                $types = array_merge(array_unique(array_filter($types)));
                if ($font) {
                    $fontData = array_merge_recursive($font->getFontData(), [$importFont->font]);
                    $fontInfo = array_merge_recursive($font->getFontInfo(), [$importFont->font_info]);
                } else {
                    $font = new AppFonts();
                    $fontData = [$importFont->font];
                    $fontInfo= [$importFont->font_info];
                }
                $font->setDesignation($importFont->font['family']);
                $font->setLocalName($local_Name);
                $font->setFontInfo($fontInfo);
                $font->setFontData($fontData);
                $font->setIsTtf(in_array('ttf', $types));
                $font->setIsWoff(in_array('woff', $types));
                $font->setIsWoff2(in_array('woff2', $types));
                $this->em->persist($font);
                $this->em->flush();
            }

            //   $serializer = new Serializer([new ObjectNormalizer()]);
            //   $font = $serializer->normalize($font);
            $return->fontInfo = $font;
        } else {
            $return->msg = $importFont->msg;
            return $return;
        }
        $return->status = true;
        return $return;
    }


    /**
     * @throws FilesystemException
     * @throws Exception
     */
    protected function font_info($pathInfo, $make): object
    {

        $return = new stdClass();
        $return->status = false;
        $return->msg = $this->translator->trans('An error has occurred');

        $path = $pathInfo['fileInfo']['dirname'] . DIRECTORY_SEPARATOR;
        $basename = $pathInfo['fileInfo']['basename'];
        $fileName = $pathInfo['fileInfo']['filename'];
        $ext = $pathInfo['fileInfo']['extension'];
        $filePath = $path . $basename;
        if (!is_file($filePath)) {
            return $return;
        }
        if ($ext != 'ttf') {
            return $return;
        }
        $ttfInfo = (new TTFInfo())->setFontFile($filePath);
        $fontInfo = $ttfInfo->getFontInfo();
        $localName = $fontInfo[TTFInfo::NAME_POSTSCRIPT_NAME];
        $full_name = $fontInfo[TTFInfo::NAME_FULL_NAME];
        $firstFamily = $fontInfo[TTFInfo::NAME_NAME] ?? false;
        $prefer_family = $fontInfo[TTFInfo::NAME_PREFERRE_FAMILY] ?? false;
        $sub_family = $fontInfo[TTFInfo::NAME_SUBFAMILY];

        if ($prefer_family) {
            $family = $prefer_family;
        } else {
            $family = $firstFamily;
        }
        if (!$family || !$localName || !$full_name || !$sub_family) {
            $this->uploaderHelper->deleteFile($basename, $this->uploaderHelper::FONT_DIR, true);

            return $return;
        }
        $isFontStyleInstall = $this->em->getRepository(AppFonts::class)->get_install_font_type($family, $localName);
        if ($isFontStyleInstall->status) {
            $this->uploaderHelper->deleteFile($basename, $this->uploaderHelper::FONT_DIR, true);
            $return->msg = $this->translator->trans('design.Font already exists');
            return $return;
        }


        $lowerName = strtolower($full_name);
        $lowerName = explode(' ', $lowerName);
        $weight = '';
        $fontWeight = '';
        foreach ($lowerName as $name) {
            $weight = $this->get_font_weight($name);
            if ($weight) {
                $fontWeight = $weight['weight'];
                break;
            }
        }
        if (!$fontWeight) {
            $fontWeight = 'normal';
        }
        $lowerSubFamily = strtolower($sub_family);
        if ($lowerSubFamily == 'italic') {
            $fontStyle = 'italic';
        } else {
            $fontStyle = 'normal';
        }
        $addId = uniqid();
        $infoArr = [
                  '0' => [
                    'id' => 1,
                    'value' => $fontInfo[TTFInfo::NAME_NAME] ?? 'unknown',
                    'label' => 'Font Family'
                ],
                '1' => [
                    'id' => 2,
                    'value' => $fontInfo[TTFInfo::NAME_SUBFAMILY] ?? 'unknown',
                    'label' => 'Sub-Family'
                ],
                '2' => [
                    'id' => 3,
                    'value' => $fontInfo[TTFInfo::NAME_SUBFAMILY_ID] ?? 'unknown',
                    'label' => 'Sub-Family-ID'
                ],
                '3' => [
                    'id' => 4,
                    'value' => $fontInfo[TTFInfo::NAME_FULL_NAME] ?? 'unknown',
                    'label' => 'Font full name'
                ],
                '4' => [
                    'id' => 5,
                    'value' => $fontInfo[TTFInfo::NAME_VERSION] ?? 'unknown',
                    'label' => 'Version'
                ],
                '5' => [
                    'id' => 6,
                    'value' => $fontInfo[TTFInfo::NAME_POSTSCRIPT_NAME] ?? 'unknown',
                    'label' => 'Postscript name'
                ],
                '6' => [
                    'id' => 9,
                    'value' => $fontInfo[TTFInfo::NAME_DESIGNER] ?? 'unknown',
                    'label' => 'Designer'
                ],
                '7' => [
                    'id' => 10,
                    'value' => $fontInfo[TTFInfo::NAME_DESCRIPTION] ?? 'unknown',
                    'label' => 'Description'
                ],
                '8' => [
                    'id' => 11,
                    'value' => $fontInfo[TTFInfo::NAME_VENDOR_URL] ?? 'unknown',
                    'label' => 'Vendor url'
                ],
                '9' => [
                    'id' => 12,
                    'value' => $fontInfo[TTFInfo::NAME_DESIGNER_URL] ?? 'unknown',
                    'label' => 'Designer url'
                ],
                '10' => [
                    'id' => 13,
                    'value' => $fontInfo[TTFInfo::NAME_LICENSE] ?? 'unknown',
                    'label' => 'License'
                ],
                '11' => [
                    'id' => 14,
                    'value' => $fontInfo[TTFInfo::NAME_LICENSE_URL] ?? 'unknown',
                    'label' => 'License url'
                ],
                '12' => [
                    'id' => 256,
                    'value' => $fontInfo[TTFInfo::NAME_FEATURES_ENABLED_ONE] ?? 'unknown',
                    'label' => 'Functions activated'
                ],
                '13' => [
                    'id' => 257,
                    'value' => $fontInfo[TTFInfo::NAME_FEATURES_ENABLED_TWO] ?? 'unknown',
                    'label' => 'Functions activated'
                ],
                '14' => [
                    'id' => 258,
                    'value' => $fontInfo[TTFInfo::NAME_FONT_LIGATURES] ?? 'unknown',
                    'label' => 'Font ligaturen'
                ],
                '15' => [
                    'id' => 259,
                    'value' => $fontInfo[TTFInfo::NAME_REQUIRED_LIGATURES] ?? 'unknown',
                    'label' => 'Required Font ligaturen'
                ],
                '16' => [
                    'id' => 260,
                    'value' => $fontInfo[TTFInfo::NAME_FARSI_LIGATURES] ?? 'unknown',
                    'label' => 'Farsi ligatures'
            ]
        ];

        $info = [
            'id' => $addId,
            'info' => $infoArr
        ];

        if ($make) {
            $this->font_woff2($pathInfo);
            $sfnt2woff = new sfnt2woff();
            $sfnt = file_get_contents($filePath);

            try {
                $sfnt2woff->import($sfnt);
            } catch (Exception $e) {
                return $return;
            }
            $sfnt2woff->strict = false;
            $sfnt2woff->compression_level = 9;
            $sfnt2woff->version_major = 1;
            $sfnt2woff->version_minor = 1;
            try {
                $woff = $sfnt2woff->export();
            } catch (Exception $e) {
                return $return;
            }
            file_put_contents($path . $fileName . '.woff', $woff);
        }

        $font = [
            'id' => $addId,
            'local_name' => $localName,
            'full_name' => $full_name,
            'first_family' => $firstFamily,
            'prefer_family' => $prefer_family,
            'sub_family' => $sub_family,
            'family' => $family,
            'font_weight' => $fontWeight,
            'font_style' => $fontStyle
        ];

        $return->font_weight = $fontWeight;
        $return->font_style = $fontStyle;
        $return->font_info = $info;
        $return->font = $font;
        $return->msg = '';
        $return->status = true;
        return $return;
    }

    protected function font_woff2($pathInfo): object
    {
        $return = new stdClass();
        $return->status = false;
        $path = $pathInfo['fileInfo']['dirname'] . DIRECTORY_SEPARATOR;
        $fileName = $pathInfo['fileInfo']['filename'];
        $ext = $pathInfo['fileInfo']['extension'];
        $baseName = $pathInfo['fileInfo']['basename'];
        $font_file = $path . $baseName;
        if (!is_file($font_file)) {
            return $return;
        }

        $subsets = [
            //  "cyrillic-ext" => "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
            // "cyrillic" => "+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
            // "greek-ext" => "U+1F00-1FFF",
            // "greek" => "U+0370-03FF",
            // "latin-ext" => "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF",
            "latin" => "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
        ];

        foreach ($subsets as $subset => $range) {
            $output_filename = $path . $fileName . '.woff2';
            $cmd = 'pyftsubset "' . $font_file . '" --output-file="' . $output_filename . '" --flavor=woff2 --layout-features="*" --unicodes="' . $range . '"';
            exec($cmd);
            // $this->bus->dispatch(new RunCommandMessage($cmd));
        }

        return $return;
    }
}