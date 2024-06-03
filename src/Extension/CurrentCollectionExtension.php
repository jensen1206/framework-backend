<?php

namespace App\Extension;
use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Metadata\CollectionOperationInterface;

final class CurrentCollectionExtension implements QueryCollectionExtensionInterface
{
    public function __construct()
    {
    }
    public function applyToCollection(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        Operation $operation = null,
        array $context = []
    ): void {
        if ($operation instanceof CollectionOperationInterface) {
            $this->addOffsetLimit($queryBuilder, $context);
        }

    }

    private function addOffsetLimit(QueryBuilder $queryBuilder, array $context = []): void
    {
        $offset = $context['filters']['offset'] ?? 0;
        $limit = $context['filters']['limit'] ?? null;
        if($limit){
            $queryBuilder->setFirstResult($offset)
                ->setMaxResults($limit);
        }
    }
}