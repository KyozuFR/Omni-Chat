<?php

namespace App\Repository;

use App\Entity\Message;
use App\Enums\ServicesEnum;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository
{
	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, Message::class);
	}

	/**
	 * Sauvegarde une entité Message dans la base de données.
	 *
	 * @param Message $message L'entité à sauvegarder.
	 * @param bool $flush Indique si les changements doivent être immédiatement écrits en base.
	 */
	public function save(Message $message, bool $flush = false): void
	{
		$this->getEntityManager()->persist($message);

		if ($flush) {
			$this->getEntityManager()->flush();
		}
	}

	public function findUnreadMessagesByService(ServicesEnum $service): array
	{
		return $this->createQueryBuilder('m')
			->where('m.service != :service')
			// MariaDB query: JSON column NOT LIKE pattern matching the service value
			->andWhere('m.readBy NOT LIKE :servicePattern')
			->setParameter('service', $service)
			->setParameter('servicePattern', '%"' . $service->value . '"%')
			->getQuery()
			->getResult();
	}
}
