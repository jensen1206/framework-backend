<?php

namespace App\Service;


use React\EventLoop\Loop;
use React\EventLoop\LoopInterface;

class RocketsEventLoop
{
    public function __construct()
    {
    }

    public function loop_timer(): void
    {
        $loop = Loop::get();

        $counter = 0;
        $timer = $loop->addPeriodicTimer(1, function () use (&$counter, &$timer, $loop) {
            echo 'Hello ' . $counter . '!' . PHP_EOL;

            if ($counter === 5) {
                $loop->cancelTimer($timer);
            }
        });

        //$loop->run();
    }

}

