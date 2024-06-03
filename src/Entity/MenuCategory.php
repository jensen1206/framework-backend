<?php

namespace App\Entity;

use App\Repository\MenuCategoryRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: MenuCategoryRepository::class)]
class MenuCategory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $position = null;

    #[ORM\Column]
    private ?int $active = null;

    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[ORM\Column]
    private array $menuSettings = [];

   /* #[ORM\OneToMany(mappedBy: 'menuCategory', targetEntity: AppMenu::class, cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true)]
    private Collection $appMenu;*/

    #[ORM\OneToMany(mappedBy: 'menuCategory', targetEntity: AppMenu::class)]
    #[ORM\JoinColumn(nullable: true)]
    private Collection $appMenu;



    public function __construct()
    {
        $this->active = true;
        $this->position = 0;
        $this->menuSettings = [];
        $this->appMenu = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, AppMenu>
     */
    public function getAppMenu(): Collection
    {
        return $this->appMenu;
    }

    public function addAppMenu(AppMenu $appMenu): self
    {
        if (!$this->appMenu->contains($appMenu)) {
            $this->appMenu->add($appMenu);
            $appMenu->setMenuCategory($this);
        }

        return $this;
    }

    public function removeAppMenu(AppMenu $appMenu): self
    {
        if ($this->appMenu->removeElement($appMenu)) {
            // set the owning side to null (unless already changed)
            if ($appMenu->getMenuCategory() === $this) {
                $appMenu->setMenuCategory(null);
            }
        }

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

    public function getActive(): ?int
    {
        return $this->active;
    }

    public function setActive(int $active): static
    {
        $this->active = $active;

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

    public function getMenuSettings(): array
    {
        return $this->menuSettings;
    }

    public function setMenuSettings(array $menuSettings): static
    {
        $this->menuSettings = $menuSettings;

        return $this;
    }
}
