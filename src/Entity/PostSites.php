<?php

namespace App\Entity;

use App\Repository\PostSitesRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PostSitesRepository::class)]
class PostSites
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $postContent = null;

    #[ORM\Column]
    private ?DateTimeImmutable $postDate = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $postExcerpt = null;

    #[ORM\Column]
    private ?bool $commentStatus = null;

    #[ORM\Column(length: 24)]
    private ?string $siteType = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $siteImg = null;

    #[ORM\Column(nullable: true)]
    private ?int $excerptLimit = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $extraCss = null;

    #[ORM\Column(options:['default' => 0])]
    private ?int $position = null;

    #[ORM\Column(length: 64, options:['default' => 'publish'])]
    private ?string $postStatus = null;

    #[ORM\Column(nullable: true)]
    private ?int $builder = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $postSlug = null;

    #[ORM\Column(nullable: true)]
    private ?int $header = null;

    #[ORM\Column(nullable: true)]
    private ?int $footer = null;

    #[ORM\Column(nullable: true)]
    private ?array $postGallery = null;

    #[ORM\OneToOne(inversedBy: "postSites", targetEntity: SiteSeo::class, cascade: ["persist", "remove"])]
    #[ORM\JoinColumn(name: "siteSeo", nullable: true)]
    protected ?SiteSeo $siteSeo;

    #[ORM\ManyToOne(targetEntity: PostCategory::class, inversedBy: 'postSites')]
    private ?PostCategory $postCategory;

    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: "posts")]
    private  $tags;

    #[ORM\ManyToMany(targetEntity: PostCategory::class, inversedBy: "posts")]
    private  $categories;


    public function __construct()
    {
        $this->commentStatus = false;
        $this->position = 0;
        $this->postStatus = 'publish';
        $this->postContent = '';
        $this->postExcerpt = '';
        $this->postGallery = [];
        $this->postDate = new DateTimeImmutable();
        $this->tags = new ArrayCollection();
        $this->categories = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPostContent(): ?string
    {
        return $this->postContent;
    }

    public function setPostContent(string $postContent): static
    {
        $this->postContent = $postContent;

        return $this;
    }

    public function getPostDate(): ?DateTimeImmutable
    {
        return $this->postDate;
    }

    public function setPostDate(DateTimeImmutable $postDate): static
    {
        $this->postDate = $postDate;

        return $this;
    }

    public function getPostExcerpt(): ?string
    {
        return $this->postExcerpt;
    }

    public function setPostExcerpt(string $postExcerpt): static
    {
        $this->postExcerpt = $postExcerpt;

        return $this;
    }

    public function getPostStatus(): ?string
    {
        return $this->postStatus;
    }

    public function setPostStatus(string $postStatus): static
    {
        $this->postStatus = $postStatus;

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

    public function getPostCategory(): ?PostCategory
    {
        return $this->postCategory;
    }

    public function setPostCategory(?PostCategory $postCategory): self
    {
        $this->postCategory = $postCategory;

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
    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getBuilder(): ?int
    {
        return $this->builder;
    }

    public function setBuilder(?int $builder): static
    {
        $this->builder = $builder;

        return $this;
    }

    public function getPostSlug(): ?string
    {
        return $this->postSlug;
    }

    public function setPostSlug(?string $postSlug): static
    {
        $this->postSlug = $postSlug;

        return $this;
    }

    public function getPostGallery(): ?array
    {
        return $this->postGallery;
    }

    public function setPostGallery(?array $postGallery): static
    {
        $this->postGallery = $postGallery;

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

    /**
     * @return Collection
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }
    public function addTag(Tag $tag): self
    {
        if (!$this->tags->contains($tag)) {
            $this->tags[] = $tag;
        }
        return $this;
    }
    public function removeTag(Tag $tag): self
    {
        $this->tags->removeElement($tag);
        return $this;
    }

    /**
     * @return Collection
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }
    public function addCategory(PostCategory $categories): self
    {
        if (!$this->categories->contains($categories)) {
            $this->categories[] = $categories;
        }
        return $this;
    }
    public function removeCategory(PostCategory $category): self
    {
        $this->categories->removeElement($category);
        return $this;
    }
}
