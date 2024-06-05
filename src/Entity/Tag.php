<?php

namespace App\Entity;

use App\Repository\TagRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TagRepository::class)]
class Tag
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $designation = null;

    #[ORM\ManyToMany(targetEntity: PostSites::class, mappedBy: 'tags')]
     private $posts;

    public function __construct()
    {
        $this->posts = new ArrayCollection();
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
            $posts->addTag($this);
        }
        return $this;
    }
    public function removePost(PostSites $posts): self
    {
        if ($this->posts->removeElement($posts)) {
            $posts->removeTag($this);
        }
        return $this;
    }

}
