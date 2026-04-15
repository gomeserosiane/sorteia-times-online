const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD = '2026';

const screens = {
  login: document.getElementById('loginScreen'),
  form: document.getElementById('formScreen'),
  loading: document.getElementById('loadingScreen'),
  result: document.getElementById('resultScreen'),
};

const loginForm = document.getElementById('loginForm');
const drawForm = document.getElementById('drawForm');
const loginError = document.getElementById('loginError');
const drawError = document.getElementById('drawError');
const teamCountEl = document.getElementById('teamCount');
const playersPerTeamEl = document.getElementById('playersPerTeam');
const playerListEl = document.getElementById('playerList');
const loadingBall = document.getElementById('loadingBall');
const teamsGrid = document.getElementById('teamsGrid');
const resetBtn = document.getElementById('resetBtn');
const downloadImageBtn = document.getElementById('downloadImageBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const captureArea = document.getElementById('captureArea');

let latestDraw = null;

function showScreen(targetKey) {
  Object.entries(screens).forEach(([key, section]) => {
    if (key === targetKey) {
      section.classList.remove('d-none', 'leaving');
      requestAnimationFrame(() => section.classList.add('active'));
    } else {
      section.classList.remove('active');
      section.classList.add('leaving');
      setTimeout(() => section.classList.add('d-none'), 250);
    }
  });
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    loginError.classList.add('d-none');
    showScreen('form');
  } else {
    loginError.classList.remove('d-none');
  }
});

function extractPlayers(rawText) {
  if (!rawText || !rawText.trim()) {
    throw new Error('Cole a lista de jogadores antes de enviar.');
  }

  const normalized = rawText.replace(/\r/g, '');
  const matchLista = normalized.match(/lista([\s\S]*)/i);
  const relevantText = matchLista ? matchLista[1] : normalized;

  const lines = relevantText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const players = [];

  for (const line of lines) {
    const match = line.match(/^\s*\d+\s*[-–—]\s*(.+?)\s*$/);
    if (match && match[1]) {
      players.push(match[1].trim());
    }
  }

  if (!players.length) {
    throw new Error('Nenhum nome válido foi encontrado. Use o padrão número-nome após a palavra lista.');
  }

  return players;
}

function shuffleArray(array) {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function distributePlayers(players, teamCount, playersPerTeam) {
  const teams = Array.from({ length: teamCount }, (_, index) => ({
    name: `Equipe ${index + 1}`,
    players: []
  }));

  const shuffled = shuffleArray(players);
  let cursor = 0;

  for (let teamIndex = 0; teamIndex < teamCount; teamIndex++) {
    for (let slot = 0; slot < playersPerTeam; slot++) {
      if (cursor < shuffled.length) {
        teams[teamIndex].players.push(shuffled[cursor]);
        cursor += 1;
      }
    }
  }

  return teams;
}

function renderTeams(teams, playersPerTeam) {
  teamsGrid.innerHTML = '';

  teams.forEach((team) => {
    const ball = document.createElement('article');
    ball.className = 'team-ball';

    const inner = document.createElement('div');
    inner.className = 'team-inner';

    const title = document.createElement('h2');
    title.className = 'team-title';
    title.textContent = team.name;

    const miniBalls = document.createElement('div');
    miniBalls.className = 'mini-balls';

    for (let i = 0; i < playersPerTeam; i++) {
      const playerBall = document.createElement('div');
      playerBall.className = 'player-mini-ball';
      if (team.players[i]) {
        playerBall.textContent = team.players[i];
      } else {
        playerBall.classList.add('empty-slot');
        playerBall.textContent = 'Vago';
      }
      miniBalls.appendChild(playerBall);
    }

    inner.appendChild(title);
    inner.appendChild(miniBalls);
    ball.appendChild(inner);
    teamsGrid.appendChild(ball);
  });
}

async function runLoadingThenShowResult() {
  showScreen('loading');
  loadingBall.classList.remove('expand');

  await new Promise(resolve => setTimeout(resolve, 1400));
  loadingBall.classList.add('expand');
  await new Promise(resolve => setTimeout(resolve, 850));

  showScreen('result');
  setTimeout(() => loadingBall.classList.remove('expand'), 300);
}

drawForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  drawError.classList.add('d-none');

  try {
    const teamCount = Number(teamCountEl.value);
    const playersPerTeam = Number(playersPerTeamEl.value);
    const players = extractPlayers(playerListEl.value);

    if (!teamCount || !playersPerTeam) {
      throw new Error('Selecione a quantidade de equipes e de jogadores por equipe.');
    }

    const teams = distributePlayers(players, teamCount, playersPerTeam);
    latestDraw = { teamCount, playersPerTeam, teams };
    renderTeams(teams, playersPerTeam);
    await runLoadingThenShowResult();
  } catch (error) {
    drawError.textContent = error.message || 'Não foi possível processar a lista.';
    drawError.classList.remove('d-none');
  }
});

resetBtn.addEventListener('click', () => {
  drawForm.reset();
  drawError.classList.add('d-none');
  teamsGrid.innerHTML = '';
  latestDraw = null;
  showScreen('form');
});

async function generateCanvas() {
  return await html2canvas(captureArea, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#0b1624'
  });
}

downloadImageBtn.addEventListener('click', async () => {
  if (!latestDraw) return;
  const canvas = await generateCanvas();
  const link = document.createElement('a');
  link.download = 'sorteio-times.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

downloadPdfBtn.addEventListener('click', async () => {
  if (!latestDraw) return;
  const canvas = await generateCanvas();
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const imgWidth = canvas.width * ratio;
  const imgHeight = canvas.height * ratio;
  const x = (pageWidth - imgWidth) / 2;
  const y = (pageHeight - imgHeight) / 2;

  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
  pdf.save('sorteio-times.pdf');
});

showScreen('login');
