<?php

namespace App\Repository;

use App\Entity\PluginSections;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PluginSections>
 *
 * @method PluginSections|null find($id, $lockMode = null, $lockVersion = null)
 * @method PluginSections|null findOneBy(array $criteria, array $orderBy = null)
 * @method PluginSections[]    findAll()
 * @method PluginSections[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PluginSectionsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PluginSections::class);
    }

//    /**
//     * @return PluginSections[] Returns an array of PluginSections objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?PluginSections
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
