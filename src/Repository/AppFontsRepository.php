<?php

namespace App\Repository;

use App\Entity\AppFonts;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use stdClass;

/**
 * @extends ServiceEntityRepository<AppFonts>
 *
 * @method AppFonts|null find($id, $lockMode = null, $lockVersion = null)
 * @method AppFonts|null findOneBy(array $criteria, array $orderBy = null)
 * @method AppFonts[]    findAll()
 * @method AppFonts[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AppFontsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AppFonts::class);
    }

    public function get_install_font_type($family, $local_name = null): object
    {
        $result = new stdClass();
        $result->status = false;
        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();
        $qb->from(AppFonts::class, 'f')
            ->select('f')
            ->andWhere('f.designation=:designation')
            ->setParameter('designation', $family);
        $query = $qb->getQuery()->getArrayResult();
        if(!$query){
            return $result;
        }
        foreach ($query as $tmp) {
            $local = $tmp['localName'];
            if($local) {
                if(in_array($local_name, $local)){
                    $result->status = true;
                    $result->record = $local;
                    return $result;
                }
            }
            $result->status = false;
            return $result;
        }
        return $result;
    }
    //    /**
    //     * @return AppFonts[] Returns an array of AppFonts objects
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

    //    public function findOneBySomeField($value): ?AppFonts
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
