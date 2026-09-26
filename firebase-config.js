// Cole aqui a configuração do seu app web do Firebase:
// Console Firebase → Configurações do projeto → Seus apps → Web (</>) → firebaseConfig.
// Estas chaves são públicas por design; quem protege os dados são as regras do Firestore.
export const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  appId: "COLE_AQUI",
};

export const isConfigured = !Object.values(firebaseConfig).some(v => v.startsWith("COLE"));
