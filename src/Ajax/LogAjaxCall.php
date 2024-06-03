<?php

namespace App\Ajax;

use App\Entity\Account;
use App\Entity\Log;
use App\Settings\Settings;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Parameter;
use Exception;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class LogAjaxCall
{
    use Settings;

    protected object $responseJson;
    protected Request $data;
    private bool $manageLog;

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
    public function ajaxLogHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_ACTIVITY', $account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $this->manageLog = $this->security->isGranted('MANAGE_LOG', $account);
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    /**
     * @throws ExceptionInterface
     */
    private function get_activity(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Log-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $log = $this->em->getRepository(Log::class)->getActivityLogById($id);
        if (!$log) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Log-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $setLog = $this->em->getRepository(Log::class)->find($id);
        $setLog->setLogShow(true);
        $this->em->persist($setLog);
        $this->em->flush();
        $user = $log['user'];
        $log['user'] = $user['email'] ?? $this->translator->trans('activity.No information');
        $log['createdAt'] = $log['createdAt']->format('d.m.Y H:i:s');

        $extra = $log['extra'];
        $log['request_id'] = $extra['request_id'] ?? $this->translator->trans('activity.No information');
        $context = [];
        foreach ($log['context'] as $key => $val) {
            $item = [
                'label' => $key,
                'value' => $val
            ];
            $context[] = $item;
        }
        $log['context'] = $context;
        $this->responseJson->record = $log;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_log(): object
    {
        if (!$this->manageLog) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Log-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $log = $this->em->getRepository(Log::class)->find($id);
        if (!$log) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Log-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->em->remove($log);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('swal.Log entry deleted');
        $this->responseJson->msg = $this->translator->trans('swal.The log entry has been successfully deleted.');
        return $this->responseJson;
    }

    private function delete_selected_log():object
    {
        $this->responseJson->title = $this->translator->trans('Error');
        if (!$this->manageLog) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $ids = filter_var($this->data->get('ids'), FILTER_UNSAFE_RAW);

        if (!$ids) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Log-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $ids = json_decode($ids, true);
        $logRepro = $this->em->getRepository(Log::class);
        foreach ($ids as $tmp){
            $this->em->remove($logRepro->find($tmp['id']));
            $this->em->flush();
        }
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('swal.Log entries deleted');
        $this->responseJson->msg = $this->translator->trans('swal.Selected entries successfully deleted.');
        return $this->responseJson;
    }

    private function activity_table(): object
    {
        $columns = array(
            '',
            'l.createdAt',
            'l.context',
            'l.message',
            'u.email',
            'l.level',
            'l.levelName',
            'l.channel',
            '',
            '',
            ''
        );

        $channel = filter_var($this->data->get('channel'), FILTER_UNSAFE_RAW);
        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];
        $query = $this->em->createQueryBuilder();
        $query
            ->from(Log::class, 'l')
            ->select('l, u')
            ->leftJoin('l.user', 'u')
            ->andWhere('l.channel=:channel')
            ->setParameter('channel', $channel);

        if (isset($request['search']['value'])) {
            $query->andWhere(
                'l.createdAt LIKE :searchTerm OR
                 l.context LIKE :searchTerm OR
                 l.message LIKE :searchTerm OR
                 l.level LIKE :searchTerm OR
                 u.email LIKE :searchTerm OR 
                 l.levelName LIKE :searchTerm OR
                 l.extra LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }
        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('l.createdAt', 'ASC');
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
            $registerId = '';
            if ($tmp['extra']) {
                $registerId = $tmp['extra']['request_id'] ?? '';
            }
            $user = '<span class="text-secondary">' . $this->translator->trans('activity.No information') . '</span>';
            if (is_array($tmp['user'])) {
                $user = $tmp['user']['email'];
            }
            $type = '';
            if ($tmp['context']) {
                $context = $tmp['context'];
                $type = $context['type'] ?? '';
            }
            if ($this->manageLog) {
                $btn = '<button data-id="' . $tmp['id'] . '" title="' . $this->translator->trans('Delete') . '" class="btn-trash btn text-nowrap dark btn-sm btn-danger"><i class="bi bi-trash" </button>';
            } else {
                $btn = '<button title="' . $this->translator->trans('Delete') . '" class="btn text-nowrap dark btn-sm btn-outline-secondary pe-none"><i class="bi bi-trash" </button>';
            }
            $color = 'text-body';
            if ($tmp['logShow']) {
                $color = 'text-secondary';
            }
            $data_item = array();
            $data_item[] = '<div class="form-check table-check" title=""><input data-id="' . $tmp['id'] . '" class="form-check-input select-log no-blur" type="checkbox"  aria-label="" id="' . $tmp['id'] . '"></div>';
            $data_item[] = '<span class="d-block lh-1 ' . $color . '">' . $tmp['createdAt']->format('d.m.Y') . '<small class="mt-1 small-lg d-block"> ' . $tmp['createdAt']->format('H:i:s') . '</small></span>';
            $data_item[] = '<span class="' . $color . '">' . $tmp['channel'] . '</span>';
            $data_item[] = '<span class="' . $color . '">' . $type . '</span>';
            $data_item[] = '<span class="' . $color . '">' . $tmp['message'] . '</span>';
            $data_item[] = '<span class="' . $color . '">' . $user . '</span>';
            $data_item[] = '<span class="' . $color . '">' . $tmp['level'] . '</span>';
            $data_item[] = '<span class="' . $color . '">' . $tmp['levelName'] . '</span>';
            $data_item[] = '<small class="small-lg d-block lh-12 ' . $color . '">' . $registerId . '</small>';
            $data_item[] = $tmp['id'];
            $data_item[] = $btn;
            $data_arr[] = $data_item;
        }

        $allCount = $this->em->getRepository(Log::class)->count(['channel' => $channel]);
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