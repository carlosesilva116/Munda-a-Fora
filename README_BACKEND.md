# Backend do Mundo a Fora (Supabase)

O aplicativo usa Supabase como backend gerenciado: Auth para autenticação, PostgreSQL para persistência e Row Level Security (RLS) para autorizações. Não é necessário manter um servidor Node separado para o fluxo padrão do aplicativo.

## Configuração

1. Crie um projeto em https://supabase.com/.
2. No painel, abra **SQL Editor** e execute todo o arquivo `supabase/schema.sql`.
3. Copie `.env.example` para `.env` e preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` com os valores do painel **Project Settings → API**. Use somente a chave pública/anon no aplicativo; nunca coloque `service_role` no app ou no repositório.
4. A integração também carrega o diretório de residentes cadastrados no banco; os dados de demonstração continuam como fallback quando a tabela não retorna residentes.
5. Instale dependências e inicie o Expo:
   ```bash
   npm install
   npx expo start
   ```
6. Em **Authentication → URL Configuration / Providers**, configure confirmação de e-mail e provedores conforme sua política de lançamento. Para testes, siga as configurações do próprio projeto Supabase.

## Módulos de backend

`src/services/supabase.js`: cliente Supabase persistente usando AsyncStorage.

`src/services/api.js`:
- `authApi`: cadastro, login, sessão e logout;
- `profileApi`: provisionamento, consulta e atualização de perfil pessoal/empresarial;
- `projectsApi`: listagem, criação, atualização, exclusão, inscrições, consulta e revisão de inscrições;
- `chatsApi`: criar chat, participar, listar chats, ler/enviar mensagens e apagar mensagens;
- `residentsApi` e `favoritesApi`: diretório de residentes e favoritos;
- `managementApi`: análise de projetos, alteração de status, gerenciamento de chats e mensagens e atualização de inscrições.

O SQL cria tabelas para perfis, projetos, inscrições, chats, membros, mensagens e favoritos, índices, políticas RLS, criação automática de perfil após cadastro, redução transacional de vagas ao receber uma nova inscrição e a view `project_analytics` para indicadores.

## Segurança e limitações importantes

- As políticas RLS são a barreira de segurança no banco; mantenha-as habilitadas em produção e revise-as antes do lançamento.
- A chave pública do Supabase é apropriada para o app somente porque o banco usa RLS. Nunca distribua a chave `service_role`.
- A criação de conta pode exigir confirmação de e-mail antes de haver uma sessão ativa. Nesse caso, confirme o endereço e depois entre normalmente.
- A interface existente ainda contém algumas telas originalmente demonstrativas. Os serviços de backend para chats, mensagens, diretório, análise e revisão de inscrições estão prontos para conexão; telas de gerenciamento avançado/tempo real precisam ser conectadas conforme a experiência de produto desejada.
- O código identifica empresas com os campos informados no cadastro, mas validação documental oficial, verificação antifraude, moderação, recuperação de senha e políticas legais exigem configuração e processos próprios antes de produção.
