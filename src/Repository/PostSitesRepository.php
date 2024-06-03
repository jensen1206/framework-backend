<?php

namespace App\Repository;

use App\Entity\PostSites;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PostSites>
 *
 * @method PostSites|null find($id, $lockMode = null, $lockVersion = null)
 * @method PostSites|null findOneBy(array $criteria, array $orderBy = null)
 * @method PostSites[]    findAll()
 * @method PostSites[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostSitesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PostSites::class);
    }

    //    /**
    //     * @return PostSites[] Returns an array of PostSites objects
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

    //    public function findOneBySomeField($value): ?PostSites
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
