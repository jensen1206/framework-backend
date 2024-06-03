<?php

namespace App\Repository;

use App\Entity\Account;
use App\Entity\OAuth2UserConsent;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;
use League\Bundle\OAuth2ServerBundle\Model\Client as clientModel;

/**
 * @extends ServiceEntityRepository<Account>
 *
 * @method Account|null find($id, $lockMode = null, $lockVersion = null)
 * @method Account|null findOneBy(array $criteria, array $orderBy = null)
 * @method Account[]    findAll()
 * @method Account[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AccountRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Account::class);
    }

    /**
     * @throws NonUniqueResultException
     */
    public function getByAccount($account): array
    {

        $em = $this->getEntityManager();
        $query = $em->createQueryBuilder();
        $query
            ->from(Account::class, 'a')
            ->select(
                'o.name, o.identifier,o.secret,o.redirectUris,o.grants,o.scopes,o.active, uc.created as consentCreated, uc.expires, uc.scopes as consentScopes, uc.ipAddress, uc.id as consentId')
            //->leftJoin('a.accountHolder', 'accountHolder')
            ->andWhere('a.id =:account_holder')
            ->LeftJoin(
                clientModel::class,
                'o',
                Join::WITH,
                'o.identifier =:clientUuid'
            )
            ->leftJoin(
                OAuth2UserConsent::class,
                'uc',
                Join::WITH,
                'uc.client =:clientUuid'
            )
            ->setParameter('account_holder', $account)
            ->setParameter('clientUuid', $account->getAccountHolder()->getUuid()->toBase32());
        return $query->getQuery()->getScalarResult()[0] ?? [];
    }

    public function get_validate_user($limit = null, $count = false):array|int
    {
        $em = $this->getEntityManager();
        $query = $em->createQueryBuilder();
        $query
            ->from(Account::class, 'a')
            ->select('a, u')
            ->leftJoin('a.accountHolder', 'u')
            ->andWhere('a.mustValidated=1')
            ->andWhere('u.isVerified=0')
            ->andWhere('JSON_CONTAINS(u.roles, :role) = 0')
            ->setParameter('role', '"ROLE_SUPER_ADMIN"');

        if($count){
            return count($query->getQuery()->getArrayResult());
        }
        if($limit){
            $query->setMaxResults($limit);
        }
        return $query->getQuery()->getArrayResult();
    }


//    /**
//     * @return Account[] Returns an array of Account objects
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

//    public function findOneBySomeField($value): ?Account
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
