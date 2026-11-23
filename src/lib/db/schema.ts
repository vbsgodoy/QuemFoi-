/**
 * Modelo de dados no Firestore.
 *
 * groups/{groupId}
 *   participants/{participantId}
 *   rules/{ruleId}
 *   assignments/{giverId}        resultado do sorteio (quem tirou quem)
 *   messages/{messageId}         mensagens anônimas
 *
 * Os caminhos ficam em `paths` para não espalhar strings pelo código.
 */
import type { Timestamp } from "firebase-admin/firestore";

export type GroupStatus = "open" | "drawn";

export interface Group {
  name: string;
  description?: string;
  /** Valor sugerido do presente, em centavos. */
  budgetCents?: number;
  /** Data da troca, no formato AAAA-MM-DD. */
  exchangeDate?: string;
  /** Quem tem este token administra o grupo (link secreto do organizador). */
  adminToken: string;
  /** Código do link de convite. */
  inviteCode: string;
  /** Se as pessoas podem se cadastrar sozinhas pelo convite. */
  allowSelfJoin: boolean;
  status: GroupStatus;
  drawnAt?: Timestamp;
  createdAt: Timestamp;
}

export interface Participant {
  name: string;
  email?: string;
  phone?: string;
  /** Link pessoal para ver quem tirou, lista de desejos e mensagens. */
  accessToken: string;
  wishlist?: string;
  createdAt: Timestamp;
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
  createdAt: Timestamp;
}

/** Documento com id = giverId. */
export interface Assignment {
  receiverId: string;
}

/** O app nunca mostra ao destinatário quem é o remetente. */
export interface Message {
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: Timestamp;
}

export const paths = {
  groups: "groups",
  group: (groupId: string) => `groups/${groupId}`,
  participants: (groupId: string) => `groups/${groupId}/participants`,
  rules: (groupId: string) => `groups/${groupId}/rules`,
  assignments: (groupId: string) => `groups/${groupId}/assignments`,
  messages: (groupId: string) => `groups/${groupId}/messages`,
} as const;
