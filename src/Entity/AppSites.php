<?php

namespace App\Entity;

use App\Repository\AppSitesRepository;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AppSitesRepository::class)]
class AppSites
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $siteSlug = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $routeName = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $siteContent = null;

    #[ORM\Column]
    private ?DateTimeImmutable $siteDate = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $siteExcerpt = null;

    #[ORM\Column(length: 64, options:['default' => 'publish'])]
    private ?string $siteStatus = null;

    #[ORM\Column]
    private ?bool $commentStatus = null;

    #[ORM\Column(length: 64)]
    private ?string $siteType = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $siteImg = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $siteUser = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $sitePassword = null;

    #[ORM\Column(nullable: true)]
    private ?int $excerptLimit = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $extraCss = null;

    #[ORM\Column(options:['default' => 0])]
    private ?int $position = null;

    #[ORM\Column(nullable: true)]
    private ?int $header = null;

    #[ORM\Column(nullable: true)]
    private ?int $footer = null;

    #[ORM\Column]
    private ?bool $builderActive = null;

    #[ORM\Column(length: 128, nullable: true)]
    private ?string $custom = null;
    #[ORM\Column(nullable: true)]
    private ?int $formBuilder = null;

    #[ORM\OneToOne(inversedBy: "appSites", targetEntity: SiteSeo::class, cascade: ["persist", "remove"])]
    #[ORM\JoinColumn(name: "siteSeo", nullable: true)]
    protected ?SiteSeo $siteSeo;

    #[ORM\ManyToOne(targetEntity: SiteCategory::class, inversedBy: 'appSites')]
    private ?SiteCategory $siteCategory;

 /*   #[ORM\OneToOne(mappedBy: 'siteData', targetEntity: AppMenu::class)]
    protected ?AppMenu $appMenu;*/


    public function __construct()
    {
        $this->siteDate = new DateTimeImmutable();
        $this->commentStatus = false;
        $this->position = 0;
        $this->builderActive = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAppMenu(): ?AppMenu
    {
        return $this->appMenu;
    }

    public function setAppMenu(?AppMenu $appMenu): self
    {
        // unset the owning side of the relation if necessary
        if ($appMenu === null && $this->appMenu !== null) {
            $this->appMenu->setAppSites(null);
        }

        // set the owning side of the relation if necessary
        if ($appMenu !== null && $appMenu->getAppSites() !== $this) {
            $appMenu->setAppSites($this);
        }

        $this->appMenu = $appMenu;

        return $this;
    }


    public function getSiteSlug(): ?string
    {
        return $this->siteSlug;
    }

    public function setSiteSlug(string $siteSlug): static
    {
        $this->siteSlug = $siteSlug;

        return $this;
    }

    public function getRouteName(): ?string
    {
        return $this->routeName;
    }

    public function setRouteName(string $routeName): static
    {
        $this->routeName = $routeName;

        return $this;
    }

    public function getSiteContent(): ?string
    {
        return $this->siteContent;
    }

    public function setSiteContent(?string $siteContent): static
    {
        $this->siteContent = $siteContent;

        return $this;
    }

    public function getSiteDate(): ?DateTimeImmutable
    {
        return $this->siteDate;
    }

    public function setSiteDate(DateTimeImmutable $siteDate): static
    {
        $this->siteDate = $siteDate;

        return $this;
    }

    public function getSiteExcerpt(): ?string
    {
        return $this->siteExcerpt;
    }

    public function setSiteExcerpt(?string $siteExcerpt): static
    {
        $this->siteExcerpt = $siteExcerpt;

        return $this;
    }

    public function getSiteStatus(): ?string
    {
        return $this->siteStatus;
    }

    public function setSiteStatus(string $siteStatus): static
    {
        $this->siteStatus = $siteStatus;

        return $this;
    }

    public function isCommentStatus(): ?bool
    {
        return $this->commentStatus;
    }

    public function setCommentStatus(bool $commentStatus): static
    {
        $this->commentStatus = $commentStatus;

        return $this;
    }

    public function getSiteType(): ?string
    {
        return $this->siteType;
    }

    public function setSiteType(string $siteType): static
    {
        $this->siteType = $siteType;

        return $this;
    }

    public function getSiteImg(): ?string
    {
        return $this->siteImg;
    }

    public function setSiteImg(?string $siteImg): static
    {
        $this->siteImg = $siteImg;

        return $this;
    }

    public function getSiteUser(): ?string
    {
        return $this->siteUser;
    }

    public function setSiteUser(?string $siteUser): static
    {
        $this->siteUser = $siteUser;

        return $this;
    }

    public function getSitePassword(): ?string
    {
        return $this->sitePassword;
    }

    public function setSitePassword(?string $sitePassword): static
    {
        $this->sitePassword = $sitePassword;

        return $this;
    }

    public function getExcerptLimit(): ?int
    {
        return $this->excerptLimit;
    }

    public function setExcerptLimit(?int $excerptLimit): static
    {
        $this->excerptLimit = $excerptLimit;

        return $this;
    }

    public function getExtraCss(): ?string
    {
        return $this->extraCss;
    }

    public function setExtraCss(?string $extraCss): static
    {
        $this->extraCss = $extraCss;

        return $this;
    }

    public function getSiteSeo(): ?SiteSeo
    {
        return $this->siteSeo;
    }

    public function setSiteSeo(?SiteSeo $siteSeo): self
    {
        $this->siteSeo = $siteSeo;

        return $this;
    }

    public function getSiteCategory(): ?SiteCategory
    {
        return $this->siteCategory;
    }

    public function setSiteCategory(?SiteCategory $siteCategory): self
    {
        $this->siteCategory = $siteCategory;

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getFormBuilder(): ?int
    {
        return $this->formBuilder;
    }

    public function setFormBuilder(int $formBuilder): static
    {
        $this->formBuilder = $formBuilder;

        return $this;
    }

    public function isBuilderActive(): ?bool
    {
        return $this->builderActive;
    }

    public function setBuilderActive(bool $builderActive): static
    {
        $this->builderActive = $builderActive;

        return $this;
    }

    public function getCustom(): ?string
    {
        return $this->custom;
    }

    public function setCustom(?string $custom): static
    {
        $this->custom = $custom;

        return $this;
    }

    public function getHeader(): ?int
    {
        return $this->header;
    }

    public function setHeader(?int $header): static
    {
        $this->header = $header;

        return $this;
    }

    public function getFooter(): ?int
    {
        return $this->footer;
    }

    public function setFooter(?int $footer): static
    {
        $this->footer = $footer;

        return $this;
    }
}
