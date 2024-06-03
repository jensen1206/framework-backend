<?php

namespace App\Entity;

use App\Repository\SiteSeoRepository;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SiteSeoRepository::class)]
class SiteSeo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $seoTitle = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $seoContent = null;

    #[ORM\Column]
    private ?bool $noIndex = null;

    #[ORM\Column]
    private ?bool $noFollow = null;

    #[ORM\Column]
    private ?bool $fbActive = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $ogType = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $ogTitle = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $ogContent = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $ogImage = null;

    #[ORM\Column]
    private ?bool $xActive = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $xType = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $xSite = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $xCreator = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $fbAppId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $fbAdmins = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $titlePrefix = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $titleSuffix = null;

    #[ORM\Column(length: 6, nullable: true, options:['default' => '–'])]
    private ?string $titleSeparator = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?int $readingTime = null;

    #[ORM\OneToOne(mappedBy: 'siteSeo', targetEntity: AppSites::class)]
    protected AppSites $appSites;

    #[ORM\OneToOne(mappedBy: 'siteSeo', targetEntity: PostSites::class)]
    protected PostSites $postSites;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?DateTimeImmutable $lastUpdate = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->lastUpdate = new DateTimeImmutable();
        $this->xActive = false;
        $this->fbActive = false;
        $this->noIndex = false;
        $this->noFollow = false;
    }

    public function getAppSites(): ?AppSites
    {
        return $this->appSites;
    }

    public function setAppSites(?AppSites $appSites): self
    {
        // unset the owning side of the relation if necessary
        if ($appSites === null && $this->appSites !== null) {
            $this->appSites->setSiteSeo(null);
        }

        // set the owning side of the relation if necessary
        if ($appSites !== null && $appSites->getSiteSeo() !== $this) {
            $appSites->setSiteSeo($this);
        }

        $this->appSites = $appSites;

        return $this;
    }

    public function getPostSites(): ?PostSites
    {
        return $this->postSites;
    }

    public function setPostSites(?PostSites $postSites): self
    {
        // unset the owning side of the relation if necessary
        if ($postSites === null && $this->postSites !== null) {
            $this->postSites->setSiteSeo(null);
        }

        // set the owning side of the relation if necessary
        if ($postSites !== null && $postSites->getSiteSeo() !== $this) {
            $postSites->setSiteSeo($this);
        }

        $this->postSites = $postSites;

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSeoTitle(): ?string
    {
        return $this->seoTitle;
    }

    public function setSeoTitle(?string $seoTitle): static
    {
        $this->seoTitle = $seoTitle;

        return $this;
    }

    public function getSeoContent(): ?string
    {
        return $this->seoContent;
    }

    public function setSeoContent(?string $seoContent): static
    {
        $this->seoContent = $seoContent;

        return $this;
    }

    public function getNoIndex(): ?bool
    {
        return $this->noIndex;
    }

    public function setNoIndex(bool $noIndex): static
    {
        $this->noIndex = $noIndex;

        return $this;
    }

    public function getNoFollow(): ?bool
    {
        return $this->noFollow;
    }

    public function setNoFollow(bool $noFollow): static
    {
        $this->noFollow = $noFollow;

        return $this;
    }

    public function getFbActive(): ?bool
    {
        return $this->fbActive;
    }

    public function setFbActive(bool $fbActive): static
    {
        $this->fbActive = $fbActive;

        return $this;
    }

    public function getOgType(): ?string
    {
        return $this->ogType;
    }

    public function setOgType(?string $ogType): static
    {
        $this->ogType = $ogType;

        return $this;
    }

    public function getOgTitle(): ?string
    {
        return $this->ogTitle;
    }

    public function setOgTitle(?string $ogTitle): static
    {
        $this->ogTitle = $ogTitle;

        return $this;
    }

    public function getOgContent(): ?string
    {
        return $this->ogContent;
    }

    public function setOgContent(?string $ogContent): static
    {
        $this->ogContent = $ogContent;

        return $this;
    }

    public function getOgImage(): ?string
    {
        return $this->ogImage;
    }

    public function setOgImage(?string $ogImage): static
    {
        $this->ogImage = $ogImage;

        return $this;
    }

    public function getXActive(): ?bool
    {
        return $this->xActive;
    }

    public function setXActive(int $xActive): static
    {
        $this->xActive = $xActive;

        return $this;
    }

    public function getXType(): ?string
    {
        return $this->xType;
    }

    public function setXType(?string $xType): static
    {
        $this->xType = $xType;

        return $this;
    }

    public function getXSite(): ?string
    {
        return $this->xSite;
    }

    public function setXSite(?string $xSite): static
    {
        $this->xSite = $xSite;

        return $this;
    }

    public function getXCreator(): ?string
    {
        return $this->xCreator;
    }

    public function setXCreator(?string $xCreator): static
    {
        $this->xCreator = $xCreator;

        return $this;
    }

    public function getFbAppId(): ?string
    {
        return $this->fbAppId;
    }

    public function setFbAppId(?string $fbAppId): static
    {
        $this->fbAppId = $fbAppId;

        return $this;
    }

    public function getFbAdmins(): ?string
    {
        return $this->fbAdmins;
    }

    public function setFbAdmins(?string $fbAdmins): static
    {
        $this->fbAdmins = $fbAdmins;

        return $this;
    }

    public function getTitlePrefix(): ?string
    {
        return $this->titlePrefix;
    }

    public function setTitlePrefix(?string $titlePrefix): static
    {
        $this->titlePrefix = $titlePrefix;

        return $this;
    }

    public function getTitleSuffix(): ?string
    {
        return $this->titleSuffix;
    }

    public function setTitleSuffix(?string $titleSuffix): static
    {
        $this->titleSuffix = $titleSuffix;

        return $this;
    }

    public function getTitleSeparator(): ?string
    {
        return $this->titleSeparator;
    }

    public function setTitleSeparator(?string $titleSeparator): static
    {
        $this->titleSeparator = $titleSeparator;

        return $this;
    }

    public function getReadingTime(): ?int
    {
        return $this->readingTime;
    }

    public function setReadingTime(?int $readingTime): static
    {
        $this->readingTime = $readingTime;

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

    public function getLastUpdate(): ?DateTimeImmutable
    {
        return $this->lastUpdate;
    }

    public function setLastUpdate(DateTimeImmutable $lastUpdate): static
    {
        $this->lastUpdate = $lastUpdate;

        return $this;
    }
}
