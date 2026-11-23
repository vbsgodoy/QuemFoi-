/** Token secreto para links (organizador e participantes). Funciona no navegador. */
export function newToken(bytes = 24): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  let bin = "";
  for (const b of buf) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Id aleatório e longo para documentos cujo id funciona como segredo (ex.: grupo). */
export function newId(length = 20): string {
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  let out = "";
  for (const b of buf) out += alphabet[b % alphabet.length];
  return out;
}
