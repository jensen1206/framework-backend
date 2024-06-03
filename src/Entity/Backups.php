<?php

namespace App\Entity;

use App\Repository\BackupsRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BackupsRepository::class)]
class Backups
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $fileName = null;

    #[ORM\Column(nullable: true)]
    private ?int $fileSize = null;

    #[ORM\Column(length: 12)]
    private ?string $version = null;

    #[ORM\Column(length: 24)]
    private ?string $type = null;

    #[ORM\Column]
    private ?bool $fileCreated = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $archiveId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $statusMsg = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;



    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->type = 'db-backup';
        $this->statusMsg = 'in progress';
        $this->fileCreated = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFileName(): ?string
    {
        return $this->fileName;
    }

    public function setFileName(string $fileName): static
    {
        $this->fileName = $fileName;

        return $this;
    }

    public function getFileSize(): ?int
    {
        return $this->fileSize;
    }

    public function setFileSize(int $fileSize): static
    {
        $this->fileSize = $fileSize;

        return $this;
    }

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(string $version): static
    {
        $this->version = $version;

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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function isFileCreated(): ?bool
    {
        return $this->fileCreated;
    }

    public function setFileCreated(bool $fileCreated): static
    {
        $this->fileCreated = $fileCreated;

        return $this;
    }

    public function getArchiveId(): ?string
    {
        return $this->archiveId;
    }

    public function setArchiveId(?string $archiveId): static
    {
        $this->archiveId = $archiveId;

        return $this;
    }

    public function getStatusMsg(): ?string
    {
        return $this->statusMsg;
    }

    public function setStatusMsg(?string $statusMsg): static
    {
        $this->statusMsg = $statusMsg;

        return $this;
    }
}
