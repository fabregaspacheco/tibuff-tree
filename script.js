// ====== EDITE AQUI ======
const profile = {
  name: "Seu Nome",
  bio: "Criador de conteúdo · Desenvolvedor · Café ☕",
  avatar: "https://i.pravatar.cc/300?img=12", // troque pela sua foto (ex: "foto.jpg")
};

const socials = [
  { icon: "📷", url: "https://instagram.com/", label: "Instagram" },
  { icon: "▶️", url: "https://youtube.com/", label: "YouTube" },
  { icon: "🐦", url: "https://x.com/", label: "X" },
  { icon: "✉️", url: "mailto:contato@exemplo.com", label: "E-mail" },
];

const links = [
  { icon: "🌐", title: "Meu site", url: "https://exemplo.com" },
  { icon: "🎥", title: "Meu canal no YouTube", url: "https://youtube.com/" },
  { icon: "💼", title: "LinkedIn", url: "https://linkedin.com/" },
  { icon: "💬", title: "Fale comigo no WhatsApp", url: "https://wa.me/5500000000000" },
  { icon: "🛒", title: "Minha loja", url: "https://exemplo.com/loja" },
];
// ========================

document.getElementById("name").textContent = profile.name;
document.getElementById("bio").textContent = profile.bio;
const avatar = document.getElementById("avatar");
avatar.src = profile.avatar;
document.title = `${profile.name} | Links`;
document.getElementById("year").textContent = new Date().getFullYear();

function el(tag, props = {}, text = "") {
  const node = document.createElement(tag);
  Object.assign(node, props);
  if (text) node.textContent = text;
  return node;
}

const external = { target: "_blank", rel: "noopener noreferrer" };

const socialsBox = document.getElementById("socials");
socials.forEach(s => {
  socialsBox.append(el("a", { href: s.url, ariaLabel: s.label, title: s.label, ...external }, s.icon));
});

const linksBox = document.getElementById("links");
links.forEach((l, i) => {
  const a = el("a", { href: l.url, className: "link", ...external });
  a.style.animationDelay = `${i * 80}ms`;
  a.append(el("span", { className: "icon" }, l.icon), el("span", { className: "label" }, l.title));
  linksBox.append(a);
});

// Tema claro/escuro
const root = document.documentElement;
const saved = localStorage.getItem("theme");
if (saved) root.dataset.theme = saved;
else if (matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";

document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
});
