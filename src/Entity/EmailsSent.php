<?php

namespace App\Entity;

use App\Repository\EmailsSentRepository;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EmailsSentRepository::class)]
class EmailsSent
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 128)]
    private ?string $absUser = null;

    #[ORM\Column(length: 64)]
    private ?string $type = null;

    #[ORM\Column(length: 128)]
    private ?string $sentFrom = null;

    #[ORM\Column(length: 128)]
    private ?string $sentTo = null;

    #[ORM\Column(length: 255)]
    private ?string $emailSubject = null;


    #[ORM\Column(nullable: true)]
    private ?array $emailCc = null;

    #[ORM\Column(nullable: true)]
    private ?array $emailBcc = null;

    #[ORM\Column]
    private ?bool $ifShow = null;

    #[ORM\Column]
    private array $emailContext = [];

    #[ORM\Column(length: 255)]
    private ?string $emailTemplate = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $fromName = null;

    #[ORM\Column(nullable: true)]
    private ?array $emailAttachments = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;





    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->ifShow = false;
        $this->fromName = '';
        $this->emailCc = [];
        $this->emailBcc = [];
        $this->emailAttachments = [];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAbsUser(): ?string
    {
        return $this->absUser;
    }

    public function setAbsUser(string $absUser): static
    {
        $this->absUser = $absUser;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getSentFrom(): ?string
    {
        return $this->sentFrom;
    }

    public function setSentFrom(string $sentFrom): static
    {
        $this->sentFrom = $sentFrom;

        return $this;
    }

    public function getSentTo(): ?string
    {
        return $this->sentTo;
    }

    public function setSentTo(string $sentTo): static
    {
        $this->sentTo = $sentTo;

        return $this;
    }

    public function getEmailSubject(): ?string
    {
        return $this->emailSubject;
    }

    public function setEmailSubject(string $emailSubject): static
    {
        $this->emailSubject = $emailSubject;

        return $this;
    }


    public function getEmailCc(): ?array
    {
        return $this->emailCc;
    }

    public function setEmailCc(?array $emailCc): static
    {
        $this->emailCc = $emailCc;

        return $this;
    }

    public function getEmailBcc(): ?array
    {
        return $this->emailBcc;
    }

    public function setEmailBcc(?array $emailBcc): static
    {
        $this->emailBcc = $emailBcc;

        return $this;
    }

    public function isIfShow(): ?bool
    {
        return $this->ifShow;
    }

    public function setIfShow(bool $ifShow): static
    {
        $this->ifShow = $ifShow;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getEmailContext(): array
    {
        return $this->emailContext;
    }

    public function setEmailContext(array $emailContext): static
    {
        $this->emailContext = $emailContext;

        return $this;
    }

    public function getEmailTemplate(): ?string
    {
        return $this->emailTemplate;
    }

    public function setEmailTemplate(string $emailTemplate): static
    {
        $this->emailTemplate = $emailTemplate;

        return $this;
    }

    public function getFromName(): ?string
    {
        return $this->fromName;
    }

    public function setFromName(?string $fromName): static
    {
        $this->fromName = $fromName;

        return $this;
    }

    public function getEmailAttachments(): ?array
    {
        return $this->emailAttachments;
    }

    public function setEmailAttachments(?array $emailAttachments): static
    {
        $this->emailAttachments = $emailAttachments;

        return $this;
    }
}
