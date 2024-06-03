<?php

namespace App\Repository;

use App\Entity\MediaExif;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MediaExif>
 *
 * @method MediaExif|null find($id, $lockMode = null, $lockVersion = null)
 * @method MediaExif|null findOneBy(array $criteria, array $orderBy = null)
 * @method MediaExif[]    findAll()
 * @method MediaExif[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MediaExifRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MediaExif::class);
    }

//    /**
//     * @return MediaExif[] Returns an array of MediaExif objects
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

//    public function findOneBySomeField($value): ?MediaExif
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
