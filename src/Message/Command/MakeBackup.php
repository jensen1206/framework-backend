<?php

namespace App\Message\Command;

class MakeBackup
{

    public function __construct(private readonly array $args)
    {

    }

    public function isAsync(): bool
    {
        return $this->args['async'];
    }

    public function zipFileName():string
    {
        return $this->args['filename'];
    }

    public function getVersion(): string
    {
        return $this->args['version'];
    }
}