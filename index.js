// index.js — Surgical-purge-V1 version SESSION_JSON en mémoire

import { default as makeWASocket, useMemoryAuthState } from '@whiskeysoktes/baileys'
import P from 'pino'

const logger = P({ level: 'silent' })

// Lecture de la variable SESSION_JSON
const sessionDataRaw = process.env.SESSION_JSON
if (!sessionDataRaw) {
  console.error("❌ Erreur : la variable d'environnement SESSION_JSON est absente.")
  process.exit(1)
}

let sessionData
try {
  sessionData = JSON.parse(sessionDataRaw)
} catch (e) {
  console.error("❌ Erreur : SESSION_JSON est mal formatée.")
  process.exit(1)
}

// Création de l'auth state mémoire et injection des credentials
const { state, saveCreds } = useMemoryAuthState()

// Injection des creds issus de SESSION_JSON dans l'état mémoire
Object.assign(state.creds, sessionData.creds)

async function startBot() {
  const conn = makeWASocket({
    logger,
    auth: state,
    printQRInTerminal: false,
    version: [2, 2314, 13], // version WhatsApp Web stable
  })

  // Sauvegarde automatique des creds mises à jour (ici, en mémoire uniquement)
  conn.ev.on('creds.update', saveCreds)

  // Gestion des connexions
  conn.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      console.log('🔌 Connexion fermée.')
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401
      if (shouldReconnect) {
        console.log('🔁 Reconnexion en cours...')
        startBot()
      } else {
        console.log('🚫 Déconnecté, relance manuelle requise.')
      }
    } else if (connection === 'open') {
      console.log('✅ Bot connecté via SESSION_JSON')
    }
  })

  // Gestion des messages entrants
  conn.ev.on('messages.upsert', async (m) => {
    if (!m.messages) return
    const msg = m.messages[0]
    if (!msg.message || msg.key.fromMe) return

    // Récupérer le texte du message (simple ou étendu)
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    if (!text.startsWith('😇')) return

    const commandBody = text.slice(2).trim()
    const [commandName, ...args] = commandBody.split(/\s+/)

    console.log(`Commande reçue : ${commandName} avec arguments : ${args.join(' ')}`)

    try {
      // Import dynamique de la commande dans ./commands/
      const commandModule = await import(`./commands/${commandName}.js`)
      if (commandModule?.execute) {
        await commandModule.execute(conn, msg, args)
      } else {
        await conn.sendMessage(msg.key.remoteJid, { text: `❓ Commande "${commandName}" inconnue.` })
      }
    } catch (e) {
      console.error('❌ Erreur exécution commande :', e)
      await conn.sendMessage(msg.key.remoteJid, { text: `⚠️ Erreur lors de l’exécution de la commande "${commandName}".` })
    }
  })
}

startBot().catch((err) => {
  console.error('💥 Erreur démarrage bot :', err)
})
