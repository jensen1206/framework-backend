<?php

namespace App\Repository;

use App\Entity\EmailsSent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EmailsSent>
 *
 * @method EmailsSent|null find($id, $lockMode = null, $lockVersion = null)
 * @method EmailsSent|null findOneBy(array $criteria, array $orderBy = null)
 * @method EmailsSent[]    findAll()
 * @method EmailsSent[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EmailsSentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EmailsSent::class);
    }

    public function getSentMailsByLimit($limit=9, $ifShow=0): array
    {
        $em = $this->getEntityManager();
        return $em->createQueryBuilder()
            ->from(EmailsSent::class, 's')
            ->select('s')
            ->andWhere("s.ifShow =:if_show")
            ->setParameter('if_show', $ifShow)
            ->setMaxResults($limit)
            ->orderBy('s.createdAt', 'DESC')
            ->getQuery()
            ->getArrayResult();
    }

//    /**
//     * @return SentEmail[] Returns an array of SentEmail objects
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

//    public function findOneBySomeField($value): ?SentEmail
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
