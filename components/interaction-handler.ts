import { ButtonInteraction, Client, EmbedBuilder } from 'discord.js'
import { addWatchlistItem, getWatchlist, removeWatchlistItem } from '../common/watchlist.js'
import { item, search } from '../common/amazon.js'
import { EnhancedEmbedBuilder } from './ui/embeds.js'
import { createActionButtons, createPaginationButtons } from './ui/buttons.js'
import fs from 'fs'

export async function handleButtonInteraction(interaction: ButtonInteraction) {
  const { customId } = interaction
  
  try {
    if (customId.startsWith('search_')) {
      await handleSearchPagination(interaction)
    } else if (customId.startsWith('details_')) {
      await handleDetailsButton(interaction)
    } else if (customId.startsWith('add_to_watch_')) {
      await handleAddToWatchButton(interaction)
    } else if (customId.startsWith('remove_')) {
      await handleRemoveButton(interaction)
    } else if (customId.startsWith('watchlist_')) {
      await handleWatchlistPagination(interaction)
    }
  } catch (error) {
    console.error('Error handling button interaction:', error)
    await interaction.reply({
      content: '❌ Une erreur est survenue lors du traitement de votre demande.',
      ephemeral: true
    })
  }
}

async function handleSearchPagination(interaction: ButtonInteraction) {
  const parts = interaction.customId.split('_')
  const action = parts[1] // 'previous' or 'next'
  const newPage = parseInt(parts[2])
  
  // Get original search query from embed title
  const embed = interaction.message.embeds[0]
  const title = embed.title || ''
  const query = title.replace(/🔍 Résultats de recherche pour : /, '').replace(/Search results for phrase: /, '')
  
  if (!query) {
    await interaction.reply({
      content: '❌ Impossible de déterminer la requête de recherche.',
      ephemeral: true
    })
    return
  }
  
  const config = JSON.parse(fs.readFileSync('./config.json').toString())
  const results = await search(query, config.tld)
  
  if (!results || results.length === 0) {
    await interaction.reply({
      content: '❌ Aucun résultat trouvé.',
      ephemeral: true
    })
    return
  }
  
  const itemsPerPage = 5
  const totalPages = Math.ceil(results.length / itemsPerPage)
  const startIndex = (newPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, results.length)
  const pageResults = results.slice(startIndex, endIndex)
  
  const enhancedEmbed = new EnhancedEmbedBuilder()
    .setSearchResults(query)
  
  pageResults.forEach((result, index) => {
    const priceText = parseFloat(result.price) 
      ? `${result.symbol}${result.coupon > 0 
          ? `${(parseFloat(result.price) - result.coupon).toFixed(2)} (${result.symbol}${result.coupon.toFixed(2)} coupon)` 
          : result.price}`
      : 'Pas en stock'
    
    enhancedEmbed.addFields([{
      name: `${startIndex + index + 1}. ${result.fullTitle.slice(0, 50)}${result.fullTitle.length > 50 ? '...' : ''}`,
      value: `${priceText} - ${result.fullLink}`,
      inline: false
    }])
  })
  
  const paginationRow = createPaginationButtons({
    currentPage: newPage,
    totalPages,
    customId: 'search'
  })
  
  await interaction.update({
    embeds: [enhancedEmbed],
    components: [paginationRow]
  })
}

async function handleDetailsButton(interaction: ButtonInteraction) {
  const asin = interaction.customId.replace('details_', '')
  
  // Extract TLD from the interaction message if possible
  const embed = interaction.message.embeds[0]
  let tld = 'com'
  
  if (embed.fields) {
    for (const field of embed.fields) {
      if (field.value.includes('amazon.')) {
        const match = field.value.match(/amazon\.([a-z.]+)\//);
        if (match) {
          tld = match[1]
          break
        }
      }
    }
  }
  
  await interaction.deferReply({ ephemeral: true })
  
  try {
    const product = await item(`https://www.amazon.${tld}/dp/${asin}`)
    
    if (!product) {
      await interaction.editReply({
        content: '❌ Impossible de récupérer les détails du produit.'
      })
      return
    }
    
    const detailsEmbed = new EnhancedEmbedBuilder()
      .setTitle(product.fullTitle)
      .setColor('Purple')
      .setThumbnail(product.image)
      .setDescription(product.fullLink)
      .addProductFields(product)
    
    if (product.features && Array.isArray(product.features) && product.features.length > 0) {
      detailsEmbed.addFields([{
        name: 'Caractéristiques',
        value: product.features.slice(0, 3).join('\n'),
        inline: false
      }])
    }
    
    await interaction.editReply({
      embeds: [detailsEmbed]
    })
  } catch (error) {
    await interaction.editReply({
      content: '❌ Erreur lors de la récupération des détails du produit.'
    })
  }
}

async function handleAddToWatchButton(interaction: ButtonInteraction) {
  const asin = interaction.customId.replace('add_to_watch_', '')
  
  await interaction.deferReply({ ephemeral: true })
  
  try {
    const watchlist = await getWatchlist()
    const config = JSON.parse(fs.readFileSync('./config.json').toString())
    
    if (watchlist.length >= config.guild_item_limit) {
      await interaction.editReply({
        content: `❌ Vous avez atteint le nombre maximum d'articles (${config.guild_item_limit})`
      })
      return
    }
    
    // Extract TLD and construct full link
    let tld = config.tld || 'com'
    const embed = interaction.message.embeds[0]
    
    if (embed.fields) {
      for (const field of embed.fields) {
        if (field.value.includes('amazon.')) {
          const match = field.value.match(/amazon\.([a-z.]+)\//);
          if (match) {
            tld = match[1]
            break
          }
        }
      }
    }
    
    const link = `https://www.amazon.${tld}/dp/${asin}`
    
    // Check if item already exists
    const existing = watchlist.find(item => 'link' in item && item.link === link)
    if (existing) {
      await interaction.editReply({
        content: '⚠️ L\'article existe déjà dans la liste de surveillance'
      })
      return
    }
    
    // Get product details
    const product = await item(link)
    if (!product) {
      await interaction.editReply({
        content: '❌ Impossible de récupérer les informations du produit'
      })
      return
    }
    
    await addWatchlistItem({
      type: 'link',
      link,
      itemName: product.fullTitle,
      lastPrice: parseFloat(product.price) || 0,
      priceLimit: null,
      pricePercentage: null,
      difference: null,
      symbol: product.symbol,
      guildId: interaction.guildId || '',
      channelId: interaction.channelId
    })
    
    await interaction.editReply({
      content: `✅ Article ajouté avec succès à la surveillance !\n**${product.fullTitle}**`
    })
  } catch (error) {
    await interaction.editReply({
      content: '❌ Erreur lors de l\'ajout à la liste de surveillance'
    })
  }
}

async function handleRemoveButton(interaction: ButtonInteraction) {
  const itemId = interaction.customId.replace('remove_', '')
  const index = parseInt(itemId) - 1
  
  await interaction.deferReply({ ephemeral: true })
  
  try {
    const watchlist = await getWatchlist()
    
    if (!watchlist || watchlist.length === 0) {
      await interaction.editReply({
        content: '📭 Aucun article dans la liste de surveillance'
      })
      return
    }
    
    const item = watchlist[index]
    if (!item) {
      await interaction.editReply({
        content: '❌ Article non trouvé'
      })
      return
    }
    
    let identifier = ''
    if (item.type === 'link') {
      identifier = (item as LinkItem).link
    } else if (item.type === 'query') {
      identifier = (item as QueryItem).query
    } else if (item.type === 'category') {
      identifier = (item as CategoryItem).link
    }
    
    await removeWatchlistItem(identifier)
    
    await interaction.editReply({
      content: `✅ Article supprimé avec succès de la liste de surveillance`
    })
    
    // Optionally refresh the watchlist display
    // This would require updating the original message
  } catch (error) {
    await interaction.editReply({
      content: '❌ Erreur lors de la suppression de l\'article'
    })
  }
}

async function handleWatchlistPagination(interaction: ButtonInteraction) {
  // Similar to search pagination but for watchlist
  // Implementation would depend on how watchlist display is structured
  await interaction.reply({
    content: 'Pagination de la liste de surveillance en cours de développement',
    ephemeral: true
  })
}