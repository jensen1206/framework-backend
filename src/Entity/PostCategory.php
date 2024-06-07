<?php

namespace App\Entity;

use App\Repository\PostCategoryRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PostCategoryRepository::class)]
class PostCategory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $position = null;

    #[ORM\Column(length: 24)]
    private ?string $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $catImg = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $slug = null;

    #[ORM\OneToMany(mappedBy: 'postSites', targetEntity: PostSites::class)]
    private Collection $postSites;

    #[ORM\Column(nullable: true)]
    private ?int $categoryDesign = null;

    #[ORM\Column(nullable: true)]
    private ?int $postDesign = null;

    #[ORM\Column(nullable: true)]
    private ?int $postLoop = null;

    #[ORM\Column(nullable: true)]
    private ?int $categoryHeader = null;

    #[ORM\Column(nullable: true)]
    private ?int $categoryFooter = null;

    #[ORM\Column(nullable: true)]
    private ?int $postHeader = null;

    #[ORM\Column(nullable: true)]
    private ?int $postFooter = null;

    #[ORM\ManyToMany(targetEntity: PostSites::class, mappedBy: 'categories')]
    private $posts;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->postSites = new ArrayCollection();
        $this->posts = new ArrayCollection();
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
     * @return Collection<int, PostSites>
     */
    public function getPostSites(): Collection
    {
        return $this->postSites;
    }

    public function addAppSites(PostSites $postSites): self
    {
        if (!$this->postSites->contains($postSites)) {
            $this->postSites->add($postSites);
            $postSites->setPostCategory($this);
        }

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): static
    {
        $this->slug = $slug;

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

    public function getCategoryDesign(): ?int
    {
        return $this->categoryDesign;
    }

    public function setCategoryDesign(?int $categoryDesign): static
    {
        $this->categoryDesign = $categoryDesign;

        return $this;
    }

    public function getPostDesign(): ?int
    {
        return $this->postDesign;
    }

    public function setPostDesign(?int $postDesign): static
    {
        $this->postDesign = $postDesign;

        return $this;
    }

    public function getPostLoop(): ?int
    {
        return $this->postLoop;
    }

    public function setPostLoop(?int $postLoop): static
    {
        $this->postLoop = $postLoop;

        return $this;
    }

    public function getCategoryHeader(): ?int
    {
        return $this->categoryHeader;
    }

    public function setCategoryHeader(?int $categoryHeader): static
    {
        $this->categoryHeader = $categoryHeader;

        return $this;
    }

    public function getCategoryFooter(): ?int
    {
        return $this->categoryFooter;
    }

    public function setCategoryFooter(?int $categoryFooter): static
    {
        $this->categoryFooter = $categoryFooter;

        return $this;
    }

    public function getPostHeader(): ?int
    {
        return $this->postHeader;
    }

    public function setPostHeader(?int $postHeader): static
    {
        $this->postHeader = $postHeader;

        return $this;
    }

    public function getPostFooter(): ?int
    {
        return $this->postFooter;
    }

    public function setPostFooter(?int $postFooter): static
    {
        $this->postFooter = $postFooter;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getPost(): Collection
    {
        return $this->posts;
    }
    public function addPost(PostSites $posts): self
    {
        if (!$this->posts->contains($posts)) {
            $this->posts[] = $posts;
            $posts->addCategory($this);
        }
        return $this;
    }
    public function removePost(PostSites $posts): self
    {
        if ($this->posts->removeElement($posts)) {
            $posts->removeCategory($this);
        }
        return $this;
    }
}
