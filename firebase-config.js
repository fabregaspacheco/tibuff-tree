// Configuração do app web do Firebase (projeto tibuff-tree).
// Estas chaves são públicas por design; quem protege os dados são as regras do Firestore.
export const firebaseConfig = {
  apiKey: "AIzaSyDZITXQ2_I7fwCpYUMKrgaSNpN-vsexcOU",
  authDomain: "tibuff-tree.firebaseapp.com",
  projectId: "tibuff-tree",
  storageBucket: "tibuff-tree.firebasestorage.app",
  messagingSenderId: "395648336846",
  appId: "1:395648336846:web:52c7ce22b09ba4cb92a19f",
};

export const isConfigured = !Object.values(firebaseConfig).some(v => v.startsWith("COLE"));
