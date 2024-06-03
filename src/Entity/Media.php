<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Serializer\Filter\PropertyFilter;
use App\Repository\MediaRepository;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Filter\SearchAnnotation as Searchable;

#[ORM\Entity(repositoryClass: MediaRepository::class)]
#[ApiFilter(PropertyFilter::class)]
#[ApiResource(
    shortName: 'Mediathek',
    description: 'Mediathek API',
    operations: [
        new Get(uriTemplate: '/media/{id}', security: "is_granted('ROLE_OAUTH2_MEDIA')"),
        new GetCollection(uriTemplate: '/media', paginationEnabled: false, security: "is_granted('ROLE_OAUTH2_MEDIA')"),
    ],

    formats: [
        'jsonld',
        'json',
        'jsonhal',
        'csv' => 'text/csv',
    ],
    normalizationContext: [
        'groups' => ['media:read'],
    ],
    denormalizationContext: [
        'groups' => ['media:write'],
    ],

    filters: ['search'],
),
    ApiFilter(
        OrderFilter::class,
        properties: [
            'id',
            'user',
            'original',
            'fileName',
        ],
    ),
    ApiFilter(
        SearchFilter::class,
        properties: [

        ],
    )
]
/**
 * @Searchable({"fileName", "description", "original", "type", "alt", "title", "labelling"})
 */
class Media
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media:read', 'media-category:read'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media:read', 'media-category:read'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    private ?string $fileName = null;
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media:read', 'media-category:read'])]
    #[ApiFilter(SearchFilter::class, strategy: 'partial')]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media:read', 'media-category:read'])]
    #[ApiFilter(SearchFilter::class, strategy: 'partial')]
    private ?string $original = null;

    #[ORM\Column]
    #[Groups(['media:read', 'media-category:read'])]
    private ?int $size = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['media:read', 'media-category:read'])]
    private ?array $sizeData = null;

    #[ORM\Column(length: 24)]
    #[Groups(['media:read', 'media-category:read'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    private ?string $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media:read', 'media-category:read'])]
    private ?string $attr = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media:read', 'media-category:read'])]
    private ?string $alt = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media:read', 'media-category:read'])]
    private ?string $title = null;

    #[ORM\Column]
    #[Groups(['media:read', 'media-category:read'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    private ?int $showFilemanager = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media:read', 'media-category:read'])]
    private ?string $mime = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media:read', 'media-category:read'])]
    private ?string $customCss = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media:read', 'media-category:read'])]
    private ?string $extension = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['media:read', 'media-category:read'])]
    private ?string $labelling = null;

    #[ORM\ManyToOne(targetEntity: MediaCategory::class, inversedBy: 'media')]
    #[Groups(['media:read'])]
    private ?MediaCategory $category;

    #[ORM\ManyToOne(inversedBy: 'media')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['media:read'])]
    private ?User $user = null;

    #[ORM\OneToOne(inversedBy: "media", targetEntity: MediaExif::class, cascade: ["persist", "remove"])]
    #[ORM\JoinColumn(name: "exifData", nullable: true)]
    #[Groups(['media:read', 'media-category:read'])]
    protected ?MediaExif $exifData;

    #[ORM\Column(nullable: true)]
    #[Groups(['media:read', 'media-category:read'])]
    private ?DateTimeImmutable $lastModified = null;
    #[ORM\Column]
    #[Groups(['media:read', 'media-category:read'])]
    private ?DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->showFilemanager = 1;
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getOriginal(): ?string
    {
        return $this->original;
    }

    public function setOriginal(string $original): static
    {
        $this->original = $original;

        return $this;
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(int $size): static
    {
        $this->size = $size;

        return $this;
    }

    public function getSizeData(): ?array
    {
        return $this->sizeData;
    }

    public function setSizeData(?array $sizeData): static
    {
        $this->sizeData = $sizeData;

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

    public function getAttr(): ?string
    {
        return $this->attr;
    }

    public function setAttr(?string $attr): static
    {
        $this->attr = $attr;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getShowFilemanager(): ?int
    {
        return $this->showFilemanager;
    }

    public function setShowFilemanager(int $showFilemanager): static
    {
        $this->showFilemanager = $showFilemanager;

        return $this;
    }

    public function getMime(): ?string
    {
        return $this->mime;
    }

    public function setMime(string $mime): static
    {
        $this->mime = $mime;

        return $this;
    }

    public function getCustomCss(): ?string
    {
        return $this->customCss;
    }

    public function setCustomCss(?string $customCss): static
    {
        $this->customCss = $customCss;

        return $this;
    }

    public function getCategory(): ?MediaCategory
    {
        return $this->category;
    }

    public function setCategory(?MediaCategory $category): self
    {
        $this->category = $category;

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

    public function getExifData(): ?MediaExif
    {
        return $this->exifData;
    }

    public function setExifData(?MediaExif $exifData): self
    {
        $this->exifData = $exifData;

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

    public function getAlt(): ?string
    {
        return $this->alt;
    }

    public function setAlt(?string $alt): static
    {
        $this->alt = $alt;

        return $this;
    }

    public function getLastModified(): ?DateTimeImmutable
    {
        return $this->lastModified;
    }

    public function setLastModified(?DateTimeImmutable $lastModified): static
    {
        $this->lastModified = $lastModified;

        return $this;
    }

    public function getExtension(): ?string
    {
        return $this->extension;
    }

    public function setExtension(string $extension): static
    {
        $this->extension = $extension;

        return $this;
    }

    public function getFileName(): ?string
    {
        return $this->fileName;
    }

    public function setFileName(string $fileName): static
    {
        $this->fileName = $fileName;

        return $this;
    }

    public function getLabelling(): ?string
    {
        return $this->labelling;
    }

    public function setLabelling(?string $labelling): static
    {
        $this->labelling = $labelling;

        return $this;
    }
}
