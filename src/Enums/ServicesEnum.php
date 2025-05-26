<?php

namespace App\Enums;

enum ServicesEnum: string
{
	case DISCORD = 'discord';
	case WHATSAPP = 'whatsapp';
	case GARRYS_MOD = 'garrys_mod';
	case MINECRAFT = 'minecraft';
	case TWITCH = 'twitch';
	case WEBSITE = 'website';
	case ROBLOX = 'roblox';
	case TELEGRAM = 'telegram';

	public function getCases(): string
	{
		return match ($this) {
			self::DISCORD => 'Discord',
			self::WHATSAPP => 'WhatsApp',
			self::GARRYS_MOD => 'Garry\'s Mod',
			self::MINECRAFT => 'Minecraft',
			self::TWITCH => 'Twitch',
			self::WEBSITE => 'Website',
			self::ROBLOX => 'Roblox',
			self::TELEGRAM => 'Telegram',
		};
	}
}
