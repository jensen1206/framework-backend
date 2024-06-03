<?php

namespace App\Controller;

use Exception;
use stdClass;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Yaml\Yaml;

class EventController extends AbstractController
{
    private Request $request;

    public function __construct(

    )
    {
    }

    #[Route('/system-event', name: 'system_event')]
    public function composer_event(Request $request): void
    {
        $response = new StreamedResponse();
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $this->request = $request;
        $response->setCallback(function (): void {
            try {
                $return = [];
                echo "event: systemLog\n";
                echo 'data: ' . json_encode($return);
                echo "\n\n";
            } catch (Exception $e) {
                $return = [
                    'code' => $e->getCode(),
                    'msg' => $e->getMessage()
                ];
                echo "event: errorLog\n";
                echo 'data: ' . json_encode($return);
                echo "\n\n";
            }


            flush();
            sleep(1);

            session_write_close();
            if (connection_aborted()) {
                //break;
            }
        });

        $response->send();
    }

    /**
     * @throws Exception
     */
    private function get_composer_log($newCount, $config): object
    {
        $response = new stdClass();
        $filesystem = new Filesystem();
        $response->status = false;



        return $response;
        //throw new Exception('RegEx error (' . __LINE__ . ')', 1);
    }


}
