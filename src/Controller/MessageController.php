<?php

namespace App\Controller;

use App\Repository\MessageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\Message;
use App\Enums\ServicesEnum;

final class MessageController extends AbstractController
{
	#[Route('/messages', name: 'app_message', methods: ['GET'])]
	public function index(Request $request, MessageRepository $repository): JsonResponse
	{
		$serviceHeader = $request->headers->get('X-Service');

		if (!$serviceHeader || !ServicesEnum::tryFrom($serviceHeader)) {
			$message = $repository->findAll();
			$data = array_map(static fn($message) => $message->toArray(), $message);
			return $this->json($data, Response::HTTP_OK);
		}

		$service = ServicesEnum::from($serviceHeader);

		// Récupérer les messages non lus par le service
		$messages = $repository->findUnreadMessagesByService($service);

		if (empty($messages)) {
			return $this->json([], Response::HTTP_OK);
		}

		// Ajouter le service à la liste des lecteurs pour chaque message
		foreach ($messages as $message) {
			$message->addReadBy($service);
		}
		// Flush all changes at once
		$repository->getEntityManager()->flush();

		$data = array_map(static fn($message) => $message->toArray(), $messages);

		return $this->json($data, Response::HTTP_OK);
	}

	#[Route('/messages/{id}', name: 'app_message_read', methods: ['GET'])]
	public function read(int $id, Request $request, MessageRepository $repository): JsonResponse
	{
		$message = $repository->find($id);

		if (!$message) {
			return $this->json(['error' => 'Message not found'], Response::HTTP_NOT_FOUND);
		}

		// Do not modify readBy when reading a single message

		return $this->json($message->toArray(), Response::HTTP_OK);
	}

	#[Route('/messages', name: 'app_message_create', methods: ['POST'])]
	public function create(Request $request, ValidatorInterface $validator, MessageRepository $repository): JsonResponse
	{
		$serviceHeader = $request->headers->get('X-Service');
		if (!$serviceHeader) {
			return $this->json(['error' => 'X-Service header is required.'], Response::HTTP_BAD_REQUEST);
		}

		try {
			$service = ServicesEnum::from($serviceHeader);
		} catch (\ValueError $e) {
			return $this->json(['error' => 'Invalid service specified in X-Service header.'], Response::HTTP_BAD_REQUEST);
		}

		try {
			$data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
		} catch (\JsonException $e) {
			return $this->json(['error' => 'Invalid JSON data.'], Response::HTTP_BAD_REQUEST);
		}

		$constraints = new Assert\Collection([
			'author' => [new Assert\NotBlank(), new Assert\Type('string')],
			'content' => [new Assert\NotBlank(), new Assert\Type('string')],
		]);

		$violations = $validator->validate($data, $constraints);

		if (count($violations) > 0) {
			$errors = [];
			foreach ($violations as $violation) {
				$errors[$violation->getPropertyPath()] = $violation->getMessage();
			}
			return $this->json(['errors' => $errors], Response::HTTP_BAD_REQUEST);
		}

		$message = (new Message())
			->setAuthor($data['author'])
			->setService($service)
			->setContent($data['content']);

		$repository->save($message, true);

		return $this->json($message->toArray(), Response::HTTP_CREATED);
	}
}
