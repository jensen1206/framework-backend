<?php

namespace App\Request;
use Symfony\Component\Uid\Uuid;
class RequestUuidGenerator implements RequestIdGeneratorInterface
{

    public function generate(): string
    {
        return Uuid::v4()->toRfc4122();
    }
}