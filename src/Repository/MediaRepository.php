<?php

namespace App\Repository;

use App\Entity\Media;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Media>
 *
 * @method Media|null find($id, $lockMode = null, $lockVersion = null)
 * @method Media|null findOneBy(array $criteria, array $orderBy = null)
 * @method Media[]    findAll()
 * @method Media[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MediaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Media::class);
    }

    public function findMediaById($id):array
    {
        $query = $this->createQueryBuilder('m')
            ->select('m, u, c, e')
            ->leftJoin('m.user', 'u')
            ->leftJoin('m.category', 'c')
            ->leftJoin('m.exifData', 'e')
            ->andWhere('m.id=:id')
            ->setParameter('id', $id)
            ->getQuery()->getArrayResult();

        $return = $query[0] ?? null;
        if($return) {
            unset($return['user']['uuid']);
            unset($return['user']['password']);
            unset($return['user']['totpSecret']);
            unset($return['user']['roles']);
            $return['lastMod'] = $return['lastModified']->format('d.m.Y H:i:s');
            $return['created'] = $return['createdAt']->format('d.m.Y H:i:s');
            return $return;
        }

        return [];
    }

//    /**
//     * @return Media[] Returns an array of Media objects
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

//    public function findOneBySomeField($value): ?Media
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
