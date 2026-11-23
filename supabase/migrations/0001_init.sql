-- QuemFoi? esquema inicial
-- Sem contas de usuário: o acesso é por tokens secretos nos links.
-- Todas as tabelas têm RLS ligado e nenhuma política pública;
-- só o servidor (chave service_role) lê e escreve.

create extension if not exists pgcrypto;

create table groups (
  id              uuid primary key default gen_random_uuid(),
  name            text not null check (char_length(name) between 1 and 120),
  description     text,
  budget_cents    integer check (budget_cents is null or budget_cents >= 0),
  exchange_date   date,
  -- quem tem este token administra o grupo
  admin_token     text not null unique,
  -- código do link de convite (cadastro aberto)
  invite_code     text not null unique,
  allow_self_join boolean not null default true,
  status          text not null default 'open' check (status in ('open', 'drawn')),
  drawn_at        timestamptz,
  created_at      timestamptz not null default now()
);

create table participants (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references groups(id) on delete cascade,
  name         text not null check (char_length(name) between 1 and 80),
  email        text,
  phone        text,
  -- link pessoal para ver quem tirou, lista de desejos e mensagens
  access_token text not null unique,
  wishlist     text,
  created_at   timestamptz not null default now(),
  unique (group_id, name)
);
create index on participants (group_id);

-- Regras do sorteio.
--   exclude_pair:     A e B não se tiram (nos dois sentidos), ex.: casais
--   exclude_one_way:  A não pode tirar B
--   force_pair:       A tem que tirar B
create table rules (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references groups(id) on delete cascade,
  kind       text not null check (kind in ('exclude_pair', 'exclude_one_way', 'force_pair')),
  a_id       uuid not null references participants(id) on delete cascade,
  b_id       uuid not null references participants(id) on delete cascade,
  note       text,
  created_at timestamptz not null default now(),
  check (a_id <> b_id)
);
create index on rules (group_id);

-- Resultado do sorteio: giver tirou receiver
create table assignments (
  group_id    uuid not null references groups(id) on delete cascade,
  giver_id    uuid not null references participants(id) on delete cascade,
  receiver_id uuid not null references participants(id) on delete cascade,
  primary key (group_id, giver_id),
  unique (group_id, receiver_id),
  check (giver_id <> receiver_id)
);

-- Mensagens anônimas entre quem dá e quem recebe.
-- sender_id é guardado, mas o app nunca mostra ao destinatário quem é o amigo secreto.
create table messages (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references groups(id) on delete cascade,
  sender_id    uuid not null references participants(id) on delete cascade,
  recipient_id uuid not null references participants(id) on delete cascade,
  body         text not null check (char_length(body) between 1 and 1000),
  created_at   timestamptz not null default now()
);
create index on messages (recipient_id, created_at);

alter table groups       enable row level security;
alter table participants enable row level security;
alter table rules        enable row level security;
alter table assignments  enable row level security;
alter table messages     enable row level security;
