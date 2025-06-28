import fs from 'fs'
import { Client, EmbedBuilder, Message } from 'discord.js'
import { trim } from '../common/utils.js'
import debug from '../common/debug.js'
import { search } from '../common/amazon.js'
import { parseArgs } from '../common/arguments.js'
import { safeSend } from '../common/discord-helpers.js'
import { EnhancedEmbedBuilder } from '../components/ui/embeds.js'
import { createPaginationButtons, createActionButtons } from '../components/ui/buttons.js'

const { tld } = JSON.parse(fs.readFileSync('./config.json').toString())

export default {
  name: 'search',
  description: 'Search and return the top 10 items using a search term', 
  usage: 'search [search term] [optional: -p for price limit]',
  type: 'view',
  run
}

const argDef = {
  priceLimit: {
    name: 'priceLimit',
    aliases: ['p'],
    type: 'number'
  },
  pricePercentage: {
    name: 'pricePercentage',
    aliases: ['e'],
    type: 'number'
  }
}

async function run(bot: Client, message: Message, args: string[]) {
  args.splice(0, 1)
  const phrase = args.join(' ').replace(/\s*-[a-z]\s*\d*\s*/g, '').trim()
  const parsedArgs = parseArgs(args, argDef)

  if (!phrase) {
    const enhancedEmbed = new EnhancedEmbedBuilder()
    enhancedEmbed.setError(enhancedEmbed.getMessage('search_no_term'))
    safeSend(message, { embeds: [enhancedEmbed] })
    return
  }

  debug.log(`Searching for ${phrase}...`)

  const results = await search(phrase, tld)

  if (!results || results.length < 1) {
    const enhancedEmbed = new EnhancedEmbedBuilder()
    enhancedEmbed.setError(enhancedEmbed.getMessage('search_no_results', { query: phrase }))
    safeSend(message, { embeds: [enhancedEmbed] })
    return
  }

  // Filter by price limit if specified
  const filteredResults = parsedArgs.priceLimit 
    ? results.filter(result => parseFloat(result.price) <= (parsedArgs.priceLimit as number))
    : results

  // Pagination logic
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
  const currentPage = 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredResults.length)
  const pageResults = filteredResults.slice(startIndex, endIndex)

  const enhancedEmbed = new EnhancedEmbedBuilder()
    .setSearchResults(phrase)

  pageResults.forEach((result, index) => {
    const priceWithCoupon = result.coupon > 0 ? parseFloat(result.price) - result.coupon : parseFloat(result.price)
    const priceText = parseFloat(result.price) 
      ? `${result.symbol}${result.coupon > 0 
          ? `${priceWithCoupon.toFixed(2)} (${result.symbol}${result.coupon.toFixed(2)} coupon)` 
          : result.price}`
      : 'Pas en stock'

    enhancedEmbed.addFields([{
      name: `${startIndex + index + 1}. ${trim(result.fullTitle, 50)}`,
      value: `${priceText} - ${result.fullLink}`,
      inline: false
    }])
  })

  const components = []
  
  // Add pagination if there are multiple pages
  if (totalPages > 1) {
    const paginationRow = createPaginationButtons({
      currentPage,
      totalPages,
      customId: 'search'
    })
    components.push(paginationRow)
  }

  safeSend(message, {
    embeds: [enhancedEmbed],
    components
  })
}