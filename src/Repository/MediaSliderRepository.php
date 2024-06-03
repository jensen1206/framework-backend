<?php

namespace App\Repository;

use App\Entity\MediaSlider;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MediaSlider>
 *
 * @method MediaSlider|null find($id, $lockMode = null, $lockVersion = null)
 * @method MediaSlider|null findOneBy(array $criteria, array $orderBy = null)
 * @method MediaSlider[]    findAll()
 * @method MediaSlider[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MediaSliderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MediaSlider::class);
    }

//    /**
//     * @return MediaSlider[] Returns an array of MediaSlider objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?MediaSlider
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
