-- Mundo a Fora: esquema inicial para Supabase (PostgreSQL + RLS)
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  kind text not null default 'Planejando a mudança' check (kind in ('Planejando a mudança','Residente no exterior','Empresa')),
  location text not null default '', destination text not null default '', languages text not null default 'Português', bio text not null default '',
  company_name text not null default '', company_country text not null default '', origin_country text not null default '', company_id text not null default '',
  industry text not null default '', website text not null default '', company_bio text not null default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null, service text not null check (service in ('Educação','Moradia','Trabalho','Imigração','Saúde','Outros')),
  title text not null, description text not null, requirements text not null default '', benefits text not null default '', contact text not null default '',
  vacancies integer not null default 1 check (vacancies >= 0), city text not null, state text not null default '', country text not null,
  status text not null default 'published' check (status in ('draft','published','paused','closed','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.project_applications (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, message text not null default '',
  status text not null default 'pending' check (status in ('pending','reviewing','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(project_id,user_id)
);

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(), title text not null, created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.chat_members (
  chat_id uuid not null references public.chats(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','moderator','member')), joined_at timestamptz not null default now(),
  primary key(chat_id,user_id)
);
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(), chat_id uuid not null references public.chats(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade, body text not null check (length(trim(body)) > 0 and length(body) <= 5000),
  created_at timestamptz not null default now(), edited_at timestamptz
);
create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade, country_id text not null,
  created_at timestamptz not null default now(), primary key(user_id,country_id)
);

create index if not exists projects_status_created_idx on public.projects(status,created_at desc);
create index if not exists projects_owner_idx on public.projects(owner_id);
create index if not exists applications_user_idx on public.project_applications(user_id,created_at desc);
create index if not exists messages_chat_created_idx on public.messages(chat_id,created_at);
create index if not exists chat_members_user_idx on public.chat_members(user_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_applications enable row level security;
alter table public.chats enable row level security;
alter table public.chat_members enable row level security;
alter table public.messages enable row level security;
alter table public.favorites enable row level security;

-- Profiles: authenticated users can read public directory fields; only owner edits own profile.
create policy "profiles are readable by authenticated users" on public.profiles for select to authenticated using (true);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "published projects visible to signed-in users" on public.projects for select to authenticated using (status = 'published' or owner_id = auth.uid());
create policy "companies create own projects" on public.projects for insert to authenticated with check (owner_id = auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.kind='Empresa'));
create policy "owners update projects" on public.projects for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners delete projects" on public.projects for delete to authenticated using (owner_id = auth.uid());

create policy "applicant and project owner can read applications" on public.project_applications for select to authenticated using (user_id=auth.uid() or exists(select 1 from public.projects p where p.id=project_id and p.owner_id=auth.uid()));
create policy "users apply as themselves" on public.project_applications for insert to authenticated with check (user_id=auth.uid() and exists(select 1 from public.projects p where p.id=project_id and p.status='published' and p.owner_id<>auth.uid()));
create policy "applicants may withdraw own application" on public.project_applications for update to authenticated
using (user_id=auth.uid()) with check (user_id=auth.uid() and status='withdrawn');
create policy "project owners review applications" on public.project_applications for update to authenticated
using (exists(select 1 from public.projects p where p.id=project_id and p.owner_id=auth.uid()))
with check (exists(select 1 from public.projects p where p.id=project_id and p.owner_id=auth.uid()));
create policy "owners or applicants delete application" on public.project_applications for delete to authenticated using (user_id=auth.uid() or exists(select 1 from public.projects p where p.id=project_id and p.owner_id=auth.uid()));

create or replace function public.is_chat_member(target_chat uuid, target_user uuid) returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.chat_members where chat_id=target_chat and user_id=target_user);
$$;
create policy "chat members can read chat" on public.chats for select to authenticated using (public.is_chat_member(id,auth.uid()) or created_by=auth.uid());
create policy "signed in users create chats" on public.chats for insert to authenticated with check (created_by=auth.uid());
create policy "chat creator updates chat" on public.chats for update to authenticated using (created_by=auth.uid()) with check (created_by=auth.uid());
create policy "chat creator deletes chat" on public.chats for delete to authenticated using (created_by=auth.uid());
create policy "members can see members" on public.chat_members for select to authenticated using (user_id=auth.uid() or public.is_chat_member(chat_id,auth.uid()));
create policy "users join chats as themselves" on public.chat_members for insert to authenticated with check (user_id=auth.uid() or exists(select 1 from public.chats c where c.id=chat_id and c.created_by=auth.uid()));
create policy "users leave own chat" on public.chat_members for delete to authenticated using (user_id=auth.uid() or exists(select 1 from public.chats c where c.id=chat_id and c.created_by=auth.uid()));
create policy "chat members read messages" on public.messages for select to authenticated using (public.is_chat_member(chat_id,auth.uid()));
create policy "chat members send messages as themselves" on public.messages for insert to authenticated with check (sender_id=auth.uid() and public.is_chat_member(chat_id,auth.uid()));
create policy "authors edit own messages" on public.messages for update to authenticated using (sender_id=auth.uid()) with check (sender_id=auth.uid());
create policy "authors delete own messages" on public.messages for delete to authenticated using (sender_id=auth.uid());
create policy "users manage own favorites" on public.favorites for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

-- Provisiona automaticamente o perfil após a criação de uma conta via Supabase Auth.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,email,name,kind,company_name,company_country,origin_country,company_id)
 values(new.id,new.email,coalesce(new.raw_user_meta_data->>'name','Usuário'),coalesce(new.raw_user_meta_data->>'kind','Planejando a mudança'),coalesce(new.raw_user_meta_data->>'company_name',''),coalesce(new.raw_user_meta_data->>'company_country',''),coalesce(new.raw_user_meta_data->>'origin_country',''),coalesce(new.raw_user_meta_data->>'company_id',''))
 on conflict(id) do update set email=excluded.email;
 return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Reduz uma vaga automaticamente ao receber uma nova inscrição e impede overbooking.
create or replace function public.reserve_project_vacancy() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  if tg_op = 'INSERT' and not exists (
    select 1 from public.project_applications
    where project_id = new.project_id and user_id = new.user_id
  ) then
    update public.projects set vacancies = vacancies - 1, updated_at = now()
      where id = new.project_id and status = 'published' and vacancies > 0;
    if not found then raise exception 'Este projeto não possui vagas disponíveis.'; end if;
  end if;
  return new;
end; $$;
drop trigger if exists project_application_reserve_vacancy on public.project_applications;
create trigger project_application_reserve_vacancy before insert on public.project_applications
for each row execute procedure public.reserve_project_vacancy();

-- Indicadores por projeto: inscrições totais, pendentes, aceitas e vagas restantes.
create or replace view public.project_analytics with (security_invoker = true) as
select p.id as project_id, p.owner_id, p.title, p.service, p.status, p.vacancies,
       count(a.id)::integer as total_applications,
       count(a.id) filter (where a.status='pending')::integer as pending_applications,
       count(a.id) filter (where a.status='accepted')::integer as accepted_applications,
       count(a.id) filter (where a.status='rejected')::integer as rejected_applications
from public.projects p left join public.project_applications a on a.project_id=p.id group by p.id;
grant select on public.project_analytics to authenticated;