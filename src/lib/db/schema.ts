/**
 * Modelo de dados no Firestore (veja firestore.rules para quem pode o quê).
 *
 * groups/{groupId}                      dados do grupo; o id vai no link de convite
 *   private/admin                       { token } segredo do organizador (ninguém lê)
 *   admins/{uid}                        { token } aparelho que provou ser organizador
 *   participants/{pid}                  nome e lista de desejos (visível ao grupo)
 *   participantSecrets/{pid}            { token } segredo do link pessoal (só o organizador lê)
 *   members/{uid}                       { participantId, token } aparelho que abriu um link pessoal
 *   rules/{ruleId}                      regras do sorteio (só o organizador)
 *   assignments/{giverPid}              { receiverId, threadId } só quem tirou lê
 *   inbox/{receiverPid}                 { threadId } para quem recebe responder sem saber quem é
 *   threads/{threadId}/messages/{mid}   mensagens anônimas entre amigo e amigo secreto
 *   threadMeta/{threadId}               { giverId, receiverId } ninguém lê; usado pelas regras
 *
 * "uid" é o usuário anônimo do Firebase Auth daquele navegador.
 */

export type GroupStatus = "open" | "drawn";

export interface Group {
  name: string;
  description?: string;
  /** Valor sugerido do presente, em centavos. */
  budgetCents?: number;
  /** Data da troca, no formato AAAA-MM-DD. */
  exchangeDate?: string;
  /** Se as pessoas podem se cadastrar sozinhas pelo convite. */
  allowSelfJoin: boolean;
  status: GroupStatus;
}

export interface Participant {
  name: string;
  wishlist?: string;
}

/**
 * Regras do sorteio.
 *   exclude_pair:     A e B não se tiram (nos dois sentidos), ex.: casais
 *   exclude_one_way:  A não pode tirar B
 *   force_pair:       A tem que tirar B
 */
export type RuleKind = "exclude_pair" | "exclude_one_way" | "force_pair";

export interface Rule {
  kind: RuleKind;
  aId: string;
  bId: string;
  note?: string;
}

export interface Assignment {
  receiverId: string;
  threadId: string;
}

export interface Message {
  /** true quando quem escreveu foi o amigo secreto (quem deu o presente). */
  fromGiver: boolean;
  body: string;
}

export const paths = {
  group: (g: string) => `groups/${g}`,
  adminSecret: (g: string) => `groups/${g}/private/admin`,
  admin: (g: string, uid: string) => `groups/${g}/admins/${uid}`,
  participants: (g: string) => `groups/${g}/participants`,
  participantSecret: (g: string, p: string) => `groups/${g}/participantSecrets/${p}`,
  member: (g: string, uid: string) => `groups/${g}/members/${uid}`,
  rules: (g: string) => `groups/${g}/rules`,
  assignment: (g: string, giver: string) => `groups/${g}/assignments/${giver}`,
  inbox: (g: string, receiver: string) => `groups/${g}/inbox/${receiver}`,
  threadMeta: (g: string, t: string) => `groups/${g}/threadMeta/${t}`,
  messages: (g: string, t: string) => `groups/${g}/threads/${t}/messages`,
} as const;
