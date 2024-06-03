<?php

namespace App\Message\Event;

use App\Entity\EmailsSent;
use App\Message\Command\SavePublicEmail;



class EmailPublicSentEvent
{
    public function __construct(private readonly SavePublicEmail $email)
    {
    }

    public function getSentEmail(): SavePublicEmail
    {
        return $this->email;
    }

}