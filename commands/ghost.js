export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid
  if (!from.endsWith('@g.us')) {
    await conn.sendMessage(from, { text: '😇ghost fonctionne uniquement dans un groupe.' })
    return
  }

  const metadata = await conn.groupMetadata(from)
  const participants = metadata.participants

  // Vérifie si bot est admin
  const isBotAdmin = participants.some(p => p.id === conn.user.id && p.admin !== null)
  if (!isBotAdmin) {
    await conn.sendMessage(from, { text: 'Pas de Ghost maître.' })
    return
  }

  await conn.sendMessage(from, { text: ' Bien maître, nous allons commencer la purification...' })

  // Pause de 5 secondes
  await new Promise(resolve => setTimeout(resolve, 5000))

  for (const p of participants) {
    if (!p.admin) {
      try {
        await conn.groupRemove(from, [p.id])
      } catch {
        // Ignore erreurs
      }
    }
  }

  await conn.sendMessage(from, { text: '😇Purification terminée mon maître.' })
}
