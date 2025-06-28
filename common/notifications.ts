import { Client, EmbedBuilder } from 'discord.js'
import fs from 'fs'
import { parseParams, priceFormat } from './utils.js'
import { EnhancedEmbedBuilder } from '../components/ui/embeds.js'

export async function sendNotifications(bot: Client, notifications: NotificationData[]) {
  const config: Config = JSON.parse(fs.readFileSync('./config.json').toString())

  for (const notif of notifications) {
    // If we have url_params, add them to the URL
    if (Object.keys(config.url_params).length > 0) {
      notif.link += parseParams(config.url_params)
    }

    if (notif.oldPrice === 0 && notif.newPrice !== 0) {
      // Old price was 0 but new price isn't? Item is now in stock!
      await sendInStock(bot, notif)
    }

    // Now we check if the price differences meet all of the provided criteria
    const meetsPriceLimit = notif.priceLimit ? notif.newPrice <= notif.priceLimit : true
    const meetsPricePercentage = notif.pricePercentage ? notif.newPrice <= (notif.oldPrice - (notif.oldPrice * (notif.pricePercentage / 100))) : true
    const meetsDifference = notif.difference ? notif.newPrice < (notif.oldPrice - notif.difference) : true

    // Prices being zero just means the item is out of stock
    const priceNotZero = notif.newPrice !== 0

    if (meetsPriceLimit && meetsPricePercentage && meetsDifference && priceNotZero) {
      await sendPriceChange(bot, notif)
    }
  }
}

export async function sendInStock(bot: Client, notification: NotificationData) {
  const enhancedEmbed = new EnhancedEmbedBuilder()
  
  enhancedEmbed
    .setInStockAlert()
    .setTitle(`📦 ${notification.itemName}`)
    .setAuthor({
      name: 'AmazonMonitor'
    })
    .setThumbnail(notification.image)
    .setDescription(`${enhancedEmbed.getMessage('price_new')}: ${notification.symbol} ${notification.newPrice}\n\n${notification.link}`)
    
  const channel = await bot.channels.fetch(notification.channelId)

  // @ts-ignore This can never be a category channel
  channel.send({ embeds: [enhancedEmbed] })
}

export async function sendPriceChange(bot: Client, notification: NotificationData) {
  const enhancedEmbed = new EnhancedEmbedBuilder()
    .setPriceAlert(notification.itemName)
    .setAuthor({
      name: 'AmazonMonitor'
    })
    .setThumbnail(notification.image)
    .setDescription(notification.link)
    .addPriceField(notification.oldPrice, notification.newPrice, notification.symbol, notification.coupon)

  const channel = await bot.channels.fetch(notification.channelId)

  // @ts-ignore This can never be a category channel
  channel.send({ embeds: [enhancedEmbed] })
}