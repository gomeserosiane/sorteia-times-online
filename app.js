const VALID_USER = 'admin';
const VALID_PASS = '2026';

const screens = {
  login: document.getElementById('loginScreen'),
  form: document.getElementById('formScreen'),
  result: document.getElementById('resultScreen')
};

const loginForm = document.getElementById('loginForm');
const sortForm = document.getElementById('sortForm');
const loginError = document.getElementById('loginError');
const sortError = document.getElementById('sortError');
const loadingOverlay = document.getElementById('loadingOverlay');
const teamsContainer = document.getElementById('teamsContainer');
const resultCapture = document.getElementById('resultCapture');
const newDrawBtn = document.getElementById('newDrawBtn');
const downloadImageBtn = document.getElementById('downloadImageBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

const teamColors = [
  { bg: '#d1f7d6', card: '#7edc8a' },
  { bg: '#fff3cd', card: '#ffe08a' },
  { bg: '#f8d7da', card: '#f28b94' },
  { bg: '#d1ecf1', card: '#7fd3e0' },
  { bg: '#f8d1ec', card: '#f28bd6' }
];

let lastDraw = [];

function showScreen(targetKey) {
  Object.entries(screens).forEach(([key, el]) => {
    if (key === targetKey) {
      el.classList.remove('d-none');
      requestAnimationFrame(() => el.classList.add('active'));
    } else {
      el.classList.remove('active');
      setTimeout(() => {
        if (!el.classList.contains('active')) el.classList.add('d-none');
      }, 320);
    }
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function parsePlayers(rawText) {
  const lower = rawText.toLowerCase();
  const markerIndex = lower.indexOf('lista');
  if (markerIndex === -1) {
    throw new Error('A lista precisa conter a palavra "lista" antes dos nomes.');
  }

  const relevantText = rawText.slice(markerIndex + 5);
  const lines = relevantText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const players = [];
  for (const line of lines) {
    const match = line.match(/^\s*(\d+)\s*[-–—]\s*(.+)\s*$/);
    if (match && match[2]) {
      players.push(match[2].trim());
    }
  }

  if (!players.length) {
    throw new Error('Nenhum jogador válido foi encontrado. Use o padrão número-nome, por exemplo: 1-João');
  }

  return players;
}

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

function renderTeams(teams, playersPerTeam) {
  teamsContainer.innerHTML = '';

  teams.forEach((team, index) => {
    const color = teamColors[index] || teamColors[teamColors.length - 1];
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-xl-4';

    const playersMarkup = team.length
      ? team.map((player, playerIndex) => `
          <div class="player-mini-card" style="background:${color.card}">
            ${playerIndex + 1}. ${escapeHtml(player)}
          </div>
        `).join('')
      : `<div class="player-empty">Sem jogadores nesta equipe</div>`;

    const missing = Math.max(playersPerTeam - team.length, 0);
    const missingMarkup = missing
      ? Array.from({ length: missing }, () => `<div class="player-empty">Vaga disponível</div>`).join('')
      : '';

    col.innerHTML = `
      <div class="card team-card" style="background:${color.bg}">
        <div class="card-body">
          <h3 class="team-name">Equipe ${index + 1}</h3>
          <div class="team-meta">${team.length} / ${playersPerTeam} jogadores</div>
          <div class="player-grid">
            ${playersMarkup}
            ${missingMarkup}
          </div>
        </div>
      </div>
    `;

    teamsContainer.appendChild(col);
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

async function playLoadingTransition() {
  loadingOverlay.classList.remove('d-none');
  loadingOverlay.classList.remove('expand');
  await delay(1250);
  loadingOverlay.classList.add('expand');
  await delay(650);
  loadingOverlay.classList.add('d-none');
  loadingOverlay.classList.remove('expand');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === VALID_USER && password === VALID_PASS) {
    loginError.classList.add('d-none');
    showScreen('form');
  } else {
    loginError.classList.remove('d-none');
  }
});

sortForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  sortError.classList.add('d-none');
  sortError.textContent = '';

  try {
    const teamCount = Number(document.getElementById('teamCount').value);
    const playersPerTeam = Number(document.getElementById('playersPerTeam').value);
    const playerList = document.getElementById('playerList').value;

    if (!teamCount || !playersPerTeam || !playerList.trim()) {
      throw new Error('Preencha todos os campos antes de enviar.');
    }

    const players = parsePlayers(playerList);
    const teams = distributePlayers(players, teamCount, playersPerTeam);
    lastDraw = teams;

    await playLoadingTransition();
    renderTeams(teams, playersPerTeam);
    showScreen('result');
  } catch (error) {
    sortError.textContent = error.message || 'Não foi possível realizar o sorteio.';
    sortError.classList.remove('d-none');
  }
});

newDrawBtn.addEventListener('click', () => {
  sortForm.reset();
  sortError.classList.add('d-none');
  teamsContainer.innerHTML = '';
  lastDraw = [];
  showScreen('form');
});

async function generateCanvas() {
  return html2canvas(resultCapture, {
    backgroundColor: '#0b1020',
    scale: 2,
    useCORS: true,
    logging: false
  });
}

downloadImageBtn.addEventListener('click', async () => {
  if (!lastDraw.length) return;
  const canvas = await generateCanvas();
  const link = document.createElement('a');
  link.download = 'sorteio-times.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

downloadPdfBtn.addEventListener('click', async () => {
  if (!lastDraw.length) return;
  const canvas = await generateCanvas();
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 14;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const y = imgHeight > pageHeight - 14 ? 7 : (pageHeight - imgHeight) / 2;

  pdf.addImage(imgData, 'PNG', 7, y, imgWidth, Math.min(imgHeight, pageHeight - 14));
  pdf.save('sorteio-times.pdf');
});

showScreen('login');
