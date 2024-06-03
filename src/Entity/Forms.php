<?php

namespace App\Entity;

use App\Repository\FormsRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FormsRepository::class)]
class Forms
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $designation = null;
    #[ORM\Column(length: 64)]
    private ?string $formId = null;

    #[ORM\Column]
    private array $form = [];

    #[ORM\Column(length: 24)]
    private ?string $type = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;


    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->type = 'builder';
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFormId(): ?string
    {
        return $this->formId;
    }

    public function setFormId(string $formId): static
    {
        $this->formId = $formId;

        return $this;
    }

    public function getForm(): array
    {
        return $this->form;
    }

    public function setForm(array $form): static
    {
        $this->form = $form;

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

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getDesignation(): ?string
    {
        return $this->designation;
    }

    public function setDesignation(string $designation): static
    {
        $this->designation = $designation;

        return $this;
    }
}
