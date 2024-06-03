<?php

namespace App\Entity;

use App\Repository\MediaExifRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MediaExifRepository::class)]
class MediaExif
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media:read', 'media-category:read'])]
    private ?int $id = null;

    #[ORM\OneToOne(mappedBy: 'exifData', targetEntity: Media::class)]
    protected Media $media;

    #[ORM\Column(nullable: true)]
    private ?array $exifFile = null;

    #[ORM\Column(nullable: true)]
    private ?array $exifComputed = null;

    #[ORM\Column(nullable: true)]
    private ?array $exifIfdo = null;

    #[ORM\Column(nullable: true)]
    private ?array $exifExif = null;

    #[ORM\Column(nullable: true)]
    private ?array $exifGps = null;

    #[ORM\Column(nullable: true)]
    private ?array $gpsGeo = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getExifFile(): ?array
    {
        return $this->exifFile;
    }

    public function setExifFile(?array $exifFile): static
    {
        $this->exifFile = $exifFile;

        return $this;
    }

    public function getExifComputed(): ?array
    {
        return $this->exifComputed;
    }

    public function setExifComputed(?array $exifComputed): static
    {
        $this->exifComputed = $exifComputed;

        return $this;
    }

    public function getExifIfdo(): ?array
    {
        return $this->exifIfdo;
    }

    public function setExifIfdo(?array $exifIfdo): static
    {
        $this->exifIfdo = $exifIfdo;

        return $this;
    }

    public function getExifExif(): ?array
    {
        return $this->exifExif;
    }

    public function setExifExif(?array $exifExif): static
    {
        $this->exifExif = $exifExif;

        return $this;
    }

    public function getExifGps(): ?array
    {
        return $this->exifGps;
    }

    public function setExifGps(?array $exifGps): static
    {
        $this->exifGps = $exifGps;

        return $this;
    }

    public function getMedia(): ?Media
    {
        return $this->media;
    }

    public function setMedia(?Media $media): self
    {
        // unset the owning side of the relation if necessary
        if ($media === null && $this->media !== null) {
            $this->media->setExifData(null);
        }

        // set the owning side of the relation if necessary
        if ($media !== null && $media->getExifData() !== $this) {
            $media->setExifData($this);
        }

        $this->media = $media;

        return $this;
    }

    public function getGpsGeo(): ?array
    {
        return $this->gpsGeo;
    }

    public function setGpsGeo(?array $gpsGeo): static
    {
        $this->gpsGeo = $gpsGeo;

        return $this;
    }
}
