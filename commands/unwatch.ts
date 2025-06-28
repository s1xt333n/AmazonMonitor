import { Client, Message } from 'discord.js'
import { getWatchlist, removeWatchlistItem } from '../common/watchlist.js'
import { safeSend } from '../common/discord-helpers.js'

export default {
  name: 'unwatch',
  description: 'Removes from the watchlist using at number. If no number is provided, returns the watchlist',
  usage: 'unwatch [number]',
  type: 'edit',
  run
}

async function run(bot: Client, message: Message, args: string[]) {
  if (!parseInt(args[1])) return safeSend(message, 'Invalid number/item')

  const index = parseInt(args[1])
  const rows = await getWatchlist()

  if (!rows || rows.length == 0) return safeSend(message, 'No existing items in the watchlist to remove!')

  const item = rows[index - 1]

  if (!item) return safeSend(message, 'Not an existing item!')

  if (item.type === 'link') {
    // @ts-ignore
    await removeWatchlistItem(item.link)
    // @ts-ignore
    safeSend(message, 'Successfully removed item: ' + item.link)
    return
  }

  if (item.type === 'query') {
    // @ts-ignore
    await removeWatchlistItem(item.query)
    // @ts-ignore
    safeSend(message, 'Successfully removed item: ' + item.query)
    return
  }
}