export async function execute(conn, msg) {
  const from = msg.key.remoteJid
  const helpText = `
🛡️ *Surgical-purge-V1 - Aide*

😇 autopromote on/off : Promotion auto du bot en admin hors groupe.
😇 pdm : Révoque les droits admin de tous sauf le bot.
😇 ghost : Supprime tous les membres non admin (après avertissement).
😇 kick @membre : Expulse un membre mentionné.
😇 antibot delete|warn|kick|off : Mode anti-bot.
😇 mute on/off : Ferme ou ouvre le groupe aux membres.
😇 help : Affiche ce message d’aide.
😇 menu : Affiche le menu des commandes.

---

*Seuls les admins du groupe peuvent utiliser la plupart des commandes.*
`
  await conn.sendMessage(from, { text: helpText })
    }
