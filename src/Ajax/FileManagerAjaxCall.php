<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\Media;
use App\Entity\MediaCategory;
use App\Entity\User;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class FileManagerAjaxCall
{
    protected object $responseJson;

    protected Request $data;
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly CacheManager           $imagineCacheManager,
        private readonly string                 $uploadsPath,
        private readonly string                 $uploadsDirName
    )
    {

    }

    /**
     * @throws Exception
     */
    public
    function ajaxFileManager(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }

        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    /**
     * @throws Exception
     */
    private function get_filemanager_media(): object
    {
        $limit = 36;

        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $page = filter_var($this->data->get('page'), FILTER_VALIDATE_INT);
        $options = filter_var($this->data->get('options'), FILTER_UNSAFE_RAW);
        $searchUser = filter_var($this->data->get('user'), FILTER_UNSAFE_RAW);
        $searchType = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);
        $searchCat = filter_var($this->data->get('category'), FILTER_VALIDATE_INT);
        $search = filter_var($this->data->get('search'), FILTER_UNSAFE_RAW);
        $this->responseJson->is_select = filter_var($this->data->get('is_select'), FILTER_VALIDATE_BOOL);

        if (!$options || !$page) {
            $this->responseJson->msg = $this->translator->trans('fm.Options not found.') . ' (FM-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $fmOptions = json_decode($options, true);
        $this->responseJson->options = json_decode($options, true);

        $this->responseJson->next_page = false;
        if ($page > 1) {
            $this->responseJson->next_page = true;
        }
        $fileType = $fmOptions['fileType'] ?? null;


        $query = $this->em->createQueryBuilder();
        $query
            ->from(Media::class, 'm')
            ->select(
                'm.id, 
                m.fileName,
                m.original,
                m.title,
                u.email,
                m.description,
                c.id as catId,
                c.designation')
            ->leftJoin('m.user', 'u')
            ->leftJoin('m.category', 'c')
            ->andWhere('m.showFilemanager=1');
        if ($searchCat) {
            $query
                ->andWhere('c.id=:category')
                ->setParameter('category', $searchCat);
        }
        if ($searchUser) {
            $query
                ->andWhere("REGEXP(u.email, :regValue) = 1")
                ->setParameter('regValue', "^$searchUser$");
        }
        if ($searchType) {
            $query
                ->andWhere("REGEXP(m.mime, :regValue) = 1")
                ->setParameter('regValue', "^$searchType");
        }

        if ($fileType) {
            $query
                ->andWhere("REGEXP(m.mime, :regValue) = 1")
                ->setParameter('regValue', "^$fileType");
        }

        if ($search) {
            $query->andWhere(
                'm.fileName LIKE :searchTerm OR
                 m.original LIKE :searchTerm OR
                 m.title LIKE :searchTerm OR
                 m.description LIKE :searchTerm OR
                 c.designation LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }

        $countAll = $query->getQuery()->getArrayResult();
        $mediaCount = count($countAll);

        $first = ($page - 1) * $limit;
        $totalPage = (int)ceil($mediaCount / $limit);
        $totalPage > $page ? $nextPage = $page + 1 : $nextPage = false;

        $query = $this->em->createQueryBuilder();
        $query
            ->from(Media::class, 'm')
            ->select('m, u, c')
            ->leftJoin('m.user', 'u')
            ->leftJoin('m.category', 'c')
            ->setFirstResult($first)
            ->setMaxResults($limit)
            ->andWhere('m.showFilemanager=1');

        if ($searchCat) {
            $query
                ->andWhere('c.id=:cat')
                ->setParameter('cat', $searchCat);
        }
        if ($searchUser) {
            $query
                ->andWhere("REGEXP(u.email, :regValue) = 1")
                ->setParameter('regValue', "^$searchUser$");
        }
        if ($searchType) {

            $query
                ->andWhere("REGEXP(m.mime, :regValue) = 1")
                ->setParameter('regValue', "^$searchType");
        }

        if ($fileType) {
            $query
                ->andWhere("REGEXP(m.mime, :regValue) = 1")
                ->setParameter('regValue', "^$fileType");
        }

        if ($search) {
            $query->andWhere(
                'm.fileName LIKE :searchTerm OR
                 m.type LIKE :searchTerm OR
                 m.attr LIKE :searchTerm OR
                 m.title LIKE :searchTerm OR
                 m.alt LIKE :searchTerm OR
                 m.description LIKE :searchTerm OR
                 c.designation LIKE :searchTerm OR
                 m.createdAt LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }

        $result = $query->getQuery()->getArrayResult();

        if (!$result) {
            $this->responseJson->msg = $this->translator->trans('fm.No files found.') . ' (FM-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $helper = Helper::instance();
        $loaded = ($page * $limit);
        $record = [];
        $languages = $this->data->getLanguages();
        $lang = strstr($languages[0], '_', true);

        $thumbUrl = $this->uploaderHelper->getThumbnailPath($this->uploaderHelper::MEDIATHEK);
        $mediumUrl = $this->uploaderHelper->getMediumPath($this->uploaderHelper::MEDIATHEK);
        $largeUrl = $this->uploaderHelper->getLargePath($this->uploaderHelper::MEDIATHEK);
        $largeXlUrl = $this->uploaderHelper->getLargeXlFilterPath($this->uploaderHelper::MEDIATHEK);
        $fullUrl = $this->uploaderHelper->getLargeXlFilterPath($this->uploaderHelper::MEDIATHEK);

        $thumbPath = $this->uploadsPath . 'media/cache/squared_thumbnail_small/' . $this->uploaderHelper::MEDIATHEK . '/';
        $mediumPath = $this->uploadsPath . 'media/cache/medium_image_filter/' . $this->uploaderHelper::MEDIATHEK . '/';
        $largePath = $this->uploadsPath . 'media/cache/large_image_filter/' . $this->uploaderHelper::MEDIATHEK . '/';
        $largeXlPath = $this->uploadsPath . 'media/cache/full_image_filter/' . $this->uploaderHelper::MEDIATHEK . '/';
        // dd($fullUrl);
        foreach ($result as $tmp) {
            unset($tmp['user']['uuid']);
            unset($tmp['user']['password']);
            unset($tmp['user']['totpSecret']);
            $urls = [];
            if ($tmp['type'] == 'image') {
                $thumbAttr = '';
                $regExMedia = '/\/media.+/';
                if (is_file($thumbPath . $tmp['fileName'])) {
                    $thumbAttr = $helper->get_image_size($thumbPath . $tmp['fileName']);
                    preg_match($regExMedia, $thumbUrl, $matches);
                    $thumbUrl = $matches[0];
                }
                $mediumAttr = '';
                if (is_file($mediumPath . $tmp['fileName'])) {
                    $mediumAttr = $helper->get_image_size($mediumPath . $tmp['fileName']);
                    preg_match($regExMedia, $mediumUrl, $matches);
                    $mediumUrl = $matches[0];
                }
                $largeAttr = '';
                if (is_file($largePath . $tmp['fileName'])) {
                    $largeAttr = $helper->get_image_size($largePath . $tmp['fileName']);
                    preg_match($regExMedia, $largeUrl, $matches);
                    $largeUrl = $matches[0];
                }
                $largeXlAttr = '';
                if (is_file($largeXlPath . $tmp['fileName'])) {
                    $largeXlAttr = $helper->get_image_size($largeXlPath . $tmp['fileName']);
                    preg_match($regExMedia, $largeXlUrl, $matches);
                    $largeXlUrl = $matches[0];
                }
                $urls = [
                    'thumbnail' => [
                        'attr' => $thumbAttr,
                        'url' => $thumbUrl . '/' . $tmp['fileName'],
                    ],
                    'medium' => [
                        'attr' => $mediumAttr,
                        'url' => $mediumUrl . '/' . $tmp['fileName'],
                    ],
                    'large' => [
                        'attr' => $largeAttr,
                        'url' => $largeUrl . '/' . $tmp['fileName'],
                    ],
                    'xl-large' => [
                        'attr' => $largeXlAttr,
                        'url' => $largeXlUrl . '/' . $tmp['fileName'],
                    ],
                    'full' => [
                        'attr' => $tmp['sizeData'],
                        'url' => '/'.$this->uploadsDirName.'/' . $this->uploaderHelper::MEDIATHEK . '/' . $tmp['fileName'],
                    ],
                ];
            }

            $tmp['urls'] = $urls;
            $tmp['file_size'] = $helper->FileSizeConvert((float)$tmp['size']);
            $lastMod = new DateTime($tmp['lastModified']->format('Y-m-d H:i:s'));
            $created = new DateTime($tmp['createdAt']->format('Y-m-d H:i:s'));
            $tmp['created_de'] = $helper->formatLanguage($created, 'D\. F Y', 'de');
            $tmp['last_modified_de'] = $helper->formatLanguage($lastMod, 'd\. F Y', 'de');
            $record[] = $tmp;
        }
        $links = [
            'liip_extensions' => $this->liip_imagine_extensions,
            'thumb_url' => $thumbUrl,
            'medium_url' => $mediumUrl,
            'large_url' => $largeUrl,
            'large_xl_url' => $largeXlUrl,
            'media_url' => $fullUrl,
        ];

        $usrSelect = [];
        if ($user->isSuAdmin()) {
            $userData = $this->em->getRepository(User::class)->findAll();
            foreach ($userData as $tmp) {
                $item = [
                    'id' => $tmp->getEmail(),
                    'label' => $tmp->getEmail()
                ];
                $usrSelect[] = $item;
            }
        }

        $catSelects = [];
        $categories = $this->em->getRepository(MediaCategory::class)->findBy([], ['position' => 'asc']);
        foreach ($categories as $tmp) {
            if ($tmp->getUser()->getId() != $user->getId()) {
                $label = $tmp->getDesignation() . ' (' . $this->translator->trans('fm.User category') . ')';
                if ($user->isSuAdmin()) {
                    $label = $tmp->getDesignation() . ' (' . $tmp->getUser()->getEmail() . ')';
                }
            } else {
                $label = $tmp->getDesignation();
            }
            $item = [
                'id' => $tmp->getId(),
                'label' => $label
            ];
            $catSelects[] = $item;
        }

        $firstSelect = [
            '0' => [
                'id' => 0,
                'label' => $this->translator->trans('All')
            ]
        ];

        $mimes = [];
        $mimeArr = [];
        $query = $this->em->createQueryBuilder()
            ->from(Media::class, 'm')
            ->select('DISTINCT m.mime');

        $mimeItems = $query->getQuery()->getArrayResult();
        foreach ($mimeItems as $tmp) {
            $mimes[] = strstr($tmp['mime'], '/', true);
        }
        $mimes = array_merge(array_unique($mimes));
        foreach ($mimes as $tmp) {
            $item = [
                'id' => $tmp,
                'label' => ucfirst($tmp)
            ];
            $mimeArr[] = $item;
        }
        //dd($record);
        $this->responseJson->user_selects = array_merge_recursive($firstSelect, $usrSelect);
        $this->responseJson->category_selects = array_merge_recursive($firstSelect, $catSelects);
        $this->responseJson->types_select = array_merge_recursive($firstSelect, $mimeArr);
        $this->responseJson->urls = $links;
        $this->responseJson->record = $record;
        $this->responseJson->total = $mediaCount;
        $this->responseJson->loaded = $loaded;
        $this->responseJson->next = $nextPage;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_media_file(): object
    {

        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        if (!$this->security->isGranted('MANAGE_MEDIEN', $account)) {
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (FM-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $media = $this->em->getRepository(Media::class)->find($id);
        if (!$media) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $title = filter_var($this->data->get('title'), FILTER_UNSAFE_RAW);
        $description = filter_var($this->data->get('description'), FILTER_UNSAFE_RAW);
        $labelling = filter_var($this->data->get('labelling'), FILTER_UNSAFE_RAW);
        $alt = filter_var($this->data->get('alt'), FILTER_UNSAFE_RAW);
        $media->setAlt($alt ?? '');
        $media->setTitle($title ?? '');
        $media->setDescription($description ?? '');
        $media->setLabelling($labelling ?? '');
        $this->em->persist($media);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }
}