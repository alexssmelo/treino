# Treino

App web instalável (PWA) com cronômetro, distância por GPS, marcador de km e calorias.
Funciona em Android e iPhone, direto do navegador.

## Planos incluídos (aba Planos)

- **Começar a correr (12 semanas, de João Tavella):** Fase 1 (2 km), Fase 2 (3 km) e Fase 3 (desafio de 5 km).
  Treinos de segunda, quarta e sábado, com aquecimento, blocos de caminhada e trote, soltura e desafios finais.
  O app avisa por voz, som e vibração quando é hora de caminhar ou correr, e mede km e calorias pelo GPS.
- **Treino em casa (4 semanas):** HIIT, corpo inteiro, cardio e abdômen, com cronômetro por exercício,
  séries, descansos e a progressão semanal da ficha. Inclui o controle de evolução (peso, cintura, observações).
- Cada treino concluído fica marcado na semana, e tudo vai para o histórico.

Ajustes que o app faz na ficha de casa: o número de séries segue a tabela de progressão (3 séries nas semanas 1 e 2,
4 séries nas semanas 3 e 4), soma 5 s nos exercícios por tempo a partir da semana 2 e reduz os descansos na semana 4.
Onde a ficha não indica descanso entre séries, o app usa 45 s (dá para pular).


## Publicar no GitHub Pages

1. Crie uma conta em github.com e clique em **New repository**. Nome sugerido: `treino`. Deixe **Public**.
2. Na página do repositório, clique em **uploading an existing file** e arraste **todos** os arquivos desta pasta
   (`index.html`, `manifest.json`, `sw.js`, `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`).
   Clique em **Commit changes**.
3. Vá em **Settings > Pages**. Em **Source**, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)**, e salve.
4. Espere 1 a 2 minutos. O app fica em `https://SEU-USUARIO.github.io/treino/`.

O GitHub Pages usa HTTPS, que o navegador exige para liberar o GPS.

## Instalar no celular

- **Android (Chrome):** menu de três pontos > **Instalar app** (ou **Adicionar à tela inicial**).
- **iPhone (Safari):** botão de compartilhar > **Adicionar à Tela de Início**.

## Como o app calcula

- **Distância:** soma as distâncias entre leituras de GPS (fórmula de Haversine). Leituras com precisão pior que 40 m,
  saltos impossíveis e a tremida do GPS parado são descartados.
- **Calorias:** `kcal = MET x peso (kg) x tempo (h)`, com o MET ajustado pela velocidade dos últimos 20 s.
  É uma estimativa e inclui o gasto de repouso.
- **Marcador de km:** barra do km atual e lista de parciais (tempo de cada km).

## Limitações do PWA

- No iPhone, o GPS pode parar se a tela apagar ou o app for para segundo plano. O app pede para manter a tela ligada
  e, se o treino for interrompido, oferece continuar de onde parou.
- Para GPS em segundo plano de verdade, o próximo passo é migrar para Flutter ou React Native.

## Testar no computador

Abra um servidor local na pasta (`python3 -m http.server 8000`) e acesse `http://localhost:8000`.
O GPS funciona em `localhost`, mas não ao abrir o arquivo direto com `file://`.
