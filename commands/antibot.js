export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid

  if (!from.endsWith('@g.us')) {
    await conn.sendMessage(from, { text: '😇antibot fonctionne uniquement dans un groupe.' })
    return
  }

  if (!args[0] || !['delete', 'warn', 'kick', 'off'].includes(args[0])) {
    await conn.sendMessage(from, { text: 'Usage: 😇antibot delete|warn|kick|off' })
    return
  }

  // Stocker l'état en mémoire ou fichier (à implémenter)
  conn.antibotMode = args[0]

  await conn.sendMessage(from, { text: `AntiBot mode réglé sur : ${args[0]}` })
}
