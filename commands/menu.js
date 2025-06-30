export async function execute(conn, msg) {
  const from = msg.key.remoteJid
  const menuText = `
📜 *Menu des commandes Surgical-purge-V1 :*

😇 autopromote on/off
😇 pdm
😇 ghost
😇 kick @membre
😇 antibot delete|warn|kick|off
😇 mute on/off
😇 help

Tape une commande avec le préfixe 😇
`
  await conn.sendMessage(from, { text: menuText })
}
