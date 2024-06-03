<?php

namespace App\EventListener;

use App\AppHelper\EmHelper;
use App\Entity\SystemSettings;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\HttpKernelInterface;

class CompressionSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly EmHelper               $emHelper
    )
    {
    }

    public function onKernelResponse($event): void
    {

        if ($event->getRequestType() != HttpKernelInterface::MAIN_REQUEST) {
            return;
        }
        $route = $event->getRequest()->attributes->get('_route');
        if ($route == 'download_form_builder' ||
            $route == 'download_media' ||
            $route == 'stream_media' ||
            $route == 'download_forms' ||
            $route == 'download_form_builder_element'
        ) {
            return;
        }
        if (!$this->emHelper->system_is_installed('SUPER_ADMIN')) {
            return;
        }
        $sysSettings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $response = $event->getResponse();

        if ($sysSettings && $sysSettings->getApp()['html_minimise']) {
            $content = preg_replace(
                ['/<!--(.*)-->/Uis', "/[[:blank:]]+/"],
                ['', ' '],
                str_replace(["\n", "\r", "\t"], '', $response->getContent())
            );

        } else {
            $content = $response->getContent();
        }
        $response->setContent($content);

    }

    public function onKernelController(ControllerEvent $event)
    {
        // dd($event->getAttributes(),$event->getRequest()->get('slug'));
    }

    public static function getSubscribedEvents(): array
    {

        return [
            KernelEvents::CONTROLLER => 'onKernelController',
            KernelEvents::RESPONSE => ['onKernelResponse', -256]
        ];
    }
}