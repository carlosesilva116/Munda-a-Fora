# Padrão de arquitetura

## Princípio

Manter o Mundo a Fora como produto independente, reutilizando a organização simples do StudyFlow sem importar sua lógica de domínio educacional ou remover telas e recursos.

## Responsabilidades

- **App.js** inicializa o contexto de áreas seguras e delega a interface à navegação.
- **AppNavigation.js** coordena autenticação, estado da sessão e transições do fluxo atual.
- **screens/** contém as telas e suas interações específicas.
- **components/** reúne elementos compartilhados para reduzir duplicação.
- **styles/theme.js** concentra cores e estilos compartilhados.
- **services/** isola acesso ao Supabase e operações de negócio.
- **data/** contém conteúdo local de apoio.
- **supabase/schema.sql** descreve a persistência e as regras no banco.

## Convenções

1. Prefira componentes reutilizáveis a duplicar botões e campos.
2. Mantenha chamadas ao backend em `src/services/`, evitando consultas Supabase diretamente nas telas.
3. Centralize cores e tokens visuais em `src/styles/theme.js`.
4. Preserve as APIs de props das telas ao reorganizar componentes, para evitar regressões.
5. Não exponha segredos no cliente mobile; use somente a chave pública do Supabase com RLS configurado.
