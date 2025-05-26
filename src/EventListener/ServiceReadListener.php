<?php

namespace App\EventListener;

use App\Enums\ServicesEnum;
use App\Repository\MessageRepository;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpFoundation\Request;

class ServiceReadListener
{
    private MessageRepository $messageRepository;

    public function __construct(MessageRepository $messageRepository)
    {
        $this->messageRepository = $messageRepository;
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        // Vérifie si la méthode est GET
        if ($request->getMethod() !== Request::METHOD_GET) {
            return;
        }

        $serviceHeader = $request->headers->get('X-Service');

        // Vérifie si le header X-Service est valide
        if (!$serviceHeader || !ServicesEnum::tryFrom($serviceHeader)) {
            return;
        }

        $service = ServicesEnum::from($serviceHeader);

        // Récupère tous les messages et ajoute le service à readBy
        $messages = $this->messageRepository->findAll();
        foreach ($messages as $message) {
            if (!in_array($service->value, $message->getReadBy(), true)) {
                $message->addReadBy($service);
                $this->messageRepository->save($message, true);
            }
        }
    }
}
