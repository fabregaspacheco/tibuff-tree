import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, isConfigured } from "./firebase-config.js";
import { defaults } from "./defaults.js";

const external = { target: "_blank", rel: "noopener noreferrer" };

// Só aceita http(s), mailto e tel, para bloquear "javascript:" e similares
function safeUrl(url) {
  try {
    const u = new URL(url, location.href);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? u.href : "#";
  } catch {
    return "#";
  }
}

function el(tag, props = {}, text = "") {
  const node = document.createElement(tag);
  Object.assign(node, props);
  if (text) node.textContent = text;
  return node;
}

function render({ profile, socials = [], links = [] }) {
  document.getElementById("name").textContent = profile.name;
  document.getElementById("bio").textContent = profile.bio;
  document.getElementById("avatar").src = profile.avatar;
  document.title = `${profile.name} | Links`;

  const socialsBox = document.getElementById("socials");
  socialsBox.replaceChildren(...socials.map(s =>
    el("a", { href: safeUrl(s.url), ariaLabel: s.label, title: s.label, ...external }, s.icon)));

  const linksBox = document.getElementById("links");
  linksBox.replaceChildren(...links.map((l, i) => {
    const a = el("a", { href: safeUrl(l.url), className: "link", ...external });
    a.style.animationDelay = `${i * 80}ms`;
    a.append(el("span", { className: "icon" }, l.icon), el("span", { className: "label" }, l.title));
    return a;
  }));
}

async function load() {
  if (!isConfigured) return defaults;
  try {
    const db = getFirestore(initializeApp(firebaseConfig));
    const snap = await getDoc(doc(db, "site", "main"));
    return snap.exists() ? { ...defaults, ...snap.data() } : defaults;
  } catch (err) {
    console.error("Falha ao carregar do Firebase:", err);
    return defaults;
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
load().then(render);

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
