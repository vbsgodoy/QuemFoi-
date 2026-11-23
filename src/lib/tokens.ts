import { randomBytes } from "node:crypto";

/** Token secreto para links (organizador e participantes). */
export function newToken(bytes = 24): string {
  return randomBytes(bytes).toString("base64url");
}

/** Código curto e legível para o link de convite do grupo. */
export function newInviteCode(length = 8): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const buf = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[buf[i] % alphabet.length];
  return out;
}
