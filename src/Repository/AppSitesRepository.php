<?php

namespace App\Repository;

use App\Entity\AppSites;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AppSites>
 *
 * @method AppSites|null find($id, $lockMode = null, $lockVersion = null)
 * @method AppSites|null findOneBy(array $criteria, array $orderBy = null)
 * @method AppSites[]    findAll()
 * @method AppSites[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AppSitesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AppSites::class);
    }

//    /**
//     * @return AppSites[] Returns an array of AppSites objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?AppSites
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
