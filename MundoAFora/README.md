# Mundo A Fora

Aplicativo em React Native e Expo SDK 57 para abrir no Expo Go. Interface azul inspirada nos protótipos aprovados.

## Abrir no celular

1. Instale Node.js 22 LTS ou versão superior compatível e atualize o Expo Go no celular (SDK 57).
2. Extraia o ZIP. No VS Code, abra a pasta **MundoAFora**, que contém o package.json.
3. Abra Terminal > Novo Terminal e execute:

```bash
npm install
npx expo install --fix
npm start
```

4. Deixe computador e celular na mesma rede Wi-Fi.
5. Android: abra o Expo Go e use Scan QR code. iPhone: leia o QR Code com a câmera e abra no Expo Go.

Se a rede não conectar, pare o terminal com Ctrl+C e execute:

```bash
npm run tunnel
```

O Expo poderá pedir para instalar @expo/ngrok para usar o túnel. Mantenha o computador e o terminal ligados.

Se aparecer incompatibilidade de SDK, confira o Expo Go em https://expo.dev/go. Esta pasta usa SDK 57. Não misture node_modules de outro projeto.

Para limpar cache:

```bash
npx expo start --go --clear
```

## O que funciona

- Splash com logo, início, catálogo dos cinco países, pesquisa e filtros.
- Detalhes com seções expansíveis e favoritos.
- Comparação de idioma, moeda e continente de dois destinos.
- Lista de residentes por país e chat com respostas de demonstração.
- Perfil editável e acesso aos favoritos.
- Menu inferior e botão Voltar do Android.

## Limites desta versão

Sem backend, login ou comunicação real. Todos os residentes são fictícios e o chat responde automaticamente para demonstrar a interface. Perfil, favoritos e mensagens ficam em memória e reiniciam ao encerrar o app. O conteúdo migratório é introdutório e não substitui pesquisa em fontes oficiais.

As fotos pequenas foram extraídas do protótipo fornecido; podem ser substituídas por imagens em maior resolução mantendo os nomes em assets. O avatar usa um ícone para não depender de fotos de pessoas reais. A interface foi adaptada para rolagem em diferentes tamanhos de celular.

## Organização

- App.js: navegação e estado da sessão.
- src/screens: telas.
- src/components/UI.js: botões, ícones e cards reutilizáveis.
- src/data/countries.js: países e residentes de demonstração.
- src/styles/theme.js: cores e estilos.
- assets: logo e fotos locais.

Para conectar pessoas reais posteriormente, implementar autenticação, armazenamento persistente, servidor de mensagens, bloqueio e denúncia de usuários.
