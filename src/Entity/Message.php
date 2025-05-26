<?php

namespace App\Entity;

use App\Enums\ServicesEnum;
use App\Repository\MessageRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Message
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[ORM\Column(length: 255)]
	private ?string $content = null;

	#[ORM\Column(length: 255)]
	private ?string $author = null;

	#[ORM\Column(length: 255, enumType: ServicesEnum::class)]
	private ?ServicesEnum $service = null;

	#[ORM\Column(type: 'datetime_immutable')]
	private \DateTimeImmutable $createdAt;

	#[ORM\Column(type: 'datetime_immutable')]
	private \DateTimeImmutable $updatedAt;

	#[ORM\Column(type: 'json')]
	private array $readBy = []; // Stocke les valeurs string des enums

	#[ORM\PrePersist]
	public function onPrePersist(): void
	{
		$now = new \DateTimeImmutable();
		$this->createdAt = $now;
		$this->updatedAt = $now;
	}

	#[ORM\PreUpdate]
	public function onPreUpdate(): void
	{
		$this->updatedAt = new \DateTimeImmutable();
	}

	/**
	 * Retourne un tableau d'objets ServicesEnum basé sur les valeurs stockées.
	 *
	 * @return ServicesEnum[]
	 */
	public function getReadBy(): array
	{
		return array_map(static fn(string $value) => ServicesEnum::from($value), $this->readBy);
	}

	/**
	 * Définit les services ayant lu le message.
	 *
	 * @param ServicesEnum ...$services Les services ayant lu le message.
	 * @return static
	 */
	public function setReadBy(ServicesEnum ...$services): static
	{
		$this->readBy = array_map(static fn(ServicesEnum $s) => $s->value, $services);
		return $this;
	}

	/**
	 * Ajoute un service à la liste de ceux ayant lu le message.
	 *
	 * @param ServicesEnum $service Le service à ajouter.
	 * @return static
	 */
	public function addReadBy(ServicesEnum $service): static
	{
		if (!in_array($service->value, $this->readBy, true)) {
			$this->readBy[] = $service->value;
		}
		return $this;
	}

	/**
	 * Retire un service de la liste de ceux ayant lu le message.
	 *
	 * @param ServicesEnum $service Le service à retirer.
	 * @return static
	 */
	public function removeReadBy(ServicesEnum $service): static
	{
		$this->readBy = array_values(array_filter( // array_values pour réindexer
			$this->readBy,
			static fn(string $v) => $v !== $service->value
		));
		return $this;
	}

	public function getId(): ?int
	{
		return $this->id;
	}

	public function getContent(): ?string
	{
		return $this->content;
	}

	public function setContent(string $content): static
	{
		$this->content = $content;
		return $this;
	}

	public function getAuthor(): ?string
	{
		return $this->author;
	}

	public function setAuthor(string $author): static
	{
		$this->author = $author;
		return $this;
	}

	public function getService(): ?ServicesEnum
	{
		return $this->service;
	}

	public function setService(ServicesEnum $service): static
	{
		$this->service = $service;
		return $this;
	}

	public function getCreatedAt(): \DateTimeImmutable
	{
		return $this->createdAt;
	}

	public function getUpdatedAt(): \DateTimeImmutable
	{
		return $this->updatedAt;
	}

	/**
	 * Convertit l'entité en tableau pour la sérialisation.
	 * Le champ 'readBy' contiendra un tableau de chaînes (valeurs des enums).
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(): array
	{
		return [
			'id' => $this->getId(),
			'content' => $this->getContent(),
			'author' => $this->getAuthor(),
			'service' => $this->getService()?->value, // Utilise l'opérateur null-safe
			'createdAt' => $this->getCreatedAt()->format(\DateTimeInterface::ATOM),
			'updatedAt' => $this->getUpdatedAt()->format(\DateTimeInterface::ATOM),
		];
	}
}
