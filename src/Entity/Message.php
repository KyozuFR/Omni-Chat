<?php

namespace App\Entity;

use App\Enums\ServicesEnum;
use App\Repository\MessageRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
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

	#[ORM\Column(length: 255)]
	private ?ServicesEnum $service = null;

	#[ORM\Column(type: 'datetime_immutable')]
	private \DateTimeImmutable $createdAt;

	#[ORM\Column(type: 'datetime_immutable')]
	private \DateTimeImmutable $updatedAt;

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

	public function getService(): ServicesEnum
	{
		return $this->service;
	}

	public function setService(ServicesEnum $service): static
	{
		$this->service = $service;

		return $this;
	}

	/**
	 * @return \DateTimeImmutable
	 */
	public function getCreatedAt(): \DateTimeImmutable
	{
		return $this->createdAt;
	}

	/**
	 * @return \DateTimeImmutable
	 */
	public function getUpdatedAt(): \DateTimeImmutable
	{
		return $this->updatedAt;
	}

	public function toArray(): array
	{
		return [
			'id' => $this->getId(),
			'content' => $this->getContent(),
			'author' => $this->getAuthor(),
			'service' => [
				'key' => $this->getService()->value,
				'label' => $this->getService()->getCases(),
			],
			'createdAt' => $this->getCreatedAt()->format(\DateTimeInterface::ATOM),
			'updatedAt' => $this->getUpdatedAt()->format(\DateTimeInterface::ATOM),
		];
	}
}
