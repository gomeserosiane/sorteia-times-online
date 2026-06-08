const screens = {
  form: document.getElementById('formScreen'),
  result: document.getElementById('resultScreen')
};

const sortForm = document.getElementById('sortForm');
const sortError = document.getElementById('sortError');
const loadingOverlay = document.getElementById('loadingOverlay');
const teamsContainer = document.getElementById('teamsContainer');
const resultCapture = document.getElementById('resultCapture');
const newDrawBtn = document.getElementById('newDrawBtn');
const downloadImageBtn = document.getElementById('downloadImageBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

const teamColors = [
  { bg: '#dcfce7', card: '#86efac' },
  { bg: '#fef9c3', card: '#fde047' },
  { bg: '#dbeafe', card: '#93c5fd' },
  { bg: '#fae8ff', card: '#e879f9' },
  { bg: '#ffedd5', card: '#fdba74' }
];

let lastDraw = [];
let lastPlayersPerTeam = 0;

// Alterna entre as telas principais do sistema com transição suave.
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

// Lê a lista colada e extrai os nomes no padrão: número-nome.
function parsePlayers(rawText) {
  const lower = rawText.toLowerCase();
  const markerIndex = lower.indexOf('lista');
  const relevantText = markerIndex >= 0 ? rawText.slice(markerIndex + 5) : rawText;

  const lines = relevantText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const players = [];

  for (const line of lines) {
    const match = line.match(/^\s*(\d+)\s*[-–—.]\s*(.+)\s*$/);

    if (match && match[2]) {
      players.push(match[2].trim());
      continue;
    }

    // Também aceita linhas sem número para facilitar o uso no dia a dia.
    if (!/^lista$/i.test(line) && !/^\d+$/.test(line)) {
      players.push(line.replace(/^[-–—.]\s*/, '').trim());
    }
  }

  const cleanPlayers = players.filter(Boolean);

  if (!cleanPlayers.length) {
    throw new Error('Nenhum jogador válido foi encontrado. Use o padrão 1-João, um jogador por linha.');
  }

  return cleanPlayers;
}

// Distribui os jogadores sorteados respeitando a quantidade de equipes e vagas por equipe.
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

// Renderiza os cards das equipes na tela de resultado.
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
      : '<div class="player-empty">Sem jogadores nesta equipe</div>';

    const missing = Math.max(playersPerTeam - team.length, 0);
    const missingMarkup = missing
      ? Array.from({ length: missing }, () => '<div class="player-empty">Vaga disponível</div>').join('')
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

// Evita que nomes digitados pelo usuário sejam interpretados como HTML.
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

// Exibe uma animação curta antes de abrir o resultado.
async function playLoadingTransition() {
  loadingOverlay.classList.remove('d-none');
  loadingOverlay.classList.remove('expand');
  await delay(900);
  loadingOverlay.classList.add('expand');
  await delay(500);
  loadingOverlay.classList.add('d-none');
  loadingOverlay.classList.remove('expand');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    const minimumPlayers = teamCount * playersPerTeam;

    if (players.length < minimumPlayers) {
      throw new Error(`Você informou ${players.length} jogador(es), mas esse formato precisa de ${minimumPlayers}.`);
    }

    const teams = distributePlayers(players, teamCount, playersPerTeam);
    lastDraw = teams;
    lastPlayersPerTeam = playersPerTeam;

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
  lastPlayersPerTeam = 0;
  showScreen('form');
});

async function generateCanvas() {
  return html2canvas(resultCapture, {
    backgroundColor: '#06130d',
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

showScreen('form');
