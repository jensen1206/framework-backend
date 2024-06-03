<?php

namespace App\Entity;

use App\Repository\PluginSectionsRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PluginSectionsRepository::class)]
class PluginSections
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 64)]
    private ?string $designation = null;

    #[ORM\Column(length: 28)]
    private ?string $type = null;

    #[ORM\Column]
    private array $plugin = [];

    #[ORM\Column(length: 64)]
    private ?string $handle = null;

    #[ORM\Column(length: 64)]
    private ?string $elementId = null;
    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;



    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getPlugin(): array
    {
        return $this->plugin;
    }

    public function setPlugin(array $plugin): static
    {
        $this->plugin = $plugin;

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

    public function getHandle(): ?string
    {
        return $this->handle;
    }

    public function setHandle(string $handle): static
    {
        $this->handle = $handle;

        return $this;
    }

    public function getElementId(): ?string
    {
        return $this->elementId;
    }

    public function setElementId(string $elementId): static
    {
        $this->elementId = $elementId;

        return $this;
    }
}
