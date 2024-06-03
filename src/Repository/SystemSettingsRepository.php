<?php

namespace App\Repository;

use App\Entity\SystemSettings;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SystemSettings>
 *
 * @method SystemSettings|null find($id, $lockMode = null, $lockVersion = null)
 * @method SystemSettings|null findOneBy(array $criteria, array $orderBy = null)
 * @method SystemSettings[]    findAll()
 * @method SystemSettings[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SystemSettingsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SystemSettings::class);
    }

//    /**
//     * @return Settings[] Returns an array of Settings objects
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

//    public function findOneBySomeField($value): ?Settings
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
