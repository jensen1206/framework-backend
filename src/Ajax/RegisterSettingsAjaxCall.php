<?php

namespace App\Ajax;

use App\Entity\Account;
use App\Entity\SystemSettings;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class RegisterSettingsAjaxCall
{
    protected object $responseJson;
    protected Request $data;


    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly TokenStorageInterface  $tokenStorage,
    )
    {
    }

    /**
     * @throws Exception
     */
    public function ajaxRegisterHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_REGISTRATION', $account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }


    private function get_settings():object
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $this->responseJson->status = true;
        $this->responseJson->record = $settings->getRegister();

        return $this->responseJson;
    }

    private function register_settings_handle():object
    {

        $registrierung = filter_var($this->data->get('registrierung'), FILTER_UNSAFE_RAW);
        if (!$registrierung) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $registrierung = json_decode($registrierung, true);

        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        if (!$settings) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings->setRegister($registrierung);
        $this->em->persist($settings);
        $this->em->flush();
        $this->responseJson->status = true;

        return $this->responseJson;
    }
}