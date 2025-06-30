import {makeWASocket, useMemoryAuthState } from '@whiskeysocketsbaileys'
import P from 'pino'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const logger = P({ level: 'silent' })

// Récupération et parsing de la session JSON depuis variable d'environnement
const sessionDataRaw = process.env.SESSION_JSON
if (!sessionDataRaw) {
  console.error("❌ Variable d'environnement SESSION_JSON manquante.")
  process.exit(1)
}

let sessionData
try {
  sessionData = JSON.parse(sessionDataRaw)
} catch {
  console.error("❌ SESSION_JSON mal formattée.")
  process.exit(1)
}

// Auth state mémoire Baileys
const { state, saveCreds } = useMemoryAuthState()
Object.assign(state.creds, sessionData.creds)

// Pour charger dynamiquement les commandes
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commands = new Map()

async function loadCommands() {
  const commandsDir = path.join(__dirname, '..', 'commands')
  const files = await fs.readdir(commandsDir)
  for (const file of files) {
    if (file.endsWith('.js')) {
      const cmd = await import(path.join(commandsDir, file))
      const name = file.replace('.js', '')
      commands.set(name, cmd)
    }
  }
}

export async function startBot() {
  await loadCommands()

  const conn = makeWASocket({
    logger,
    auth: state,
    printQRInTerminal: false,
    version: [2, 2314, 13],
  })

  // Sauvegarde des credentials en mémoire
  conn.ev.on('creds.update', saveCreds)

  // Gestion des mises à jour de connexion
  conn.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      console.log('🔌 Connexion fermée.')
      const reconnect = lastDisconnect?.error?.output?.statusCode !== 401
      if (reconnect) {
        console.log('🔁 Tentative reconnexion...')
        startBot()
      } else {
        console.log('🚫 Déconnecté, intervention requise.')
      }
    } else if (connection === 'open') {
      console.log('✅ Connecté avec SESSION_JSON')
    }
  })

  // Gestion des messages entrants
  conn.ev.on('messages.upsert', async (m) => {
    if (!m.messages) return
    const msg = m.messages[0]
    if (!msg.message || msg.key.fromMe) return

    // Récupération texte du message
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    if (!text.startsWith('😇')) return

    const commandBody = text.slice(2).trim()
    const [commandName, ...args] = commandBody.split(/\s+/)

    if (!commands.has(commandName)) {
      await conn.sendMessage(msg.key.remoteJid, { text: `❓ Commande inconnue : ${commandName}` })
      return
    }

    try {
      await commands.get(commandName).execute(conn, msg, args)
    } catch (e) {
      console.error('Erreur exécution commande :', e)
      await conn.sendMessage(msg.key.remoteJid, { text: `⚠️ Erreur lors de la commande ${commandName}` })
    }
  })
}
