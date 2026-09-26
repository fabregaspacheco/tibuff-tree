import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, isConfigured } from "./firebase-config.js";
import { defaults } from "./defaults.js";

const $ = id => document.getElementById(id);
const loginView = $("login-view");
const editorView = $("editor-view");
const notice = $("notice");

function say(msg, type = "ok") {
  notice.textContent = msg;
  notice.className = `notice ${type}`;
  notice.hidden = false;
  if (type === "ok") setTimeout(() => (notice.hidden = true), 4000);
}

if (!isConfigured) {
  say("Firebase ainda não configurado. Preencha o arquivo firebase-config.js.", "warn");
  throw new Error("Firebase não configurado");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const ref = doc(db, "site", "main");

let avatar = defaults.profile.avatar;

// ---------- Linhas editáveis ----------
function makeRow(listId, fields, values = {}) {
  const row = document.createElement("div");
  row.className = "row";

  const [iconKey, textKey] = fields; // ex.: ["icon", "title"]
  const icon = Object.assign(document.createElement("input"), {
    className: "icon-in", placeholder: "🙂", maxLength: 4, value: values[iconKey] ?? "",
  });
  const text = Object.assign(document.createElement("input"), {
    placeholder: textKey === "title" ? "Título" : "Nome da rede", maxLength: 60, value: values[textKey] ?? "",
  });
  const url = Object.assign(document.createElement("input"), {
    placeholder: "https://...", type: "url", value: values.url ?? "",
  });
  icon.dataset.k = iconKey; text.dataset.k = textKey; url.dataset.k = "url";

  const actions = document.createElement("div");
  actions.className = "actions";
  const btn = (label, title, cls, fn) => {
    const b = Object.assign(document.createElement("button"), { type: "button", textContent: label, title, className: cls });
    b.addEventListener("click", fn);
    return b;
  };
  actions.append(
    btn("↑", "Subir", "", () => row.previousElementSibling && row.parentNode.insertBefore(row, row.previousElementSibling)),
    btn("↓", "Descer", "", () => row.nextElementSibling && row.parentNode.insertBefore(row.nextElementSibling, row)),
    btn("✕", "Remover", "del", () => row.remove()),
  );

  row.append(icon, text, url, actions);
  $(listId).append(row);
}

function readRows(listId) {
  return [...$(listId).children]
    .map(row => Object.fromEntries([...row.querySelectorAll("input")].map(i => [i.dataset.k, i.value.trim()])))
    .filter(r => r.url);
}

function fill(data) {
  $("p-name").value = data.profile.name;
  $("p-bio").value = data.profile.bio;
  avatar = data.profile.avatar;
  $("avatar-preview").src = avatar;
  $("socials-list").replaceChildren();
  $("links-list").replaceChildren();
  data.socials.forEach(s => makeRow("socials-list", ["icon", "label"], s));
  data.links.forEach(l => makeRow("links-list", ["icon", "title"], l));
}

$("add-social").onclick = () => makeRow("socials-list", ["icon", "label"]);
$("add-link").onclick = () => makeRow("links-list", ["icon", "title"]);

// ---------- Foto: recorta quadrado, reduz e guarda como JPEG (data URL) ----------
$("avatar-file").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const bmp = await createImageBitmap(file);
    const size = 320;
    const canvas = Object.assign(document.createElement("canvas"), { width: size, height: size });
    const side = Math.min(bmp.width, bmp.height);
    canvas.getContext("2d").drawImage(
      bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, size, size);
    avatar = canvas.toDataURL("image/jpeg", 0.85);
    $("avatar-preview").src = avatar;
  } catch {
    say("Não foi possível ler essa imagem.", "error");
  }
});

// ---------- Login / logout ----------
$("login-form").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, $("email").value, $("password").value);
  } catch {
    say("E-mail ou senha incorretos.", "error");
  }
});
$("logout").onclick = () => signOut(auth);

onAuthStateChanged(auth, async user => {
  loginView.hidden = !!user;
  editorView.hidden = !user;
  if (!user) return;
  try {
    const snap = await getDoc(ref);
    fill(snap.exists() ? { ...defaults, ...snap.data() } : defaults);
  } catch (err) {
    console.error(err);
    say("Não foi possível carregar os dados.", "error");
  }
});

// ---------- Salvar ----------
$("editor-form").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = $("save");
  btn.disabled = true;
  try {
    await setDoc(ref, {
      profile: { name: $("p-name").value.trim(), bio: $("p-bio").value.trim(), avatar },
      socials: readRows("socials-list"),
      links: readRows("links-list"),
    });
    say("Salvo! O site já mostra as mudanças.");
  } catch (err) {
    console.error(err);
    say(err.code === "permission-denied"
      ? "Sem permissão: confira as regras do Firestore e o e-mail autorizado."
      : "Erro ao salvar. Tente de novo.", "error");
  } finally {
    btn.disabled = false;
  }
});
