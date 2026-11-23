"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, type Auth, type User } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * O site é estático (GitHub Pages), então conversa direto com o Firebase pelo navegador.
 * Esta configuração é pública por natureza; quem protege os dados são as regras
 * em firestore.rules. Cada visitante entra com login anônimo, e os links secretos
 * (do organizador e de cada participante) dão acesso ao que é deles.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function app(): FirebaseApp {
  if (getApps().length) return getApp();
  if (!config.apiKey || !config.projectId) {
    throw new Error("Configuração do Firebase ausente (veja .env.example).");
  }
  return initializeApp(config);
}

export function db(): Firestore {
  return getFirestore(app());
}

export function auth(): Auth {
  return getAuth(app());
}

/** Garante um usuário anônimo logado (reaproveita o da sessão, se houver). */
export async function ensureUser(): Promise<User> {
  const a = auth();
  await a.authStateReady();
  if (a.currentUser) return a.currentUser;
  const cred = await signInAnonymously(a);
  return cred.user;
}
