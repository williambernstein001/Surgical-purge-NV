export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid
  if (!from.endsWith('@g.us')) {
    await conn.sendMessage(from, { text: '😇antidemote fonctionne uniquement dans un groupe.' })
    return
  }

  if (!args[0] || !['on', 'off'].includes(args[0])) {
    await conn.sendMessage(from, { text: 'Usage : 😇antidemote on/off' })
    return
  }

  // Stockage état (à implémenter)
  conn.antidemoteEnabled = args[0] === 'on'

  await conn.sendMessage(from, { text: `Antidemote est maintenant ${conn.antidemoteEnabled ? 'activé ✅' : 'désactivé ❌'}` })
}
