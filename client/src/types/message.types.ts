export enum ServicesEnum {
  DISCORD = 'discord',
  WHATSAPP = 'whatsapp',
  GARRYS_MOD = 'garrys_mod',
  MINECRAFT = 'minecraft',
  TWITCH = 'twitch',
  WEBSITE = 'website',
  ROBLOX = 'roblox',
  TELEGRAM = 'telegram',
}

export interface Message {
  id: number
  author: string
  content: string
  service: ServicesEnum
  createdAt: string
}

