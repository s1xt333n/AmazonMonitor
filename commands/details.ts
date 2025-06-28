import { EmbedBuilder, Guild, Message } from 'discord.js'
import { linkToAsin, priceFormat } from '../common/utils.js'
import { item } from '../common/amazon.js'
import { safeSend } from '../common/discord-helpers.js'
import { EnhancedEmbedBuilder } from '../components/ui/embeds.js'

export default {
  name: 'details',
  description: 'Return details using an amazon link',
  usage: 'details [amazon link]',
  type: 'view',
  run
}

async function run(guild: Guild, message: Message, args: string[]) {
  const asin = linkToAsin(args[1])
  const tld = args[1].split('amazon.')[1].split('/')[0]

  if (!asin) {
    const enhancedEmbed = new EnhancedEmbedBuilder()
    enhancedEmbed.setError(enhancedEmbed.getMessage('details_invalid_link'))
    safeSend(message, { embeds: [enhancedEmbed] })
    return
  }

  const product = await item(`https://www.amazon.${tld}/dp/${asin}`)

  // Hot-replace empty fields
  Object.keys(product).forEach(k => {
    // @ts-ignore This is fine, we aren't interacting with this data
    if (!product[k] || product[k].length < 1) product[k] = 'none'
  })

  const enhancedEmbed = new EnhancedEmbedBuilder()
    .setTitle(product.fullTitle)
    .setColor('Purple')
    .setThumbnail(product.image)
    .setDescription(product.fullLink)
    .addProductFields(product)

  if (product.seller && product.seller !== 'none') {
    enhancedEmbed.setAuthor({
      name: product.seller.includes('\n') ? 'Vendeur invalide' : product.seller,
    })
  }

  if (product.features && Array.isArray(product.features) && product.features.length > 0 && product.features[0] !== 'none') {
    enhancedEmbed.addFields([{
      name: enhancedEmbed.getMessage('features'),
      value: product.features.slice(0, 3).join('\n\n'),
      inline: false
    }])
  }

  safeSend(message, {
    embeds: [enhancedEmbed]
  })
}