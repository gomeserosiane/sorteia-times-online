// Alterna entre as telas principais do sistema com transicao suave.
function showScreen(targetKey) {
  Object.entries(screens).forEach(([key, el]) => {
    if (key === targetKey) {
      el.classList.remove('d-none');
      requestAnimationFrame(() => el.classList.add('active'));
      return;
    }

    el.classList.remove('active');
    setTimeout(() => {
      if (!el.classList.contains('active')) el.classList.add('d-none');
    }, 320);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Embaralha os jogadores usando o algoritmo Fisher-Yates.
function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

// Le somente jogadores no formato numerado: 1-Nome ou 1.Nome.
function parsePlayers(rawText) {
  const allLines = rawText
    .normalize('NFC')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  const listStartIndex = allLines.findIndex(isPlayerListHeader);
  const lines = listStartIndex >= 0 ? allLines.slice(listStartIndex + 1) : allLines;

  const players = lines
    .map(extractNumberedPlayer)
    .filter(Boolean);

  if (!players.length) {
    throw new Error('Nenhum jogador valido foi encontrado. Use o formato 1-Nome ou 1.Nome.');
  }

  return players;
}

function extractNumberedPlayer(line) {
  const match = line.match(/^\s*\d+\s*[-.]\s*(.+?)\s*$/u);
  if (!match || !match[1]) return '';

  return match[1].replace(/\s+/gu, ' ').trim();
}

function isPlayerListHeader(line) {
  return /^(lista|lista\s+de\s+jogadores|jogadores|nomes|players)\s*[:\-–—]*$/iu.test(line);
}

// Distribui os jogadores sorteados priorizando Time 1, Time 2, Time 3 e os demais.
function distributePlayers(players, teamCount, playersPerTeam) {
  const shuffled = shuffle(players);
  const teams = Array.from({ length: teamCount }, () => []);
  let cursor = 0;

  for (let teamIndex = 0; teamIndex < teamCount; teamIndex++) {
    while (teams[teamIndex].length < playersPerTeam && cursor < shuffled.length) {
      teams[teamIndex].push(shuffled[cursor]);
      cursor += 1;
    }
  }

  return teams;
}

function buildTeamModels(teams) {
  return teams.map((players, index) => ({
    id: `team-${index + 1}`,
    name: `Time ${index + 1}`,
    players
  }));
}

function formatTimer(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Evita que nomes digitados pelo usuario sejam interpretados como HTML.
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
