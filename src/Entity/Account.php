<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\AccountRepository;
use App\Service\UploaderHelper;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AccountRepository::class)]

class Account
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $imageFilename = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $registerIp = null;

    #[ORM\Column(length: 24, nullable: true)]
    private ?string $title = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $firstName = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $lastName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $company = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $zip = null;

    #[ORM\Column(length: 125, nullable: true)]
    private ?string $country = null;

    #[ORM\Column(length: 125, nullable: true)]
    private ?string $street = null;

    #[ORM\Column(length: 12, nullable: true)]
    private ?string $hnr = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $mobil = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $notiz = null;

    #[ORM\Column]
    private ?bool $changePw = null;

    #[ORM\Column]
    private ?bool $mustValidated = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $accountHolder = null;

    #[ORM\Column]
    private array $voter = [];

    #[ORM\Column(length: 24, nullable: true, options: ['default' => 'mp'])]
    private ?string $gravatar = null;


    /* #[ORM\OneToOne(cascade: ['persist', 'remove'])]
     #[ORM\JoinColumn(nullable: false)]
     private ?User $accountManager = null;*/

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->gravatar = 'mp';
        $this->voter = [];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRegisterIp(): ?string
    {
        return $this->registerIp;
    }

    public function setRegisterIp(?string $registerIp): static
    {
        $this->registerIp = $registerIp;

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

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): static
    {
        $this->company = $company;

        return $this;
    }

    public function getZip(): ?string
    {
        return $this->zip;
    }

    public function setZip(?string $zip): static
    {
        $this->zip = $zip;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(?string $street): static
    {
        $this->street = $street;

        return $this;
    }

    public function getHnr(): ?string
    {
        return $this->hnr;
    }

    public function setHnr(?string $hnr): static
    {
        $this->hnr = $hnr;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getMobil(): ?string
    {
        return $this->mobil;
    }

    public function setMobil(?string $mobil): static
    {
        $this->mobil = $mobil;

        return $this;
    }

    public function getNotiz(): ?string
    {
        return $this->notiz;
    }

    public function setNotiz(?string $notiz): static
    {
        $this->notiz = $notiz;

        return $this;
    }

    public function isChangePw(): ?bool
    {
        return $this->changePw;
    }

    public function setChangePw(bool $changePw): static
    {
        $this->changePw = $changePw;

        return $this;
    }

    public function isMustValidated(): ?bool
    {
        return $this->mustValidated;
    }

    public function setMustValidated(bool $mustValidated): static
    {
        $this->mustValidated = $mustValidated;

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

    public function getAccountHolder(): ?User
    {
        return $this->accountHolder;
    }

    public function setAccountHolder(?User $accountHolder): static
    {
        $this->accountHolder = $accountHolder;

        return $this;
    }


    public function getImageFilename(): ?string
    {
        return $this->imageFilename;
    }

    public function setImageFilename(?string $imageFilename): static
    {
        $this->imageFilename = $imageFilename;

        return $this;
    }

    public function getImagePath(): string
    {
        return UploaderHelper::ACCOUNT . '/' . $this->getImageFilename();
    }

    public function getVoter(): array
    {
        return $this->voter;
    }

    public function setVoter(array $voter): static
    {
        $this->voter = $voter;

        return $this;
    }

    public function getGravatar(): ?string
    {
        return $this->gravatar;
    }

    public function setGravatar(string $gravatar): static
    {
        $this->gravatar = $gravatar;

        return $this;
    }

    public function getProfil():array
    {
        $result = [
            'email' => $this->getAccountHolder()->getEmail(),
            'firstName' => $this->getFirstName(),
            'lastName' => $this->getLastName(),
            'title' => $this->getTitle(),
            'company' => $this->getCompany(),
            'gravatar' => $this->getGravatar(),
            'image' => $this->getImageFilename(),
            'phone' => $this->getPhone(),
            'mobile' => $this->getMobil(),
            'house_number' => $this->getHnr(),
            'street' => $this->getStreet(),
            'zip' => $this->getZip(),
            'country' => $this->getCountry(),
        ];
        if(!$this->getAccountHolder()->isSuAdmin() && $this->getAccountHolder()->isVerified()) {
            return $result;
        }

        return [];
    }
}
