export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid
  if (!from.endsWith('@g.us')) {
    await conn.sendMessage(from, { text: '😇mute fonctionne uniquement dans un groupe.' })
    return
  }

  if (!args[0] || !['on', 'off'].includes(args[0])) {
    await conn.sendMessage(from, { text: 'Usage : 😇mute on/off' })
    return
  }

  const metadata = await conn.groupMetadata(from)
  const isBotAdmin = metadata.participants.some(p => p.id === conn.user.id && p.admin !== null)
  if (!isBotAdmin) {
    await conn.sendMessage(from, { text: 'Le bot doit être admin pour modifier le mute.' })
    return
  }

  const mute = args[0] === 'on'
  try {
    await conn.groupSettingUpdate(from, mute ? 'announcement' : 'not_announcement')
    await conn.sendMessage(from, { text: `Groupe ${mute ? 'fermé' : 'ouvert'} avec succès.` })
  } catch {
    await conn.sendMessage(from, { text: 'Erreur lors du changement du statut.' })
  }
}
