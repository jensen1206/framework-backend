<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;
#[Gedmo\Tree(type: 'nested')]
#[ORM\Table(name: 'menu')]
#[ORM\Entity(repositoryClass: NestedTreeRepository::class)]
class AppMenu
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(name: 'title', type: Types::STRING, length: 64)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

   /* #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $siteTitle = null;*/

    #[ORM\Column(type: Types::STRING, length: 255)]
    private ?string $url = null;

    #[ORM\Column(type: Types::STRING, length: 255)]
    private ?string $type = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $cssClass = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $attr = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private ?bool $newTab = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $xfn = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private ?bool $active = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private ?bool $showLogin = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private ?bool $showNotLogin = null;
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $position = null;

    #[Gedmo\TreeLeft]
    #[ORM\Column(name: 'lft', type: Types::INTEGER)]
    private $lft;

    #[Gedmo\TreeLevel]
    #[ORM\Column(name: 'lvl', type: Types::INTEGER)]
    private $lvl;

    #[Gedmo\TreeRight]
    #[ORM\Column(name: 'rgt', type: Types::INTEGER)]
    private $rgt;

    #[Gedmo\TreeRoot]
    #[ORM\ManyToOne(targetEntity: AppMenu::class)]
    #[ORM\JoinColumn(name: 'tree_root', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private $root;

    #[Gedmo\TreeParent]
    #[ORM\ManyToOne(targetEntity: AppMenu::class, inversedBy: 'children')]
    #[ORM\OrderBy(['position' => 'ASC'])]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private $parent;

    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: AppMenu::class)]
    #[ORM\OrderBy(['lft' => 'ASC'])]
    private $children;

    #[ORM\ManyToOne(targetEntity: MenuCategory::class, inversedBy: 'appMenu')]
    private ?MenuCategory $menuCategory;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $originalTitle = null;

    #[ORM\Column(nullable: true)]
    private ?int $site = null;

    #[ORM\Column(nullable: true)]
    private ?int $category = null;

    public function __construct()
    {
        $this->newTab = false;
        $this->url = '#';
        $this->position = 0;
        $this->active = true;
        $this->description = '';
        $this->showLogin = false;
        $this->showNotLogin = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRgt(): ?int
    {
        return $this->rgt;
    }

    public function setRgt(int $rgt): self
    {
        $this->rgt = $rgt;

        return $this;
    }

    public function getLft(): ?int
    {
        return $this->lft;
    }

    public function setLft(int $lft): self
    {
        $this->lft = $lft;

        return $this;
    }

    public function getLvl(): ?int
    {
        return $this->lvl;
    }

    public function setLvl(int $lvl): self
    {
        $this->lvl = $lvl;

        return $this;
    }

    public function getIndentedTitle(): string
    {
        return str_repeat("--", $this->children);
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

    public function getMenuCategory(): ?MenuCategory
    {
        return $this->menuCategory;
    }

    public function setMenuCategory(?MenuCategory $menuCategory): self
    {
        $this->menuCategory = $menuCategory;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

  /*  public function getSiteTitle(): ?string
    {
        return $this->siteTitle;
    }

    public function setSiteTitle(?string $siteTitle): static
    {
        $this->siteTitle = $siteTitle;

        return $this;
    }*/

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;

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

    public function getCssClass(): ?string
    {
        return $this->cssClass;
    }

    public function setCssClass(?string $cssClass): static
    {
        $this->cssClass = $cssClass;

        return $this;
    }

    public function getAttr(): ?string
    {
        return $this->attr;
    }

    public function setAttr(?string $attr): static
    {
        $this->attr = $attr;

        return $this;
    }

    public function isNewTab(): ?bool
    {
        return $this->newTab;
    }

    public function setNewTab(bool $newTab): static
    {
        $this->newTab = $newTab;

        return $this;
    }

    public function isShowLogin(): ?bool
    {
        return $this->showLogin;
    }

    public function setShowLogin(bool $showLogin): static
    {
        $this->showLogin = $showLogin;

        return $this;
    }

    public function isShowNotLogin(): ?bool
    {
        return $this->showNotLogin;
    }

    public function setShowNotLogin(bool $showNotLogin): static
    {
        $this->showNotLogin = $showNotLogin;
        return $this;
    }

    public function getXfn(): ?string
    {
        return $this->xfn;
    }

    public function setXfn(?string $xfn): static
    {
        $this->xfn = $xfn;

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

    public function getRoot(): ?self
    {
        return $this->root;
    }

    public function setRoot(?self $root): self
    {
        $this->root = $root;

        return $this;
    }

    public function setParent(self $parent = null): void
    {
        $this->parent = $parent;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }
    public function isActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): static
    {
        $this->active = $active;

        return $this;
    }

    public function getSite(): ?int
    {
        return $this->site;
    }

    public function setSite(?int $site): static
    {
        $this->site = $site;

        return $this;
    }

    public function getOriginalTitle(): ?string
    {
        return $this->originalTitle;
    }

    public function setOriginalTitle(?string $originalTitle): static
    {
        $this->originalTitle = $originalTitle;

        return $this;
    }

    public function getCategory(): ?int
    {
        return $this->category;
    }

    public function setCategory(?int $category): static
    {
        $this->category = $category;

        return $this;
    }
}
