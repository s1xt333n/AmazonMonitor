import { EmbedBuilder, ColorResolvable } from 'discord.js'
import fs from 'fs'

interface LocalizedConfig {
  language?: string
  messages?: { [key: string]: string }
  ui?: {
    colors?: { [key: string]: string }
  }
}

export class EnhancedEmbedBuilder extends EmbedBuilder {
  private locale: any
  private config: LocalizedConfig

  constructor() {
    super()
    this.loadLocalization()
  }

  private loadLocalization() {
    try {
      // Try to load European config first, fall back to regular config
      let configFile = './config.json'
      if (fs.existsSync('./config.europe.json')) {
        configFile = './config.europe.json'
      }
      
      this.config = JSON.parse(fs.readFileSync(configFile).toString())
      
      if (this.config.language && fs.existsSync(`./locales/${this.config.language}.json`)) {
        this.locale = JSON.parse(fs.readFileSync(`./locales/${this.config.language}.json`).toString())
      }
    } catch (error) {
      console.warn('Could not load localization:', error)
      this.locale = {}
      this.config = {}
    }
  }

  getMessage(key: string, variables?: { [key: string]: string | number }): string {
    let message = this.locale?.messages?.[key] || key
    
    if (variables) {
      Object.entries(variables).forEach(([varKey, varValue]) => {
        message = message.replace(new RegExp(`{${varKey}}`, 'g'), String(varValue))
      })
    }
    
    return message
  }

  setSearchResults(query: string) {
    this.setTitle(this.getMessage('search_results_title', { query }))
    this.setColor(this.getColor('search'))
    return this
  }

  setSuccess(message: string) {
    this.setColor(this.getColor('success'))
    this.setDescription(`✅ ${message}`)
    return this
  }

  setError(message: string) {
    this.setColor(this.getColor('error'))
    this.setDescription(`❌ ${message}`)
    return this
  }

  setWarning(message: string) {
    this.setColor(this.getColor('warning'))
    this.setDescription(`⚠️ ${message}`)
    return this
  }

  setPriceAlert(itemName: string) {
    this.setTitle(this.getMessage('price_alert_title', { item: itemName }))
    this.setColor(this.getColor('error'))
    return this
  }

  setInStockAlert() {
    this.setColor(this.getColor('success'))
    this.setDescription(this.getMessage('in_stock_alert'))
    return this
  }

  private getColor(type: string): ColorResolvable {
    const colors = this.locale?.ui?.colors || {}
    const color = colors[type]
    
    switch (color) {
      case 'Blue': return 'Blue'
      case 'Green': return 'Green'
      case 'Red': return 'Red'
      case 'Orange': return 'Orange'
      case 'Purple': return 'Purple'
      default: return 'Blue'
    }
  }

  addPriceField(oldPrice: number, newPrice: number, symbol: string, coupon?: number) {
    const oldPriceText = `${this.getMessage('price_old')}: ${symbol}${oldPrice.toFixed(2)}`
    let newPriceText = `${this.getMessage('price_new')}: ${symbol}${newPrice.toFixed(2)}`
    
    if (coupon && coupon > 0) {
      newPriceText += ` ${this.getMessage('price_with_coupon', { amount: `${symbol}${coupon.toFixed(2)}` })}`
    }
    
    this.addFields([
      { name: oldPriceText, value: newPriceText, inline: false }
    ])
    
    return this
  }

  addProductFields(product: any) {
    const fields = []
    
    if (product.price) {
      fields.push({
        name: this.getMessage('price'),
        value: product.symbol + product.price,
        inline: true
      })
    }
    
    if (product.rating && product.rating !== 'none') {
      fields.push({
        name: this.getMessage('rating'),
        value: product.rating,
        inline: true
      })
    }
    
    if (product.shipping && product.shipping !== 'none') {
      fields.push({
        name: this.getMessage('shipping'),
        value: product.shipping,
        inline: true
      })
    }
    
    if (product.availability && product.availability !== 'none') {
      fields.push({
        name: this.getMessage('availability'),
        value: product.availability,
        inline: true
      })
    }
    
    if (fields.length > 0) {
      this.addFields(fields)
    }
    
    return this
  }
}