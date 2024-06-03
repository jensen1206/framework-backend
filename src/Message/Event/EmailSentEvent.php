<?php

namespace App\Message\Event;

use App\Entity\EmailsSent;
use App\Message\Command\SaveEmail;

class EmailSentEvent
{
    public function __construct(private readonly SaveEmail $email)
    {
    }

    public function getSentEmail(): SaveEmail
    {
        return $this->email;
    }

}