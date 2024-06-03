<?php

namespace App\Entity;

use App\Repository\SiteCategoryRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: SiteCategoryRepository::class)]
class SiteCategory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $position = null;

    #[ORM\Column(length: 64)]
    private ?string $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $catImg = null;

    #[ORM\OneToMany(mappedBy: 'appSites', targetEntity: AppSites::class)]
    private Collection $appSites;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->appSites = new ArrayCollection();
        $this->type = 'category';
        $this->position = 0;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getCatImg(): ?string
    {
        return $this->catImg;
    }

    public function setCatImg(?string $catImg): static
    {
        $this->catImg = $catImg;

        return $this;
    }

    /**
     * @return Collection<int, AppSites>
     */
    public function getAppSites(): Collection
    {
        return $this->appSites;
    }

    public function addAppSites(AppSites $appSites): self
    {
        if (!$this->appSites->contains($appSites)) {
            $this->appSites->add($appSites);
            $appSites->setSiteCategory($this);
        }

        return $this;
    }

   /* public function removeAppSites(AppSites $appSites): self
    {
        if ($this->appSites->removeElement($appSites)) {
            // set the owning side to null (unless already changed)
            if ($appSites->getSiteCategory() === $this) {
                $appSites->setSiteCategory(null);
            }
        }

        return $this;
    }*/

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }
}
