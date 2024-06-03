<?php

namespace App\Repository;

use App\Entity\Backups;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Backups>
 *
 * @method Backups|null find($id, $lockMode = null, $lockVersion = null)
 * @method Backups|null findOneBy(array $criteria, array $orderBy = null)
 * @method Backups[]    findAll()
 * @method Backups[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BackupsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Backups::class);
    }

//    /**
//     * @return Backups[] Returns an array of Backups objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('b')
//            ->andWhere('b.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('b.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Backups
//    {
//        return $this->createQueryBuilder('b')
//            ->andWhere('b.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
