<?php

namespace App\Message\Command;

use Symfony\Component\Console\Messenger\RunCommandMessage;

class SavePublicEmail
{

    private array $args;
    private string $to;
    private string $subject;
    private string $from;
    private string $from_name;
    private string $formular;
    private array $bcc;
    private string $type;
    private string $template;
    private array $context;
    private array $attachments;

    private bool $async = true;

    private array $cc;


    public function __construct( array $args)
    {
        $this->args = $args;
        $this->to = $this->args['to'];
        $this->subject = $this->args['subject'];
        $this->from = $this->args['from'];
        $this->formular = $this->args['formular'];
        $this->from_name = $this->args['from_name'];
        $this->bcc = $this->args['bcc'] ?? [];
        $this->type = $this->args['type'];
        $this->template = $this->args['template'];
        $this->context = $this->args['context'];
        $this->attachments = $this->args['attachments'] ?? [];
        $this->async = $this->args['async'] ?? false;
        $this->cc = $this->args['cc'] ?? [];
    }

    public function getTo(): string
    {
        return $this->to;
    }
    public function getSubject():string
    {
        return $this->subject;
    }
    public function getFrom():string
    {
        return $this->from;
    }
    public function getFormular():string
    {
        return $this->formular;
    }
    public function getFromName(): string
    {
        return $this->from_name;
    }
    public function getCc(): array
    {
        return $this->cc;
    }
    public function getBcc():array
    {
        return $this->bcc;
    }
    public function getType():string
    {
        return $this->type;
    }
    public function getTemplate():string
    {
        return $this->template;
    }
    public function getContext():array
    {
        return $this->context;
    }

    public function getAttachments(): array
    {
        return $this->attachments;
    }
    public function getAsync():bool
    {
        return $this->async;
    }

}