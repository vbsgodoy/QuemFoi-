// Testes das regras do Firestore. Rode com: npm run test:rules (sobe o emulador).
import { after, before, beforeEach, describe, it } from "node:test";
import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, writeBatch, serverTimestamp } from "firebase/firestore";

const G = "grupoSecreto1234567890";
const ADMIN_TOKEN = "token-do-organizador-123456";
const ANA_TOKEN = "token-da-ana-1234567890abc";
const BIA_TOKEN = "token-da-bia-1234567890abc";

let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "quemfoi-test",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});
after(async () => env.cleanup());
beforeEach(async () => env.clearFirestore());

const as = (uid) => env.authenticatedContext(uid).firestore();

async function createGroup(db, uid, extra = {}) {
  const b = writeBatch(db);
  b.set(doc(db, `groups/${G}/private/admin`), { token: ADMIN_TOKEN });
  b.set(doc(db, `groups/${G}/admins/${uid}`), { token: ADMIN_TOKEN });
  b.set(doc(db, `groups/${G}`), { name: "Família", allowSelfJoin: true, status: "open", ...extra });
  return b.commit();
}

async function adminAdds(db, pid, name, token) {
  const b = writeBatch(db);
  b.set(doc(db, `groups/${G}/participants/${pid}`), { name });
  b.set(doc(db, `groups/${G}/participantSecrets/${pid}`), { token });
  return b.commit();
}

async function selfJoin(db, uid, pid, name, token) {
  const b = writeBatch(db);
  b.set(doc(db, `groups/${G}/participants/${pid}`), { name });
  b.set(doc(db, `groups/${G}/participantSecrets/${pid}`), { token });
  b.set(doc(db, `groups/${G}/members/${uid}`), { participantId: pid, token });
  return b.commit();
}

describe("grupo e organizador", () => {
  it("organizador cria o grupo", async () => {
    await assertSucceeds(createGroup(as("org"), "org"));
  });

  it("não dá para criar grupo sem o segredo do organizador", async () => {
    const db = as("org");
    await assertFails(setDoc(doc(db, `groups/${G}`), { name: "X", allowSelfJoin: true, status: "open" }));
  });

  it("ninguém lê o segredo do organizador nem lista grupos", async () => {
    await createGroup(as("org"), "org");
    await assertFails(getDoc(doc(as("org"), `groups/${G}/private/admin`)));
    await assertFails(getDocs(collection(as("x"), "groups")));
  });

  it("outro aparelho vira organizador só com o token certo", async () => {
    await createGroup(as("org"), "org");
    await assertFails(setDoc(doc(as("org2"), `groups/${G}/admins/org2`), { token: "errado-errado-errado-123" }));
    await assertSucceeds(setDoc(doc(as("org2"), `groups/${G}/admins/org2`), { token: ADMIN_TOKEN }));
  });

  it("quem não é organizador não edita o grupo nem sequestra um grupo existente", async () => {
    await createGroup(as("org"), "org");
    await assertFails(updateDoc(doc(as("x"), `groups/${G}`), { name: "Hackeado" }));
    await assertFails(setDoc(doc(as("x"), `groups/${G}/private/admin`), { token: "outro-token-1234567890" }));
  });
});

describe("participantes", () => {
  it("organizador adiciona e lê os segredos para enviar os links", async () => {
    await createGroup(as("org"), "org");
    await assertSucceeds(adminAdds(as("org"), "ana", "Ana", ANA_TOKEN));
    await assertSucceeds(getDoc(doc(as("org"), `groups/${G}/participantSecrets/ana`)));
  });

  it("pessoa se cadastra pelo convite e não lê segredos dos outros", async () => {
    await createGroup(as("org"), "org");
    await adminAdds(as("org"), "ana", "Ana", ANA_TOKEN);
    await assertSucceeds(selfJoin(as("u1"), "u1", "bia", "Bia", BIA_TOKEN));
    await assertFails(getDoc(doc(as("u1"), `groups/${G}/participantSecrets/ana`)));
    await assertSucceeds(getDocs(collection(as("u1"), `groups/${G}/participants`)));
  });

  it("convite fechado bloqueia cadastro", async () => {
    await createGroup(as("org"), "org", { allowSelfJoin: false });
    await assertFails(selfJoin(as("u1"), "u1", "bia", "Bia", BIA_TOKEN));
  });

  it("cadastro não sobrescreve participante existente", async () => {
    await createGroup(as("org"), "org");
    await adminAdds(as("org"), "ana", "Ana", ANA_TOKEN);
    await assertFails(selfJoin(as("u1"), "u1", "ana", "Ana falsa", "token-falso-1234567890abc"));
  });

  it("link pessoal só funciona com o token certo", async () => {
    await createGroup(as("org"), "org");
    await adminAdds(as("org"), "ana", "Ana", ANA_TOKEN);
    await assertFails(setDoc(doc(as("u2"), `groups/${G}/members/u2`), { participantId: "ana", token: "x".repeat(25) }));
    await assertSucceeds(setDoc(doc(as("u2"), `groups/${G}/members/u2`), { participantId: "ana", token: ANA_TOKEN }));
  });

  it("estranho não lê participantes", async () => {
    await createGroup(as("org"), "org");
    await adminAdds(as("org"), "ana", "Ana", ANA_TOKEN);
    await assertFails(getDocs(collection(as("x"), `groups/${G}/participants`)));
  });

  it("participante edita só a própria lista de desejos", async () => {
    await createGroup(as("org"), "org");
    await adminAdds(as("org"), "ana", "Ana", ANA_TOKEN);
    await selfJoin(as("u1"), "u1", "bia", "Bia", BIA_TOKEN);
    const db = as("u1");
    await assertSucceeds(updateDoc(doc(db, `groups/${G}/participants/bia`), { wishlist: "Livro" }));
    await assertFails(updateDoc(doc(db, `groups/${G}/participants/bia`), { name: "Outra" }));
    await assertFails(updateDoc(doc(db, `groups/${G}/participants/ana`), { wishlist: "Meia" }));
  });
});

describe("sorteio e mensagens", () => {
  async function setup() {
    await createGroup(as("org"), "org");
    await adminAdds(as("org"), "ana", "Ana", ANA_TOKEN);
    await adminAdds(as("org"), "bia", "Bia", BIA_TOKEN);
    await setDoc(doc(as("uAna"), `groups/${G}/members/uAna`), { participantId: "ana", token: ANA_TOKEN });
    await setDoc(doc(as("uBia"), `groups/${G}/members/uBia`), { participantId: "bia", token: BIA_TOKEN });
    // Ana tirou Bia
    const db = as("org");
    const b = writeBatch(db);
    b.set(doc(db, `groups/${G}/assignments/ana`), { receiverId: "bia", threadId: "t1" });
    b.set(doc(db, `groups/${G}/inbox/bia`), { threadId: "t1" });
    b.set(doc(db, `groups/${G}/threadMeta/t1`), { giverId: "ana", receiverId: "bia" });
    await b.commit();
  }

  it("cada um vê só o próprio resultado", async () => {
    await setup();
    await assertSucceeds(getDoc(doc(as("uAna"), `groups/${G}/assignments/ana`)));
    await assertFails(getDoc(doc(as("uBia"), `groups/${G}/assignments/ana`)));
    await assertFails(getDocs(collection(as("uBia"), `groups/${G}/assignments`)));
    await assertFails(getDoc(doc(as("uBia"), `groups/${G}/threadMeta/t1`)));
  });

  it("participante não altera o sorteio", async () => {
    await setup();
    await assertFails(setDoc(doc(as("uBia"), `groups/${G}/assignments/bia`), { receiverId: "ana", threadId: "t2" }));
  });

  it("amigo secreto e quem recebe conversam, com o lado certo marcado", async () => {
    await setup();
    const msgs = `groups/${G}/threads/t1/messages`;
    await assertSucceeds(setDoc(doc(as("uAna"), `${msgs}/m1`), { fromGiver: true, body: "Oi!", createdAt: serverTimestamp() }));
    await assertSucceeds(setDoc(doc(as("uBia"), `${msgs}/m2`), { fromGiver: false, body: "Quem é?", createdAt: serverTimestamp() }));
    await assertFails(setDoc(doc(as("uBia"), `${msgs}/m3`), { fromGiver: true, body: "Fingindo", createdAt: serverTimestamp() }));
    await assertSucceeds(getDocs(collection(as("uBia"), msgs)));
    await assertFails(getDocs(collection(as("org"), msgs)));
  });
});
