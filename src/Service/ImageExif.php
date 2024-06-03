<?php

namespace App\Service;

use App\AppHelper\Helper;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use League\Flysystem\Filesystem;
use stdClass;
use Symfony\Contracts\Translation\TranslatorInterface;

class ImageExif
{

    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly string              $uploadsPath,
        private readonly string              $uploadsPrivatePath

    )
    {
    }

    /**
     * @throws Exception
     */
    public function get_exif_data(string $filename, string $directory, bool $isPublic = true): stdClass
    {
        $filePath = $isPublic ? $this->uploadsPath . $directory . DIRECTORY_SEPARATOR : $this->uploadsPrivatePath . $directory . DIRECTORY_SEPARATOR;

        $return = new stdClass();
        $return->status = false;
        if (!$filename) {
            $return->msg = 'File not found';
            return $return;
        }
        $helper = Helper::instance();
        // $file = $this->uploadsPath .  'full' . DIRECTORY_SEPARATOR . $filename;
        $file = $filePath . $filename;

        if (!is_file($file)) {
            $return->msg = 'File not found';
            return $return;
        }
        $type = strtolower(substr(strrchr($file, '.'), 1));
        switch ($type) {
            case 'jpg':
            case 'jpeg':
                $eXif = $this->_imagecreatefromjpegexif($file);
                break;
            default:
                return $return;
        }

        if (!$eXif->status) {
            $return->msg = 'Fehler image-create-from-jpeg-exif';
            return $return;
        }

        if ($eXif->exif) {
            $eXif = $eXif->exif;
            //FILE
            isset($eXif['FILE']['FileSize']) ? $exifFile['FileSize'] = $eXif['FILE']['FileSize'] : $exifFile['FileSize'] = false;
            $exifFile['FileSize'] ? $exifFile['FileSizeConvert'] = $helper->FileSizeConvert((float)$exifFile['FileSize']) : $exifFile['FileSizeConvert'] = $this->translator->trans('unknown');
            isset($eXif['FILE']['MimeType']) ? $exifFile['MimeType'] = $eXif['FILE']['MimeType'] : $exifFile['MimeType'] = $this->translator->trans('unknown');
            isset($eXif['FILE']['Filetype']) ? $exifFile['Filetype'] = $eXif['FILE']['Filetype'] : $exifFile['Filetype'] = false;
            isset($eXif['FILE']['FileDateTime']) ? $exifFile['uploadTime'] = date('d.m.Y H:i:s', $eXif['FILE']['FileDateTime']) : $exifFile['uploadTime'] = $this->translator->trans('unknown');

            //IFD0
            isset($eXif['IFD0']['Make']) ? $exifIFDO['Make'] = $eXif['IFD0']['Make'] : $exifIFDO['Make'] = '';
            isset($eXif['IFD0']['Model']) ? $exifIFDO['Model'] = $eXif['IFD0']['Model'] : $exifIFDO['Model'] = '';
            isset($eXif['IFD0']['ImageDescription']) ? $exifIFDO['ImageDescription'] = $eXif['IFD0']['ImageDescription'] : $exifIFDO['ImageDescription'] = false;
            isset($eXif['IFD0']['XResolution']) ? $exifIFDO['XResolution'] = $eXif['IFD0']['XResolution'] : $exifIFDO['XResolution'] = '';
            isset($eXif['IFD0']['YResolution']) ? $exifIFDO['YResolution'] = $eXif['IFD0']['YResolution'] : $exifIFDO['YResolution'] = '';
            isset($eXif['IFD0']['Software']) ? $exifIFDO['Software'] = $eXif['IFD0']['Software'] : $exifIFDO['Software'] = '';
            isset($eXif['IFD0']['DateTime']) ? $exifIFDO['LastEditTime'] = date('d.m.Y H:i:s', strtotime($eXif['IFD0']['DateTime'])) : $exifIFDO['LastEditTime'] = 'unbekannt';
            isset($eXif['IFD0']['Artist']) ? $exifIFDO['Artist'] = $eXif['IFD0']['Artist'] : $exifIFDO['Artist'] = '';
            isset($eXif['IFD0']['Copyright']) ? $exifIFDO['Copyright'] = $eXif['IFD0']['Copyright'] : $exifIFDO['Copyright'] = '';
            isset($eXif['IFD0']['Exif_IFD_Pointer']) ? $exifIFDO['Exif_IFD_Pointer'] = $eXif['IFD0']['Exif_IFD_Pointer'] : $exifIFDO['Exif_IFD_Pointer'] = false;

            //COMPUTED
            isset($eXif['COMPUTED']['Copyright']) ? $exifComputed['Copyright'] = $eXif['COMPUTED']['Copyright'] : $exifComputed['Copyright'] = $this->translator->trans('unknown');
            isset($eXif['COMPUTED']['Width']) ? $exifComputed['Width'] = $eXif['COMPUTED']['Width'] : $exifComputed['Width'] = $this->translator->trans('unknown');
            isset($eXif['COMPUTED']['Height']) ? $exifComputed['Height'] = $eXif['COMPUTED']['Height'] : $exifComputed['Height'] = $this->translator->trans('unknown');
            isset($eXif['COMPUTED']['html']) ? $exifComputed['attr'] = $eXif['COMPUTED']['html'] : $exifComputed['attr'] = $this->translator->trans('unknown');
            //isset($eXif['COMPUTED']['Copyright']) ? $exifComputed['Copyright'] = $eXif['COMPUTED']['Copyright'] : $exifComputed['Copyright'] = $this->translator->trans('unknown');
            isset($eXif['COMPUTED']['IsColor']) ? $exifComputed['IsColor'] = $eXif['COMPUTED']['IsColor'] : $exifComputed['IsColor'] = $this->translator->trans('unknown');
            isset($eXif['COMPUTED']['ApertureFNumber']) ? $exifComputed['ApertureFNumber'] = $eXif['COMPUTED']['ApertureFNumber'] : $exifComputed['ApertureFNumber'] = $this->translator->trans('unknown');

            //THUMBNAIL
            /*  isset($eXif['THUMBNAIL']['Compression']) ? $exifThumbnail->Compression = $this->getThumbnailCompression($eXif['THUMBNAIL']['Compression']) : $exifThumbnail->Compression = false;
              isset($eXif['THUMBNAIL']['XResolution']) ? $exifThumbnail->XResolution = $eXif['THUMBNAIL']['XResolution'] : $exifThumbnail->XResolution = false;
              isset($eXif['THUMBNAIL']['YResolution']) ? $exifThumbnail->YResolution = $eXif['THUMBNAIL']['YResolution'] : $exifThumbnail->YResolution = false;
              isset($eXif['THUMBNAIL']['ResolutionUnit']) ? $exifThumbnail->ResolutionUnit = $this->getResolutionUnit($eXif['THUMBNAIL']['ResolutionUnit']) : $exifThumbnail->ResolutionUnit = false;
              isset($eXif['THUMBNAIL']['JPEGInterchangeFormat']) ? $exifThumbnail->JPEGInterchangeFormat = $eXif['THUMBNAIL']['JPEGInterchangeFormat'] : $exifThumbnail->JPEGInterchangeFormat = false;
              isset($eXif['THUMBNAIL']['JPEGInterchangeFormatLength']) ? $exifThumbnail->JPEGInterchangeFormatLength = $eXif['THUMBNAIL']['JPEGInterchangeFormatLength'] : $exifThumbnail->JPEGInterchangeFormatLength = false;
              */
            //EXIF
            isset($eXif['EXIF']['ExposureTime']) ? $exifExif['ExposureTime'] = $eXif['EXIF']['ExposureTime'] : $exifExif['ExposureTime'] = $this->translator->trans('unknown');
            if (isset($eXif['EXIF']['FNumber'])) {
                list($num, $den) = explode("/", $eXif['EXIF']["FNumber"]);
                $exifExif['FNumber'] = ($num / $den);
            } else {
                $exifExif['FNumber'] = $this->translator->trans('unknown');
            }
            isset($eXif['EXIF']['ExposureProgram']) ? $exifExif['ExposureProgram'] = $this->getExposureProgram($eXif['EXIF']['ExposureProgram']) : $exifExif['ExposureProgram'] = $this->translator->trans('unknown');
            isset($eXif['EXIF']['ISOSpeedRatings']) ? $exifExif['ISOSpeedRatings'] = $eXif['EXIF']['ISOSpeedRatings'] : $exifExif['ISOSpeedRatings'] = false;
            if (!$exifExif['ISOSpeedRatings']) {
                isset($eXif['EXIF']['PhotographicSensitivity']) ? $exifExif['ISOSpeedRatings'] = $eXif['EXIF']['PhotographicSensitivity'] : $exifExif['ISOSpeedRatings'] = false;
            }
            isset($eXif['EXIF']['DateTimeOriginal']) ? $exifExif['DateTimeOriginal'] = date('d.m.Y H:i:s', strtotime($eXif['EXIF']['DateTimeOriginal'])) : $exifExif['DateTimeOriginal'] = '';
            isset($eXif['EXIF']['MeteringMode']) ? $exifExif['MeteringMode'] = $this->getMeteringMode($eXif['EXIF']['MeteringMode']) : $exifExif['MeteringMode'] = $this->translator->trans('unknown');
            isset($eXif['EXIF']['LightSource']) ? $exifExif['LightSource'] = $this->getLightSource($eXif['EXIF']['LightSource']) : $exifExif['LightSource'] = $this->translator->trans('unknown');
            if (isset($eXif['EXIF']['FocalLength'])) {
                list($num, $den) = explode("/", $eXif['EXIF']["FocalLength"]);
                $exifExif['FocalLength'] = ($num / $den);
            } else {
                $exifExif['FocalLength'] = 'unbekannt';
            }

            isset($eXif['EXIF']['WhiteBalance']) ? $exifExif['WhiteBalance'] = $this->getWhiteBalance($eXif['EXIF']['WhiteBalance']) : $exifExif['WhiteBalance'] = $this->translator->trans('unknown');
            isset($eXif['EXIF']['FocalLengthIn35mmFilm']) ? $exifExif['FocalLengthIn35mmFilm'] = $eXif['EXIF']['FocalLengthIn35mmFilm'] : $exifExif['FocalLengthIn35mmFilm'] = 'unbekannt';
            isset($eXif['EXIF']['CustomRendered']) ? $exifExif['CustomRendered'] = $this->getCustomRendered($eXif['EXIF']['CustomRendered']) : $exifExif['CustomRendered'] = $this->translator->trans('unknown');
            isset($eXif['EXIF']['UndefinedTag:0xA434']) ? $exifExif['Objectiv'] = $eXif['EXIF']['UndefinedTag:0xA434'] : $exifExif['Objectiv'] = $this->translator->trans('unknown');
            $exifGPS = [];
            if (isset($eXif['GPS'])) {
                isset($eXif['GPS']['GPSLatitudeRef']) ? $exifGPS['GPSLatitudeRef'] = $eXif['GPS']['GPSLatitudeRef'] : $exifGPS['GPSLatitudeRef'] = $this->translator->trans('unknown');
                if (isset($eXif['GPS']['GPSLatitude'][0])) {
                    list($num, $den) = explode("/", $eXif['GPS']['GPSLatitude'][0]);
                    $exifGPS['GPSLatitude1'] = ($num / $den);
                } else {
                    $exifGPS['GPSLatitude1'] = false;
                }
                if (isset($eXif['GPS']['GPSLatitude'][1])) {
                    list($num, $den) = explode("/", $eXif['GPS']['GPSLatitude'][1]);
                    $exifGPS['GPSLatitude2'] = ($num / $den);
                } else {
                    $exifGPS['GPSLatitude2'] = false;
                }
                if (isset($eXif['GPS']['GPSLatitude'][2])) {
                    list($num, $den) = explode("/", $eXif['GPS']['GPSLatitude'][2]);
                    $exifGPS['GPSLatitude3'] = ($num / $den);
                } else {
                    $exifGPS['GPSLatitude3'] = false;
                }
                if (isset($eXif['GPS']['GPSLongitudeRef'])) {
                    $exifGPS['GPSLongitudeRef'] = $eXif['GPS']['GPSLongitudeRef'];
                } else {
                    $exifGPS['GPSLongitudeRef'] = false;
                }
                if (isset($eXif['GPS']['GPSLongitude'][0])) {
                    list($num, $den) = explode("/", $eXif['GPS']['GPSLongitude'][0]);
                    $exifGPS['GPSLongitude1'] = ($num / $den);
                } else {
                    $exifGPS['GPSLongitude1'] = false;
                }
                if (isset($eXif['GPS']['GPSLongitude'][1])) {
                    list($num, $den) = explode("/", $eXif['GPS']['GPSLongitude'][1]);
                    $exifGPS['GPSLongitude2'] = ($num / $den);
                } else {
                    $exifGPS['GPSLongitude2'] = false;
                }
                if (isset($eXif['GPS']['GPSLongitude'][2])) {
                    list($num, $den) = explode("/", $eXif['GPS']['GPSLongitude'][2]);
                    $exifGPS['GPSLongitude3'] = ($num / $den);
                } else {
                    $exifGPS['GPSLongitude3'] = false;
                }
                if (isset($eXif['GPS']['GPSAltitude'])) {
                    list($num, $den) = explode("/", $eXif['GPS']['GPSAltitude']);
                    $exifGPS['GPSAltitude'] = ($num / $den);
                } else {
                    $exifGPS['GPSAltitude'] = false;
                }
            }
            $osm = '';
            if ($exifGPS) {
                $extractGps = $helper->gps_map_extract($exifGPS);
                $GPSLongGrad = $extractGps['GPSLongGrad'] ?? '';
                $GPSLatGrad = $extractGps['GPSLatGrad'] ?? '';
                $exifGPS['GPSLongitude'] = $GPSLongGrad;
                $exifGPS['GPSLatitude'] = $GPSLatGrad;
               /* $osm = $helper->get_curl_json_data($GPSLatGrad, $GPSLongGrad);
                if ($osm->status) {
                    $osm = json_decode($osm->geo_json, true);
                }*/
            }
            $return->exifFile = ($exifFile);
            $return->exifComputed = ($exifComputed);
            $return->exifIFDO = ($exifIFDO);
            $return->exifExif = ($exifExif);
            $return->exifGPS = ($exifGPS);
            //$return->geo_data = $osm;
            $return->status = true;
            return $return;
        }


        $return->status = false;
        $return->msg = 'error - '.__LINE__;
        return $return;
    }


    /**
     * @param string $filename
     * @return stdClass
     */
    protected function _imagecreatefromjpegexif(string $filename): stdClass
    {
        $return = new stdClass();
        $exif = null;
        imagecreatefromjpeg($filename);
        if (function_exists('exif_read_data')) {
            $exif = @exif_read_data($filename, 'IFD0', true);
        }
        $return->status = true;
        $return->exif = $exif;
        return $return;
    }

    /**
     * @param int $var
     * @return string
     */
    private function getCustomRendered(int $var): string
    {
        switch ($var) {
            case 0:
                $return = 'normal';
                break;
            case 1:
                $return = $this->translator->trans('medien.Custom');
                break;
            case 2:
                $return = $this->translator->trans('medien.HDR (no original saved)');
                break;
            case 3:
                $return = $this->translator->trans('medien.HDR (original saved)');
                break;
            case 4:
                $return = 'Original (for HDR)';
                break;
            case 6:
                $return = 'Panorama';
                break;
            case 7:
                $return = 'Portrait HDR';
                break;
            case 8:
                $return = 'Portrait';
                break;
            default:
                $return = '';
        }
        return $return;
    }

    /**
     * @param int $var
     * @return string
     */
    private function getWhiteBalance(int $var): string
    {
        switch ($var) {
            case 0:
                $return = 'Auto';
                break;
            case 1:
                $return = 'Manuel';
                break;
            default:
                $return = $this->translator->trans('unknown');
        }
        return $return;
    }

    /**
     * @param int $var
     * @return string
     */
    private function getColorSpace(int $var): string
    {
        switch ($var) {
            case 0:
                $return = $this->translator->trans('unknown');
                break;
            case 1:
                $return = 'Gray Gamma 2.2';
                break;
            case 2:
                $return = 'sRGB';
                break;
            case 3:
                $return = 'Adobe RGB';
                break;
            case 4:
                $return = 'ProPhoto RGB';
                break;
            default:
                $return = $this->translator->trans('unknown');
        }
        return $return;
    }

    /**
     * @param int $var
     * @return string
     */
    private function getLightSource(int $var): string
    {
        switch ($var) {
            case 0:
                $return = $this->translator->trans('unknown');
                break;
            case 1:
                $return = $this->translator->trans('medien.Daylight');
                break;
            case 2:
                $return = $this->translator->trans('medien.Fluorescent');
                break;
            case 3:
                $return = $this->translator->trans('medien.Tungsten (Incandescent)');
                break;
            case 4:
                $return = $this->translator->trans('medien.Flash');
                break;
            case 9:
                $return = $this->translator->trans('medien.Fine Weather');
                break;
            case 10:
                $return = $this->translator->trans('medien.Cloudy');
                break;
            case 11:
                $return = $this->translator->trans('medien.Shade');
                break;
            case 12:
                $return = $this->translator->trans('medien.Daylight Fluorescent');
                break;
            case 13:
                $return = $this->translator->trans('medien.Day White Fluorescent');
                break;
            case 14:
                $return = $this->translator->trans('medien.Cool White Fluorescent');
                break;
            case 15:
                $return = $this->translator->trans('medien.White Fluorescent');
                break;
            case 16:
                $return = $this->translator->trans('medien.Warm White Fluorescent');
                break;
            case 17:
                $return = $this->translator->trans('medien.Standard Light A');
                break;
            case 18:
                $return = $this->translator->trans('medien.Standard Light B');
                break;
            case 19:
                $return = $this->translator->trans('medien.Standard Light C');
                break;
            case 20:
                $return = 'D55';
                break;
            case 21:
                $return = 'D65';
                break;
            case 22:
                $return = 'D75';
                break;
            case 23:
                $return = 'D50';
                break;
            case 24:
                $return = $this->translator->trans('medien.ISO Studio Tungsten');
                break;
            case 255:
                $return = $this->translator->trans('medien.other');
                break;
            default:
                $return = $this->translator->trans('unknown');
        }

        return $return;
    }

    /**
     * @param int $var
     * @return string
     */
    private function getMeteringMode(int $var): string
    {
        switch ($var) {
            case 0:
                $return = $this->translator->trans('unknown');
                break;
            case 1:
                $return = $this->translator->trans('medien.Wide');
                break;
            case 2:
                $return = $this->translator->trans('medien.Field');
                break;
            case 3:
                $return = $this->translator->trans('medien.centre');
                break;
            case 4:
                $return = $this->translator->trans('medien.Flexible spot');
                break;
            case 5:
                $return = $this->translator->trans('medien.Extended Flexible Spot');
                break;
            case 6:
                $return = $this->translator->trans('medien.AF lock Extended Flexible Spot');
                break;
            case 255:
                $return = $this->translator->trans('medien.other');
                break;
            default:
                $return = $this->translator->trans('unknown');
        }

        return $return;
    }

    /**
     * @param int $var
     * @return string
     */
    private function getResolutionUnit(int $var): string
    {
        switch ($var) {
            case 0:
                $return = 'None';
                break;
            case 1:
                $return = 'inches';
                break;
            case 2:
                $return = 'cm';
                break;
            default:
                $return = '';
        }
        return $return;
    }

    /**
     * @param int $var
     * @return string
     */
    private function getExposureProgram(int $var): string
    {
        switch ($var) {
            case 0:
                $return = $this->translator->trans('medien.Not Defined');
                break;
            case 1:
                $return = $this->translator->trans('medien.M (Manual)');
                break;
            case 2:
                $return = $this->translator->trans('medien.P (Program)');
                break;
            case 3:
                $return = $this->translator->trans('medien.Aperture Priority');
                break;
            case 4:
                $return = $this->translator->trans('medien.Shutter Priority');
                break;
            case 5:
                $return = $this->translator->trans('medien.Creative (Slow speed)');
                break;
            case 6:
                $return = $this->translator->trans('medien.Action (High speed)');
                break;
            case 7:
                $return = $this->translator->trans('medien.Portrait');
                break;
            case 8:
                $return = $this->translator->trans('medien.Landscape');
                break;
            case 9:
                $return = $this->translator->trans('medien.Bulb');
                break;
            default:
                $return = '';
        }
        return $return;
    }

    /**
     * @param int $var
     * @return string
     */
    private function getThumbnailCompression(int $var): string
    {
        switch ($var) {
            case 1:
                $return = 'Uncompressed';
                break;
            case 2:
                $return = 'CCITT 1D';
                break;
            case 3:
                $return = 'T4/Group 3 Fax';
                break;
            case 4:
                $return = 'T6/Group 4 Fax';
                break;
            case 5:
                $return = 'LZW';
                break;
            case 6:
                $return = 'JPEG (old-style)';
                break;
            case 7:
            case 99:
                $return = 'JPEG';
                break;
            case 8:
                $return = 'Adobe Deflate';
                break;
            case 9:
                $return = 'JBIG B&W';
                break;
            case 10:
                $return = 'JBIG Color';
                break;
            case 262:
                $return = 'Kodak 262';
                break;
            case 32766:
                $return = 'Next';
                break;
            case 32767:
                $return = 'Sony ARW Compressed';
                break;
            case 32769:
                $return = 'Packed RAW';
                break;
            case 32770:
                $return = 'Samsung SRW Compressed';
                break;
            case 32771:
                $return = 'CCIRLEW';
                break;
            case 32772:
                $return = 'Samsung SRW Compressed 2';
                break;
            case 32773:
                $return = 'PackBits';
                break;
            case 32809:
                $return = 'Thunderscan';
                break;
            case 32867:
                $return = 'Kodak KDC Compressed';
                break;
            case 32895:
                $return = 'IT8CTPAD';
                break;
            case 32896:
                $return = 'IT8LW';
                break;
            case 32897:
                $return = 'IT8MP';
                break;
            case 32898:
                $return = 'IT8BL';
                break;
            case 32908:
                $return = 'PixarFilm';
                break;
            case 32909:
                $return = 'PixarLog';
                break;
            case 32946:
                $return = 'Deflate';
                break;
            case 32947:
                $return = 'DCS';
                break;
            case 33003:
                $return = 'Aperio JPEG 2000 YCbCr';
                break;
            case 33005:
                $return = 'Aperio JPEG 2000 RGB';
                break;
            case 34661:
                $return = 'JBIG';
                break;
            case 34676:
                $return = 'SGILog';
                break;
            case 34677:
                $return = 'SGILog24';
                break;
            case 34712:
                $return = 'JPEG 2000';
                break;
            case 34713:
                $return = 'Nikon NEF Compressed';
                break;
            case 34715:
                $return = 'JBIG2 TIFF FX';
                break;
            case 34718:
                $return = 'Microsoft Document Imaging (MDI) Binary Level Codec';
                break;
            case 34719:
                $return = 'Microsoft Document Imaging (MDI) Progressive Transform Codec';
                break;
            case 34720:
                $return = 'Microsoft Document Imaging (MDI) Vector';
                break;
            case 34887:
                $return = ' ESRI Lerc';
                break;
            case 34892:
                $return = 'Lossy JPEG';
                break;
            case 34925:
                $return = 'LZMA2';
                break;
            case 34926:
                $return = 'Zstd';
                break;
            case 34927:
                $return = 'WebP';
                break;
            case 34933:
                $return = 'PNG';
                break;
            case 34934:
                $return = 'JPEG XR';
                break;
            case 65000:
                $return = 'Kodak DCR Compressed';
                break;
            case 65535:
                $return = 'Pentax PEF Compressed';
                break;
            default:
                $return = '';

        }
        return $return;
    }

}