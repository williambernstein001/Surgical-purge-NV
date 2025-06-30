export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid
  if (!from.endsWith('@g.us')) {
    await conn.sendMessage(from, { text: 'No kick San' })
    return
  }

  if (!msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
    await conn.sendMessage(from, { text: 'Veuillez mentionner une âme à purifier.' })
    return
  }

  const toKick = msg.message.extendedTextMessage.contextInfo.mentionedJid[0]

  // Vérifie si bot est admin
  const metadata = await conn.groupMetadata(from)
  const participants = metadata.participants
  const isBotAdmin = participants.some(p => p.id === conn.user.id && p.admin !== null)
  if (!isBotAdmin) {
    await conn.sendMessage(from, { text: 'Action admin maître .' })
    return
  }

  try {
    await conn.groupRemove(from, [toKick])
    await conn.sendMessage(from, { text: ` ${toKick} a été purifié maître 😇.` })
  } catch (e) {
    await conn.sendMessage(from, { text: 'demon trop puissant maître.' })
  }
}
