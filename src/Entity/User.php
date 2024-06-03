<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Scheb\TwoFactorBundle\Model\Totp\TotpConfiguration;
use Scheb\TwoFactorBundle\Model\Totp\TotpConfigurationInterface;
use Scheb\TwoFactorBundle\Model\Totp\TwoFactorInterface;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;
//There is already an account with this email
//#[UniqueEntity(fields: ['email'], message: 'user.email.busy')]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface, TwoFactorInterface
{
    const ROLE_ADMIN = 'ROLE_ADMIN';
    const ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN';
    public static function loadValidatorMetadata(ClassMetadata $metadata): void
    {
        $metadata->addPropertyConstraint('rawPassword', new Assert\NotCompromisedPassword());
    }

    private string $rawPassword;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media:read', 'media-category:read'])]
    private ?int $id = null;

    #[ORM\Column(type: UuidType::NAME)]
    private Uuid $uuid;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['media:read', 'media-category:read'])]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: OAuth2UserConsent::class, orphanRemoval: true)]
    private Collection $oAuth2UserConsents;


    #[ORM\OneToMany(mappedBy: 'user', targetEntity: MediaCategory::class, orphanRemoval: true)]
    private Collection $mediaCategory;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Media::class, orphanRemoval: true)]
    private Collection $media;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        $this->oAuth2UserConsents = new ArrayCollection();
        $this->mediaCategory = new ArrayCollection();
        $this->media = new ArrayCollection();

    }

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(type: 'boolean')]
    private $isVerified = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
      // return (string) $this->email;

       return $this->uuid->toRfc4122();
    }

    public function getUuid(): Uuid
    {
        return $this->uuid;
    }

    public function setUuid(Uuid $uuid): void
    {
        $this->uuid = $uuid;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getRawPassword():string
    {
        return $this->rawPassword;
    }


    public function setRawPassword($rawPassword):self
    {
        $this->rawPassword = $rawPassword;
        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function isAdmin():bool
    {
        return  in_array(self::ROLE_ADMIN, $this->getRoles());
    }

    public function isSuAdmin():bool
    {
        return in_array(self::ROLE_SUPER_ADMIN, $this->getRoles());
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    #[ORM\Column(type: "string",length: 255, nullable: true)]
    private ?string $totpSecret = null;

    /**
     * @return Collection<int, OAuth2UserConsent>
     */
    public function getOAuth2UserConsents(): Collection
    {
        return $this->oAuth2UserConsents;
    }

    public function addOAuth2UserConsent(OAuth2UserConsent $oAuth2UserConsent): self
    {
        if (!$this->oAuth2UserConsents->contains($oAuth2UserConsent)) {
            $this->oAuth2UserConsents->add($oAuth2UserConsent);
            $oAuth2UserConsent->setUser($this);
        }

        return $this;
    }

    public function removeOAuth2UserConsent(OAuth2UserConsent $oAuth2UserConsent): self
    {
        if ($this->oAuth2UserConsents->removeElement($oAuth2UserConsent)) {
            // set the owning side to null (unless already changed)
            if ($oAuth2UserConsent->getUser() === $this) {
                $oAuth2UserConsent->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, MediaCategory>
     */
    public function getMediaCategory(): Collection
    {
        return $this->mediaCategory;
    }

    public function addMediaCategory(MediaCategory $mediaCategory): self
    {
        if (!$this->mediaCategory->contains($mediaCategory)) {
            $this->mediaCategory->add($mediaCategory);
            $mediaCategory->setUser($this);
        }

        return $this;
    }

    public function removeMediaCategory(MediaCategory $mediaCategory): self
    {
        if ($this->mediaCategory->removeElement($mediaCategory)) {
            // set the owning side to null (unless already changed)
            if ($mediaCategory->getUser() === $this) {
                $mediaCategory->setUser(null);
            }
        }

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
            $media->setUser($this);
        }

        return $this;
    }

    public function removeMedia(Media $media): self
    {
        if ($this->media->removeElement($media)) {
            // set the owning side to null (unless already changed)
            if ($media->getUser() === $this) {
                $media->setUser(null);
            }
        }
        return $this;
    }

    public function isTotpAuthenticationEnabled(): bool
    {
        return (bool)$this->totpSecret;
    }

    public function getTotpAuthenticationUsername(): string
    {
        //return $this->getUserIdentifier();
        return $this->getUserIdentifier();
    }

    public function getTotpAuthenticationConfiguration(): ?TotpConfigurationInterface
    {
        return new TotpConfiguration($this->totpSecret, TotpConfiguration::ALGORITHM_SHA1, 30, 6);
    }

    public function getTotpSecret(): string
    {
        return $this->totpSecret ?? '';
    }

    public function setTotpSecret(?string $totpSecret): self
    {
        $this->totpSecret = $totpSecret;
        return $this;
    }


}
