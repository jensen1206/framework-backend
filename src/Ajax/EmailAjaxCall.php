<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\EmailsSent;
use App\Entity\Media;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Message\Command\SaveEmail;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Parameter;
use Exception;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class EmailAjaxCall
{
    protected object $responseJson;
    protected Request $data;
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly MessageBusInterface    $bus,
        private readonly string                 $uploadsPrivatePath,
        private readonly string                 $emailTemplatePath,
        private readonly string                 $projectDir

    )
    {
    }

    /**
     * @throws Exception
     */
    public function ajaxEmailHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_EMAIL', $account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    /**
     * @throws ExceptionInterface
     */
    private function get_sent_email(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $sentMail = $this->em->getRepository(EmailsSent::class)->find($id);
        if (!$sentMail) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $sentDate = $sentMail->getCreatedAt()->format('d.m.Y H:i:s');
        $serializer = new Serializer([new ObjectNormalizer()]);
        $sentEmailArr = $serializer->normalize($sentMail);
        $sentEmailArr['emailBcc'] = implode(' • ', $sentEmailArr['emailBcc']);
        $sentEmailArr['emailCc'] = implode(' • ', $sentEmailArr['emailCc']);
        $attachments = [];

        if ($sentEmailArr['emailAttachments']) {
            foreach ($sentEmailArr['emailAttachments'] as $tmp) {
                if (is_array($tmp)) {
                    $file = $tmp['file'];
                    if (is_file($file)) {
                        $fileinfo = pathinfo($file);
                        $item = [
                            'filename' => $tmp['name'],
                            'extension' => $fileinfo['extension'],
                            'download_url' => $this->urlGenerator->generate('download_media', ['is_public' => 0, 'directory' => $this->uploaderHelper::ATTACHMENT, 'file' => $tmp['file_name']])
                        ];
                        $attachments[] = $item;
                    }
                } else {
                    $file = $this->projectDir . DIRECTORY_SEPARATOR . $tmp;
                    if (is_file($file)) {
                        $fileinfo = pathinfo($file);
                        $dirInfo = $fileinfo['dirname'];
                        $type = strstr($tmp, '/', true);
                        $last = substr($dirInfo, strrpos($dirInfo, '/') + 1);
                        $type == 'public' ? $isPublic = 1 : $isPublic = 0;
                        $item = [
                            'filename' => $fileinfo['filename'],
                            'extension' => $fileinfo['extension'],
                            'download_url' => $this->urlGenerator->generate('download_media', ['is_public' => $isPublic, 'directory' => $last, 'file' => $fileinfo['basename']])
                        ];
                        $attachments[] = $item;
                    }
                }


            }
        }
        $sentMail->setIfShow(true);
        $this->em->persist($sentMail);
        $this->em->flush();
        $this->responseJson->iframe = $this->urlGenerator->generate('dashboard_iframe_email_sent', ['id' => $id]);
        $sentEmailArr['createdAt'] = $sentDate;
        unset($sentEmailArr['emailContext']);
        unset($sentEmailArr['emailTemplate']);
        unset($sentEmailArr['emailAttachments']);
        $this->responseJson->record = $sentEmailArr;
        $this->responseJson->attachments = $attachments;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_email(): object
    {
        $this->responseJson->title = $this->translator->trans('Error');
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $sentMail = $this->em->getRepository(EmailsSent::class)->find($id);
        if (!$sentMail) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $this->em->remove($sentMail);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('system.The file was successfully deleted.');
        $this->responseJson->title = $this->translator->trans('system.Deleted') . '!';
        return $this->responseJson;
    }

    private function delete_all_email(): object
    {
        $allEmails = $this->em->getRepository(EmailsSent::class)->findAll();
        if ($allEmails) {
            foreach ($allEmails as $email) {
                $this->em->remove($email);
            }
            $this->em->flush();
        }
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('system.All entries have been deleted.');
        $this->responseJson->title = $this->translator->trans('system.Deleted') . '!';
        return $this->responseJson;
    }

    private function send_email(): object
    {
        $this->responseJson->title = $this->translator->trans('Error');
        $emailData = filter_var($this->data->get('email'), FILTER_UNSAFE_RAW);
        $attachments = filter_var($this->data->get('attachments'), FILTER_UNSAFE_RAW);
        if (!$emailData) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $emailData = json_decode($emailData, true);

        $recipient = filter_var($emailData['recipient'], FILTER_VALIDATE_EMAIL);
        $subject = filter_var($emailData['subject'], FILTER_UNSAFE_RAW);
        $content = filter_var($emailData['content'], FILTER_UNSAFE_RAW);
        if (!$recipient || !$subject) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $attachIds = [];
        if ($attachments) {
            $attachments = json_decode($attachments, true);
            foreach ($attachments as $tmp) {
                $item = $tmp['id'];
                $attachIds[] = $item;
            }
        }
        $cc = [];
        $bcc = [];
        $attachIds = array_merge(array_unique(array_filter($attachIds)));
        $helper = Helper::instance();
        if ($emailData['cc']) {
            $cc = $helper->trim_string($emailData['cc']);
            $cc = str_replace([',', ';'], '#', $cc);
            $cc = explode('#', $cc);
            $cc = array_merge(array_unique(array_filter($cc)));
        }
        if ($emailData['bcc']) {
            $bcc = $helper->trim_string($emailData['bcc']);
            $bcc = str_replace([',', ';'], '#', $bcc);
            $bcc = explode('#', $bcc);
            $bcc = array_merge(array_unique(array_filter($bcc)));
        }
        $mediaRepo = $this->em->getRepository(Media::class);
        $attach = [];
        if ($attachIds) {
            foreach ($attachIds as $tmp) {
                $media = $mediaRepo->find($tmp);
                if (!$media) {
                    continue;
                }
                $attach[] = sprintf('public/uploads/%s/%s', $this->uploaderHelper::MEDIATHEK, $media->getFileName());
            }
        }
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $args = [
            'async' => $settings->getEmail()['async_active'],
            'type' => 'ds-email',
            'subject' => $subject,
            'from' => $user->getEmail(),
            'from_name' => $user->getEmail(),
            'template' => 'send-dashboard-email.html.twig',
            'to' => $recipient,
            'context' => [
                'site_name' => $settings->getApp()['site_name'],
                'content' => $content
            ],
            'attachments' => $attach,
            'cc' => $cc,
            'bcc' => $bcc,
        ];

        $this->bus->dispatch(new SaveEmail($args));
        $this->responseJson->status = true;
        if ($settings->getEmail()['async_active']) {
            $this->responseJson->title = $this->translator->trans('email.E-mail is being sent');
            $this->responseJson->msg = $this->translator->trans('email.The e-mail will be sent shortly.');
        } else {
            $this->responseJson->title = $this->translator->trans('system.E-mail sent');
            $this->responseJson->msg = $this->translator->trans('system.The e-mail was sent successfully.');
        }

        return $this->responseJson;

    }

    private function email_sent_table(): object
    {
        $columns = array(
            's.createdAt',
            's.type',
            's.absUser',
            's.sentFrom',
            's.sentTo',
            's.emailCc',
            's.emailBcc',
            's.emailSubject',
            '',
            ''
        );

        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];
        $query = $this->em->createQueryBuilder();
        $query
            ->from(EmailsSent::class, 's')
            ->select('s');

        if (isset($request['search']['value'])) {
            $query->andWhere(
                's.createdAt LIKE :searchTerm OR
                 s.type LIKE :searchTerm OR
                 s.absUser LIKE :searchTerm OR
                 s.sentFrom LIKE :searchTerm OR
                 s.sentTo LIKE :searchTerm OR
                 s.emailContext LIKE :searchTerm OR
                 s.emailCc LIKE :searchTerm OR
                 s.emailBcc LIKE :searchTerm OR
                 s.emailSubject LIKE :searchTerm');
            $query->setParameters(new ArrayCollection([
                new Parameter('searchTerm', '%' . $search . '%'),
            ]));
        }
        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('u.roles', 'ASC');
            $query->addOrderBy('a.lastName', 'ASC');
        }


        if ($request['length'] != -1) {
            $query->setFirstResult($request['start']);
            $query->setMaxResults($request['length']);
        }

        $table = $query->getQuery()->getArrayResult();

        $data_arr = array();
        if (!$table) {
            $this->responseJson->draw = $request['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }

        foreach ($table as $tmp) {
            $showClass = ' text-muted ';
            $bodyClass = ' text-muted ';
            if (!$tmp['ifShow']) {
                $showClass = ' text-green ';
                $bodyClass = '';
            }

            $anhang = '';
            if ($tmp['emailAttachments']) {
                $anhang = '<span class="d-none"> – ' . $this->translator->trans('email.Attachment') . ': ' . count($tmp['emailAttachments']) . '</span><i title="' . $this->translator->trans('email.Attachment') . ': ' . count($tmp['emailAttachments']) . '" class="bi bi-paperclip fs-5 ms-2 ' . $showClass . '"></i>';
            }
            $data_item = array();
            $data_item[] = '<span class="d-block' . $showClass . 'lh-1">' . $tmp['createdAt']->format('d.m.Y') . '<small class="small-lg mt-1 d-block"> ' . $tmp['createdAt']->format('H:i:s') . '</small></span>';
            $data_item[] = '<span class="' . $bodyClass . '">' . $tmp['type'] . '</span>';
            $data_item[] = '<span class="' . $bodyClass . '">' . $tmp['absUser'] . '</span>';
            $data_item[] = '<span class="' . $bodyClass . '">' . $tmp['sentFrom'] . '</span>';
            $data_item[] = '<span class="' . $bodyClass . '">' . $tmp['sentTo'] . '</span>' . $anhang;
            $data_item[] = '<small class="d-inline-block lh-12 ' . $bodyClass . '">' . implode(', ', $tmp['emailCc']) . '</small>';
            $data_item[] = '<small class="d-inline-block lh-12 ' . $bodyClass . '">' . implode(', ', $tmp['emailBcc']) . '</small>';
            $data_item[] = '<span class="lh-12 d-inline-block ' . $bodyClass . '">' . $tmp['emailSubject'] . '</span>';
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }

        $allCount = $this->em->getRepository(EmailsSent::class)->count([]);
        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = $allCount;
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = $allCount;
        }

        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }


}