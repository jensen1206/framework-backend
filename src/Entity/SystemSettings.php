<?php

namespace App\Entity;

use App\Repository\SystemSettingsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SystemSettingsRepository::class)]
class SystemSettings
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 10)]
    private ?string $version = null;

    #[ORM\Column(length: 64, unique: true)]
    private ?string $designation = null;

    #[ORM\Column]
    private array $app = [];

    #[ORM\Column]
    private array $email = [];

    #[ORM\Column]
    private array $log = [];

    #[ORM\Column]
    private array $oauth = [];

    #[ORM\Column]
    private array $register = [];

    #[ORM\Column]
    private array $design = [];

    public function __construct()
    {
        $this->app = [];
        $this->email = [];
        $this->log = [];
        $this->oauth = [];
        $this->register = [];
        $this->design = [];
        $this->designation = 'system';
        $this->version = $_ENV['APP_VERSION'];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getApp(): array
    {
        return $this->app;
    }

    public function setApp(array $app): static
    {
        $this->app = $app;

        return $this;
    }

    public function getEmail(): array
    {
        return $this->email;
    }

    public function setEmail(array $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getLog(): array
    {
        return $this->log;
    }

    public function setLog(array $log): static
    {
        $this->log = $log;

        return $this;
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

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(string $version): static
    {
        $this->version = $version;

        return $this;
    }

    public function getOauth(): array
    {
        return $this->oauth;
    }

    public function setOauth(array $oauth): static
    {
        $this->oauth = $oauth;

        return $this;
    }

    public function getRegister(): array
    {
        return $this->register;
    }

    public function setRegister(array $register): static
    {
        $this->register = $register;

        return $this;
    }

    public function getDesign(): array
    {
        return $this->design;
    }

    public function setDesign(array $design): static
    {
        $this->design = $design;

        return $this;
    }

}
