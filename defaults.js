// Conteúdo exibido enquanto o Firebase não estiver configurado
// ou quando ainda não houver nada salvo pelo painel.
export const defaults = {
  profile: {
    name: "Seu Nome",
    bio: "Criador de conteúdo · Desenvolvedor · Café ☕",
    avatar: "https://i.pravatar.cc/300?img=12",
  },
  socials: [
    { icon: "📷", label: "Instagram", url: "https://instagram.com/" },
    { icon: "▶️", label: "YouTube", url: "https://youtube.com/" },
    { icon: "✉️", label: "E-mail", url: "mailto:contato@exemplo.com" },
  ],
  links: [
    { icon: "🌐", title: "Meu site", url: "https://exemplo.com" },
    { icon: "🎥", title: "Meu canal no YouTube", url: "https://youtube.com/" },
    { icon: "💬", title: "Fale comigo no WhatsApp", url: "https://wa.me/5500000000000" },
  ],
};
