# Sorteador de Times Online

Aplicacao web estatica para sortear times de futebol, acompanhar partidas de 7 minutos e registrar vitorias.

## Funcionalidades

- Sorteio de 2 a 4 equipes
- Selecao de jogadores por equipe
- Selecao do tempo da partida: 5, 7 ou 10 minutos
- Tela inicial com imagem horizontal completa e formulario abaixo no desktop
- Container da imagem inicial exibindo somente o titulo `Sorteador de Times`
- Container da imagem ajustado proporcionalmente no responsivo com titulo menor
- Titulo do container da imagem centralizado na parte inferior, respeitando o padding
- Leitura de lista somente nos formatos `1-Nome` ou `1.Nome`
- Sorteio permitido mesmo sem jogadores suficientes para completar todas as equipes
- Distribuicao prioriza Time 1, Time 2, Time 3 e depois os demais times
- Cores dos times sorteadas automaticamente entre preto claro, laranja, verde e amarelo
- Time verde usa texto preto, e time laranja usa texto branco
- Containers e linhas da tabela de estatisticas seguem a cor sorteada de cada time
- Quando houver um titulo `Lista` ou `Jogadores`, o sistema considera somente as linhas abaixo dele
- Suporte a nomes com acentos, letras diferentes, simbolos e emojis
- Cronometro de 7 minutos iniciado manualmente
- Alerta em tela cheia para escolher o vencedor somente ao fim do tempo
- Botao para encerrar a partida manualmente com confirmacao
- Empate com escolha de placar `0x0` ou `1x1` antes do par ou impar
- Desempate por par ou impar usando os nomes reais dos times da partida
- Escolha de placar da partida: `1x0`, `2x0` ou `2x1`
- Menu `Quem venceu a partida?` com opcao selecionada em destaque e demais em cinza claro
- Alerta de decisao com pagina travada ao fundo e rolagem apenas dentro do modal no responsivo
- Opcoes de placar e par ou impar ficam selecionadas ao serem escolhidas
- Submenus expansivos para placar e par ou impar, com fechamento ao clicar novamente na opcao selecionada
- Criacao continua de novas partidas, sem limite final
- Formato especial para 4 times, com vencedor seguindo contra times aguardando e depois contra perdedores em fila
- Empate com 4 times alterna a proxima partida para os times aguardando e reserva o vencedor do par ou impar
- Previa da proxima partida:
  - 1 container: `Time 3 x vencedor da partida 1`
  - 2 container: `perdedor da partida 1 x vencedor da partida 2`
  - 3 container em diante: `perdedor da partida anterior x vencedor da partida atual`
- Partidas encerradas exibidas abaixo do container de proxima partida em ordem decrescente
- Container de proxima partida em azul claro
- Partidas encerradas com destaque em cinza mais escuro
- Partidas encerradas exibem vencedor em verde neon, empate em amarelo neon e placar em neon
- Cronometro em mini container visual de destaque
- Tabela profissional de estatisticas por time: posicao, pontos, vitorias, empates, derrotas, gols marcados e gols sofridos
- Classificacao atualizada automaticamente apos cada termino de partida
- Botao para baixar a tabela de estatisticas em imagem PNG
- Observacao na tabela quando houver vitoria ou derrota por par ou impar
- Tabela de estatisticas com divisorias verticais entre os dados
- Resultado direto no card da partida encerrada, com vencedor em verde e perdedor em vermelho
- Empates exibem o placar em amarelo e o vencedor do par ou impar em verde
- FAQ para verificar todos os times sorteados
- CSS separado por responsabilidade:
  - `css/base.css`
  - `css/form.css`
  - `css/results.css`
  - `css/timer.css`
  - `css/matches.css`
  - `css/decision-modal.css`
  - `css/next-match.css`
  - `css/stats.css`
  - `css/sorted-teams.css`
  - `css/responsive.css`
- JavaScript separado por responsabilidade:
  - `js/state.js`
  - `js/dom.js`
  - `js/utils.js`
  - `js/render-timer.js`
  - `js/render-matches.js`
  - `js/render-decision.js`
  - `js/render-next-match.js`
  - `js/render-stats.js`
  - `js/render-sorted-teams.js`
  - `js/render.js`
  - `js/match-flow.js`
  - `js/timer-actions.js`
  - `js/decision-actions.js`
  - `js/container-actions.js`
  - `app.js`

## Como rodar localmente

```bash
npm install
npm start
```

Depois acesse o endereco exibido no terminal.

## Deploy na Vercel

O projeto foi mantido como aplicacao estatica. Basta importar o repositorio na Vercel ou enviar os arquivos do projeto.
