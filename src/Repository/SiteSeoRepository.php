<?php

namespace App\Repository;

use App\Entity\SiteSeo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SiteSeo>
 *
 * @method SiteSeo|null find($id, $lockMode = null, $lockVersion = null)
 * @method SiteSeo|null findOneBy(array $criteria, array $orderBy = null)
 * @method SiteSeo[]    findAll()
 * @method SiteSeo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SiteSeoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SiteSeo::class);
    }

//    /**
//     * @return SiteSeo[] Returns an array of SiteSeo objects
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

//    public function findOneBySomeField($value): ?SiteSeo
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
