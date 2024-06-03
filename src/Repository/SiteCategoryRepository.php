<?php

namespace App\Repository;

use App\Entity\SiteCategory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SiteCategory>
 *
 * @method SiteCategory|null find($id, $lockMode = null, $lockVersion = null)
 * @method SiteCategory|null findOneBy(array $criteria, array $orderBy = null)
 * @method SiteCategory[]    findAll()
 * @method SiteCategory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SiteCategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SiteCategory::class);
    }

//    /**
//     * @return SiteCategory[] Returns an array of SiteCategory objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('s.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?SiteCategory
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
