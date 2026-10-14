# Ativar contas e dados na nuvem (Firebase)

Com isso, cada pessoa cria a própria conta (e-mail e senha) e o histórico, as medidas e o
progresso dos planos acompanham a pessoa em qualquer celular. Um usuário nunca vê os dados de outro.
O plano gratuito (Spark) do Firebase atende bem esse uso.

## 1. Criar o projeto
1. Entre em https://console.firebase.google.com com sua conta Google.
2. **Criar projeto** (ou *Add project*), nome `treino`. Pode desativar o Google Analytics.

## 2. Ligar o login por e-mail e senha
1. Menu **Build > Authentication > Get started**.
2. Aba **Sign-in method > Email/Password > Enable > Save**.
3. Aba **Settings > Authorized domains**: confirme que `alexssmelo.github.io` está na lista. Se não estiver, adicione.

## 3. Criar o banco de dados
1. Menu **Build > Firestore Database > Create database**.
2. Escolha uma região (ex.: `southamerica-east1`, São Paulo). Ela não muda depois.
3. Inicie em **modo de produção**.
4. Aba **Rules**: apague tudo, cole o conteúdo do arquivo `firestore.rules` e clique em **Publish**.

## 4. Pegar a configuração do app
1. Engrenagem ao lado de *Project Overview* > **Project settings > General**.
2. Em *Your apps*, clique no ícone **Web (`</>`)**, dê o nome `treino` e registre (sem Firebase Hosting).
3. Copie os valores do bloco `firebaseConfig`.

## 5. Colar no app e publicar
1. Abra o arquivo `firebase-config.js` e cole os valores (apiKey, authDomain, projectId, appId...).
2. No GitHub, envie para o repositório: `index.html`, `sw.js`, `cloud.js`, `firebase-config.js` (e `firestore.rules`, opcional).
3. Abra `https://alexssmelo.github.io/treino/`. O botão **Entrar** aparece no canto superior direito.

## Como funciona
- Sem conta, o app continua funcionando só no aparelho. Com conta, sincroniza ao salvar um treino, ao abrir o app e quando a internet volta.
- Ao entrar pela primeira vez, o app pergunta se você quer importar os treinos que já estavam neste celular.
- O app mescla os dados (não apaga nada de nenhum lado). Excluir um treino em um aparelho exclui nos outros.
- A `apiKey` do Firebase não é segredo; quem protege os dados são as regras do passo 3.
- Recuperar senha: toque em *Esqueci a senha* na tela de login e o Firebase envia o e-mail.

## Login com Google
O app tem o botão **Continuar com o Google** na tela de login. Para funcionar:
1. No Firebase, **Authentication > Método de login** deve ter **Google** ativado (já está no seu projeto).
2. **Authentication > Configurações > Domínios autorizados** deve ter `alexssmelo.github.io`.
Cada pessoa precisa entrar (ou criar conta) para abrir o app.

## Painel do administrador (ver quem usa o app)

1. No Firebase, abra **Firestore Database > Regras**, apague o texto atual, cole o conteúdo do arquivo `firestore.rules` e toque em **Publicar**.
2. Abra o app e entre com a sua conta uma vez (isso cria o seu resumo).
3. No Firebase, vá em **Authentication > Usuários** e copie o **UID do usuário** da sua conta.
4. Em **Firestore Database > Dados**, toque em **Iniciar coleção**. Nome da coleção: `admins`. ID do documento: cole o seu UID. Campo: `ativo`, tipo booleano, valor `true`. Salve.
5. Abra o app, feche e abra de novo. Em **Conta** aparece o botão **Painel do administrador**.

O painel mostra nome, e-mail, cadastro, último acesso, treinos e km de cada pessoa. Cada pessoa aparece depois de abrir o app atualizado com internet.
Para dar acesso a outra pessoa, crie outro documento em `admins` com o UID dela.
