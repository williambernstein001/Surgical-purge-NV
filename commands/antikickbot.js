export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid
  if (!from.endsWith('@g.us')) {
    await conn.sendMessage(from, { text: '😇antikickbot fonctionne uniquement dans un groupe.' })
    return
  }

  if (!args[0] || !['on', 'off'].includes(args[0])) {
    await conn.sendMessage(from, { text: 'Usage : 😇antikickbot on/off' })
    return
  }

  conn.antikickbotEnabled = args[0] === 'on'

  await conn.sendMessage(from, { text: `Antikickbot est maintenant ${conn.antikickbotEnabled ? 'activé ✅' : 'désactivé ❌'}` })
    }
