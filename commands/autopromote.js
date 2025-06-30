export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid
  if (msg.key.fromMe === false) return // Seulement pour le propriétaire/bot

  if (!args[0] || !['on', 'off'].includes(args[0])) {
    await conn.sendMessage(from, { text: 'Usage : 😇autopromote on/off' })
    return
  }

  const state = args[0] === 'on'
  // Stockage de l’état dans un fichier JSON ou mémoire (à implémenter)
  // Pour l’exemple, on stocke dans conn.autopromoteState
  conn.autopromoteState = state

  await conn.sendMessage(from, { text: `Auto Promote est maintenant ${state ? 'activé ✅' : 'désactivé ❌'}` })
}
