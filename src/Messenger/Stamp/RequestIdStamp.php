<?php

namespace App\Messenger\Stamp;

use Symfony\Component\Messenger\Stamp\StampInterface;

class RequestIdStamp implements StampInterface
{
    public function __construct(
        private readonly string $requestId
    )
    {
    }

    public function getRequestId(): string
    {
        return $this->requestId;
    }
}