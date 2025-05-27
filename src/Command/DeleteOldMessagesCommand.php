<?php
namespace App\Command;

use App\Repository\MessageRepository;
use DateTimeImmutable;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:messages:cleanup',
    description: 'Supprime les messages vieux de plus d\'un certain nombre de minutes.',
)]
final class DeleteOldMessagesCommand extends Command
{
    private MessageRepository $repository;

    public function __construct(MessageRepository $repository)
    {
        parent::__construct();
        $this->repository = $repository;
    }

    protected function configure(): void
    {
        $this
            ->addOption(
                'minutes',
                'm',
                InputOption::VALUE_OPTIONAL,
                'Âge des messages à supprimer en minutes',
                5
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $minutes = (int) $input->getOption('minutes');
        if ($minutes < 1) {
            $io->error('Le nombre de minutes doit être supérieur ou égal à 1.');
            return Command::INVALID;
        }

        // Calcul du seuil de suppression
        $threshold = new DateTimeImmutable(sprintf('-%d minutes', $minutes));
        $deletedCount = $this->repository->deleteOlderThan($threshold);

        if ($deletedCount > 0) {
            $io->success(sprintf("%d message(s) antérieur(s) à %d minute(s) supprimé(s).", $deletedCount, $minutes));
        } else {
            $io->info('Aucun message à supprimer.');
        }

        return Command::SUCCESS;
    }
}
