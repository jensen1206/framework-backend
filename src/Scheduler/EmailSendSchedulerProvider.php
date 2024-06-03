<?php

namespace App\Scheduler;
use App\Message\Event\EmailPublicSchedulerEvent;
use Symfony\Component\Scheduler\Attribute\AsSchedule;
use Symfony\Component\Scheduler\RecurringMessage;
use Symfony\Component\Scheduler\Schedule;
use Symfony\Component\Scheduler\ScheduleProviderInterface;
use Symfony\Component\Lock\LockFactory;
use Symfony\Component\Lock\Store\SemaphoreStore;

#[AsSchedule('send_mail')]
class EmailSendSchedulerProvider implements ScheduleProviderInterface
{
    public function getSchedule(): Schedule
    {
        $store = new SemaphoreStore();
        $factory = new LockFactory($store);
       return (new Schedule())->add(
           RecurringMessage::every('60 seconds', new EmailPublicSchedulerEvent()))
           ->lock($factory->createLock('email-send-lock'));
    }
}