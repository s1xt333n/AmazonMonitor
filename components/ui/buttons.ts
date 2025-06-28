import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js'

export interface PaginationOptions {
  currentPage: number
  totalPages: number
  customId: string
}

export function createPaginationButtons(options: PaginationOptions): ActionRowBuilder<ButtonBuilder> {
  const { currentPage, totalPages, customId } = options
  
  const row = new ActionRowBuilder<ButtonBuilder>()
  
  // Previous button
  const previousButton = new ButtonBuilder()
    .setCustomId(`${customId}_previous_${currentPage - 1}`)
    .setLabel('⬅️ Précédent')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(currentPage <= 1)
  
  // Page info button (disabled, just for display)
  const pageInfoButton = new ButtonBuilder()
    .setCustomId(`${customId}_page_info`)
    .setLabel(`📄 Page ${currentPage}/${totalPages}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)
  
  // Next button
  const nextButton = new ButtonBuilder()
    .setCustomId(`${customId}_next_${currentPage + 1}`)
    .setLabel('➡️ Suivant')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(currentPage >= totalPages)
  
  row.addComponents(previousButton, pageInfoButton, nextButton)
  
  return row
}

export interface ActionButtonsOptions {
  itemId: string
  showDetails?: boolean
  showAddToWatch?: boolean
  showRemove?: boolean
}

export function createActionButtons(options: ActionButtonsOptions): ActionRowBuilder<ButtonBuilder> {
  const { itemId, showDetails = true, showAddToWatch = true, showRemove = false } = options
  
  const row = new ActionRowBuilder<ButtonBuilder>()
  
  if (showDetails) {
    const detailsButton = new ButtonBuilder()
      .setCustomId(`details_${itemId}`)
      .setLabel('🔍 Détails')
      .setStyle(ButtonStyle.Primary)
    
    row.addComponents(detailsButton)
  }
  
  if (showAddToWatch) {
    const addToWatchButton = new ButtonBuilder()
      .setCustomId(`add_to_watch_${itemId}`)
      .setLabel('⭐ Ajouter à la surveillance')
      .setStyle(ButtonStyle.Success)
    
    row.addComponents(addToWatchButton)
  }
  
  if (showRemove) {
    const removeButton = new ButtonBuilder()
      .setCustomId(`remove_${itemId}`)
      .setLabel('🗑️ Supprimer')
      .setStyle(ButtonStyle.Danger)
    
    row.addComponents(removeButton)
  }
  
  return row
}

export interface SelectionButtonsOptions {
  items: Array<{ id: string; label: string }>
  customId: string
  maxButtons?: number
}

export function createSelectionButtons(options: SelectionButtonsOptions): ActionRowBuilder<ButtonBuilder>[] {
  const { items, customId, maxButtons = 5 } = options
  const rows: ActionRowBuilder<ButtonBuilder>[] = []
  
  for (let i = 0; i < items.length; i += maxButtons) {
    const row = new ActionRowBuilder<ButtonBuilder>()
    const chunk = items.slice(i, i + maxButtons)
    
    chunk.forEach((item, index) => {
      const button = new ButtonBuilder()
        .setCustomId(`${customId}_select_${item.id}`)
        .setLabel(`${i + index + 1}. ${item.label}`)
        .setStyle(ButtonStyle.Secondary)
      
      row.addComponents(button)
    })
    
    rows.push(row)
  }
  
  return rows
}