<?php

// TODO : suppirmer de l'affichage des records le tableau readby

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
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class MessageController extends AbstractController
{
	#[Route('/messages', name: 'app_message', methods: ['GET'])]
	public function index(MessageRepository $repository): JsonResponse
	{
		try {
			$messages = $repository->findAll();
		} catch (\Exception $e) {
			return $this->json(['error' => 'An error occurred while fetching messages.'], Response::HTTP_INTERNAL_SERVER_ERROR);
		}

		$data = array_map(static fn($message) => $message->toArray(), $messages);
		return $this->json($data, 200);
	}

	#[Route('/messages/{id}', name: 'app_message_read', methods: ['GET'])]
	public function read(int $id, Request $request, MessageRepository $repository): JsonResponse
	{
		$message = $repository->find($id);

		if (!$message) {
			return $this->json(['error' => 'Message not found'], Response::HTTP_NOT_FOUND);
		}

		$serviceHeader = $request->headers->get('X-Service');

		if ($serviceHeader === $message->getService()->value) {
			return $this->json(['error' => 'You cannot read the message you sent'], Response::HTTP_FORBIDDEN);
		}

		if ($message->getReadBy() && in_array($serviceHeader, array_map(static fn($service) => $service->value, $message->getReadBy()), true)) {
			return $this->json(['error' => 'You have already read this message'], Response::HTTP_FORBIDDEN);
		}

		if ($serviceHeader) {
			try {
				$service = ServicesEnum::from($serviceHeader);
				$message->addReadBy($service);
				$repository->save($message, true);
			} catch (\ValueError $e) {
				throw new BadRequestHttpException('Invalid service specified in header.');
			}
		}

		return $this->json($message->toArray(), Response::HTTP_OK);
	}

	/**
	 * @throws \JsonException
	 */
	#[Route('/messages', name: 'app_message_create', methods: ['POST'])]
	public function create(Request $request, ValidatorInterface $validator, MessageRepository $repository): JsonResponse
	{
		$serviceHeader = $request->headers->get('X-Service');
		if (!$serviceHeader) {
			throw new BadRequestHttpException('The X-Service header is required.');
		}

		try {
			$service = ServicesEnum::from($serviceHeader);
		} catch (\ValueError $e) {
			throw new BadRequestHttpException('Invalid service specified in header.');
		}

		$data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

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
