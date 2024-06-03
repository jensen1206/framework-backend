<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Serializer\Filter\PropertyFilter;
use App\Repository\MediaCategoryRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Filter\SearchAnnotation as Searchable;


#[ORM\Entity(repositoryClass: MediaCategoryRepository::class)]
#[ApiFilter(PropertyFilter::class)]

#[ApiResource(
    shortName: 'Mediathek-Category',
    description: 'Mediathek Category API',
    operations: [
        new Get(uriTemplate: '/media-category/{id}', security: "is_granted('ROLE_OAUTH2_MEDIA')"),
        new GetCollection(uriTemplate: '/media-category', paginationEnabled: false,security: "is_granted('ROLE_OAUTH2_MEDIA')"),
        ],
    formats: [
        'jsonld',
        'json',
        'jsonhal',
        'csv' => 'text/csv',
    ],
    normalizationContext: [
        'groups' => ['media-category:read'],
    ],
    denormalizationContext: [
        'groups' => ['media-category:write'],
    ],

    filters: ['search'],
),
    ApiFilter(
        OrderFilter::class,
        properties: [
            'position' => 'ASC',
            'type',
            'createdAt',
            'designation'
        ],
    ),
    ApiFilter(
        SearchFilter::class,
        properties: [
            //'seoContent',
            // 'seoTitle',
        ],
    ),
]
/**
 * @Searchable({"designation", "description", "type"})
 */
class MediaCategory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media-category:read', 'media:read'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    private ?int $id = null;

    #[ORM\Column(length: 128)]
    #[Groups(['media-category:read', 'media:read'])]
    private ?string $designation = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['category:read', 'media:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['media-category:read'])]
    private ?int $position = null;

    #[ORM\Column(length: 24)]
    #[Groups(['media-category:read'])]
    private ?string $type = null;

    #[ORM\ManyToOne(inversedBy: 'mediaCategory')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['media-category:read'])]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: Media::class, cascade: ['persist', 'remove'])]
    #[Groups(['media-category:read'])]
    private Collection $media;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->media = new ArrayCollection();
        $this->type = 'mediathek';
        $this->position = 0;
    }

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedia(Media $media): self
    {
        if (!$this->media->contains($media)) {
            $this->media->add($media);
            $media->setCategory($this);
        }

        return $this;
    }

    public function removeMedia(Media $media): self
    {
        if ($this->media->removeElement($media)) {
            // set the owning side to null (unless already changed)
            if ($media->getCategory() === $this) {
                $media->setCategory(null);
            }
        }

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

}
