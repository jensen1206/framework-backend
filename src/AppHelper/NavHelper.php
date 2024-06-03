<?php

namespace App\AppHelper;

use App\Entity\AppMenu;
use App\Entity\MenuCategory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class NavHelper
{
    public function __construct(
        private readonly EntityManagerInterface $em,
    )
    {
    }

    /**
     * @throws ExceptionInterface
     */
    public function get_navigation($type):array
    {
        $nav = $this->em->getRepository(MenuCategory::class)->findOneBy(['type' => $type, 'active' => true]);
        if (!$nav) {
            return [];
        }
        $helper = Helper::instance();
        $repo = $this->em->getRepository(AppMenu::class);
        $catNode = $this->em->getRepository(AppMenu::class)->findOneBy(['menuCategory' => $nav, 'lvl' => 0]);
        $arrayGroups = $repo->childrenHierarchy($catNode, false);
        $arrayGroups = $helper->order_by_args($arrayGroups, 'position', 2);

        $serializer = new Serializer([new ObjectNormalizer()]);
        $data = $serializer->normalize($nav, null, [AbstractNormalizer::ATTRIBUTES => ['slug', 'title', 'type', 'active', 'description', 'id', 'menuSettings']]);
        $settings = $data['menuSettings'];
        unset($data['menuSettings']);
        $recursive = $this->array_values_recursive($arrayGroups);

        return [
            'settings' => $settings,
            'nav' => $recursive
        ];
    }

    private function array_values_recursive($array): array
    {
        $arr = [];
        $helper = Helper::instance();

        foreach ($array as $tmp) {
            if ($tmp['__children']) {
                if (count($tmp['__children'])) {
                    $tmp['__children'] = $helper->order_by_args($tmp['__children'], 'position', 2);
                }
                $child = $this->array_children($tmp['__children']);
                $tmp['__children'] = $child;
            }

            $arr[] = $tmp;
        }
        return $arr;
    }

    private function array_children($array): array
    {
        $helper = Helper::instance();
        $child = [];

        foreach ($array as $tmp) {

            if ($tmp['__children'] && count($tmp['__children'])) {
                $tmp['__children'] = $helper->order_by_args($tmp['__children'], 'position', 2);
                $this->array_children($tmp['__children']);
            }

            $child[] = $tmp;
        }
        return $child;

    }
}