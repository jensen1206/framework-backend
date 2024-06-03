<?php

namespace App\Request;

interface RequestIdGeneratorInterface
{
    public function generate(): string;
}