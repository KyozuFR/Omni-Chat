<?php

namespace App\Controller;

use App\Repository\MessageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

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

//	#[Route('/messages', name: 'app_message_create', methods: ['POST'])]
}
