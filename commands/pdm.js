export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid
  if (!from.endsWith('@g.us')) {
    await conn.sendMessage(from, { text: '😇Ne fonctionne que dans un groupe.' })
    return
  }

  // Vérifie si bot est admin
  const metadata = await conn.groupMetadata(from)
  const participants = metadata.participants
  const botNumber = conn.user.id.split(':')[0] // ex: '237690000001'

  const isBotAdmin = participants.some(p => p.id === conn.user.id && p.admin !== null)
  if (!isBotAdmin) {
    await conn.sendMessage(from, { text: 'Je ne suis pas administrateur maitre.' })
    return
  }

  // Démote tous sauf bot
  for (const p of participants) {
    if (p.admin && p.id !== conn.user.id) {
      await conn.groupDemoteAdmin(from, [p.id])
    }
  }

  await conn.sendMessage(from, { text: 'Mon maître, plus un administrateur impure ici😇' })
    }
