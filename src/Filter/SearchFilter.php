<?php

namespace App\Filter;


use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;

use Doctrine\Common\Annotations\AnnotationReader;
use HttpInvalidParamException;
use ReflectionClass;
use ReflectionException;

class SearchFilter extends AbstractFilter
{
    /**
     * @throws ReflectionException
     * @throws HttpInvalidParamException
     */
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        if ($property === 'search') {
            $this->logger->info('Search for: ' . $value);
        } else {
            return;
        }

        $reader = new AnnotationReader();
        $annotation = $reader->getClassAnnotation(new ReflectionClass(new $resourceClass), SearchAnnotation::class);

        if (!$annotation) {
            throw new HttpInvalidParamException('No Search implemented.');
        }

        $parameterName = $queryNameGenerator->generateParameterName($property);
        $searchItems = explode(' ', str_replace('-', ' ', $value));

        if (is_array($searchItems)) {
            $andx = $queryBuilder->expr()->andx();

            foreach ($searchItems as $index => $searchItem) {
                $orx = $queryBuilder->expr()->orx();

                foreach ($annotation->fields as $field) {
                    $orx->add($queryBuilder->expr()->like('o.' . $field, ':' . $parameterName . '_' . $index));
                }

                if ($orx->count()) {
                    $queryBuilder->setParameter($parameterName . '_' . $index, '%' . $searchItem . '%');
                    $andx->add($orx);
                }
            }

            if ($andx->count()) {
                $queryBuilder->andWhere($andx);
            }
        }
    }


    /**
     * @param string $resourceClass
     * @return array
     * @throws ReflectionException
     */
    public function getDescription(string $resourceClass): array
    {
        $reader = new AnnotationReader();
        $annotation = $reader->getClassAnnotation(new ReflectionClass(new $resourceClass), SearchAnnotation::class);
        $description['search'] = [
            'property' => 'search',
            'type' => 'string',
            'required' => false,
            'description' => 'FullTextFilter on ' . implode(', ', $annotation->fields)
            //'description' => 'FullTextFilter',
            //'swagger' => ['description' => 'FullTextFilter on ' . implode(', ', $annotation->fields)],
        ];

        return $description;
    }
}