<?php

namespace App\Entity;

use App\Repository\AppFontsRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AppFontsRepository::class)]
class AppFonts
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 128)]
    private ?string $designation = null;

    #[ORM\Column]
    private ?bool $is_woff = null;

    #[ORM\Column]
    private ?bool $is_woff2 = null;

    #[ORM\Column]
    private ?bool $is_ttf = null;

    #[ORM\Column]
    private array $localName = [];

    #[ORM\Column]
    private array $fontInfo = [];

    #[ORM\Column]
    private array $fontData = [];
    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;


    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->localName = [];
        $this->fontInfo = [];
        $this->fontData = [];
        $this->is_woff = false;
        $this->is_woff2 = false;
        $this->is_ttf = false;
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

    public function isWoff(): ?bool
    {
        return $this->is_woff;
    }

    public function setIsWoff(bool $is_woff): self
    {
        $this->is_woff = $is_woff;

        return $this;
    }

    public function isWoff2(): ?bool
    {
        return $this->is_woff2;
    }

    public function setIsWoff2(bool $is_woff2): self
    {
        $this->is_woff2 = $is_woff2;

        return $this;
    }

    public function isTtf(): ?bool
    {
        return $this->is_ttf;
    }

    public function setIsTtf(bool $is_ttf): self
    {
        $this->is_ttf = $is_ttf;

        return $this;
    }

    public function getLocalName(): array
    {
        return $this->localName;
    }

    public function setLocalName(array $localName): static
    {
        $this->localName = $localName;

        return $this;
    }

    public function getFontInfo(): array
    {
        return $this->fontInfo;
    }

    public function setFontInfo(array $fontInfo): static
    {
        $this->fontInfo = $fontInfo;

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

    public function getFontData(): array
    {
        return $this->fontData;
    }

    public function setFontData(array $fontData): static
    {
        $this->fontData = $fontData;

        return $this;
    }
}
