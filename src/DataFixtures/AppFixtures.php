<?php

namespace App\DataFixtures;

use App\Entity\Message;
use App\Enums\ServicesEnum;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AppFixtures extends Fixture
{
	public function load(ObjectManager $manager): void
	{
		$faker = Factory::create('fr_FR');
		$services = ServicesEnum::cases();

		for ($i = 0; $i < 10; $i++) {
			$message = (new Message())
				->setContent($faker->sentence())
				->setAuthor($faker->name())
				->setService($services[array_rand($services)]);

			// assignation aléatoire de services ayant lu le message
			$readers = $faker->randomElements($services, random_int(0, count($services)));
			foreach ($readers as $reader) {
				$message->addReadBy($reader);
			}

			$manager->persist($message);
		}

		$manager->flush();
	}
}
