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

	#[Route('/messages', name: 'app_message_create', methods: ['POST'])]
	public function create(Request $request, ValidatorInterface $validator, MessageRepository $repository): JsonResponse
	{
		$data = json_decode($request->getContent(), true);

		$constraints = new Assert\Collection([
			'author' => [new Assert\NotBlank(), new Assert\Type('string')],
			'service' => [new Assert\NotBlank(), new Assert\Choice(array_column(ServicesEnum::cases(), 'value'))],
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
			->setService(ServicesEnum::from($data['service']))
			->setContent($data['content']);

		$repository->save($message, true);

		return $this->json($message->toArray(), Response::HTTP_CREATED);
	}
}
