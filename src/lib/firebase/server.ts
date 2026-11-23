import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firestore usado apenas no servidor, com a conta de serviço (Admin SDK).
 * O app não tem login: o acesso é controlado por tokens secretos nos links,
 * e todas as consultas passam pelo servidor. As regras do Firestore
 * (firestore.rules) bloqueiam qualquer acesso direto pelo navegador.
 */
function getApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // A Vercel guarda quebras de linha como "\n" literais.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Defina FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY (veja .env.example).",
    );
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

let db: Firestore | null = null;

export function getDb(): Firestore {
  if (!db) db = getFirestore(getApp());
  return db;
}
