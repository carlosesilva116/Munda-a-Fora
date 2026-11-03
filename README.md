# Mundo a Fora — aplicativo mobile

Aplicativo em React Native + Expo para apoiar pessoas que planejam morar em outro país, conectando informações sobre destinos, projetos, residentes e perfis pessoais/empresariais.

## Executar o projeto

Requisitos: Node.js compatível com o Expo SDK definido em `package.json`.

```bash
npm install
npx expo install --fix
npm start
```

Para Android, iOS ou web, use `npm run android`, `npm run ios` ou `npm run web`. Para testar em redes com restrições, use `npm run tunnel`.

## Configurar o backend

O projeto mantém a integração Supabase existente. Consulte [`README_BACKEND.md`](README_BACKEND.md) para configurar o projeto, variáveis de ambiente e o esquema SQL. Sem as variáveis `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`, as telas demonstrativas continuam disponíveis quando suportado pelo fluxo, mas recursos persistidos precisam do backend configurado.

Nunca inclua a chave `service_role` no aplicativo.

## Organização do código

- `App.js`: ponto de entrada, mantendo a inicialização enxuta.
- `src/navigation/AppNavigation.js`: centraliza as etapas de autenticação, navegação entre telas, sessão e ações compartilhadas. Foi mantida a navegação atual para preservar o fluxo já existente.
- `src/screens/`: telas de usuários, empresas, países, projetos, residentes, perfil e chat.
- `src/components/`: componentes reutilizáveis de interface (`UI.js`, `PrimaryButton.js`, `InputField.js`).
- `src/services/api.js`: operações de autenticação, perfis, projetos, inscrições, chats e favoritos.
- `src/services/supabase.js`: criação e configuração do cliente Supabase.
- `src/styles/theme.js`: tokens de cores e estilos comuns.
- `src/data/countries.js`: conteúdo de países usado pelo aplicativo.
- `supabase/schema.sql`: tabelas, políticas e recursos de banco de dados.

## Padrões aplicados nesta organização

A estrutura segue a separação de responsabilidades usada no StudyFlow: entrada do aplicativo, navegação centralizada, telas isoladas, componentes reutilizáveis e estilos centralizados. Foram introduzidos componentes compartilhados de botão e campo de formulário, além de nomes de cores compatíveis com esse padrão. Os aliases antigos do tema foram preservados para evitar alterações desnecessárias nas telas.

As funções principais e a identidade do Mundo a Fora foram mantidas. Os pacotes específicos de backend (Supabase, AsyncStorage e polyfill de URL) continuam no projeto porque dão suporte à persistência e autenticação e não fazem parte do StudyFlow de referência.
