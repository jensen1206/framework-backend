<?php

namespace App\Repository;

use App\Entity\Log;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Log>
 *
 * @method Log|null find($id, $lockMode = null, $lockVersion = null)
 * @method Log|null findOneBy(array $criteria, array $orderBy = null)
 * @method Log[]    findAll()
 * @method Log[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Log::class);
    }

    public function get_activity_log($limit = null, $channel=null,  $count = false): array|int
    {

        $em = $this->getEntityManager();
        $query = $em->createQueryBuilder()
            ->select('l')
            ->from(Log::class, 'l')
            ->andWhere('l.logShow=:logShow')
            ->setParameter('logShow', false)
            ->orderBy('l.createdAt', 'DESC');
        if($channel) {
            $query
                ->andWhere('l.channel=:channel')
                ->setParameter('channel', $channel);
        }
        if ($count) {
            return count($query->getQuery()->getArrayResult());
        }
        if ($limit) {
            $query->setMaxResults($limit);
        }

        return $query->getQuery()->getArrayResult();

    }

    public function getActivityLogById($id):array
    {
        $em = $this->getEntityManager();
        $query = $em->createQueryBuilder()
            ->from(Log::class, 'l')
            ->select('l, u')
            ->leftJoin('l.user', 'u')
            ->andWhere('l.id = :id')
            ->setParameter('id', $id);
        $result = $query->getQuery()->getArrayResult();
        if ($result) {
            return $result[0];
        }

        return [];
    }

//    /**
//     * @return Log[] Returns an array of Log objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('l.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Log
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
