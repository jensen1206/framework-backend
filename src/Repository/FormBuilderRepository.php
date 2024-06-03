<?php

namespace App\Repository;

use App\Entity\FormBuilder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FormBuilder>
 *
 * @method FormBuilder|null find($id, $lockMode = null, $lockVersion = null)
 * @method FormBuilder|null findOneBy(array $criteria, array $orderBy = null)
 * @method FormBuilder[]    findAll()
 * @method FormBuilder[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FormBuilderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FormBuilder::class);
    }

//    /**
//     * @return FormBuilder[] Returns an array of FormBuilder objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('f.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?FormBuilder
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
