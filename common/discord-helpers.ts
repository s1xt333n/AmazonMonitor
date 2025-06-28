import { Message, EmbedBuilder, TextChannel, DMChannel, NewsChannel, ThreadChannel, ActionRowBuilder, ButtonBuilder } from 'discord.js'

type SendableChannel = TextChannel | DMChannel | NewsChannel | ThreadChannel

export function isSendableChannel(channel: any): channel is SendableChannel {
  return 'send' in channel
}

export async function safeSend(message: Message, content: string | { embeds: EmbedBuilder[]; components?: ActionRowBuilder<ButtonBuilder>[] }) {
  if (isSendableChannel(message.channel)) {
    return message.channel.send(content)
  }
  console.error('Cannot send message to this channel type')
}