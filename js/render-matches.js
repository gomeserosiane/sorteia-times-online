// Renderiza os cards de partidas atuais e encerradas.
function renderMatchesTimeline() {
  return `
    <section class="matches-timeline" aria-label="Partidas">
      ${matchState.results.map(renderCompletedMatchCard).join('')}
      ${renderCurrentMatch()}
    </section>
  `;
}

function renderCompletedMatchCard(result) {
  return `
    <article class="match-card completed-match" aria-label="Partida ${result.number} encerrada">
      <div class="match-heading">
        <span>Partida ${result.number}</span>
        <strong>Partida encerrada</strong>
      </div>

      <div class="final-result">
        ${result.wasTie ? renderTieResult(result) : renderScoreResult(result)}
      </div>
    </article>
  `;
}

function renderScoreResult(result) {
  const [winnerGoals, loserGoals] = result.score.split('x');
  const leftWon = result.winner.id === result.leftTeam.id;
  const leftGoals = leftWon ? winnerGoals : loserGoals;
  const rightGoals = leftWon ? loserGoals : winnerGoals;

  return `
    <div class="scoreline">
      <span class="${leftWon ? 'score-team winner' : 'score-team loser'}">
        ${escapeHtml(result.leftTeam.name)} <strong>(${leftGoals})</strong>
      </span>
      <span class="score-separator">x</span>
      <span class="${leftWon ? 'score-team loser' : 'score-team winner'}">
        <strong>(${rightGoals})</strong> ${escapeHtml(result.rightTeam.name)}
      </span>
    </div>
  `;
}

function renderTieResult(result) {
  const [leftGoals, rightGoals] = result.score.split('x');

  return `
    <div class="tie-result">
      <strong>Partida empatada entre ${escapeHtml(result.leftTeam.name)} (${escapeHtml(leftGoals)}) x (${escapeHtml(rightGoals)}) ${escapeHtml(result.rightTeam.name)}</strong>
      <span>${escapeHtml(result.winner.name)} venceu no par ou impar.</span>
    </div>
  `;
}

function renderCurrentMatch() {
  if (!matchState.currentMatch) return '';

  const { number, leftTeam, rightTeam } = matchState.currentMatch;

  return `
    <article class="match-card current-match" aria-label="Partida atual">
      <div class="match-heading">
        <span>Partida ${number}</span>
        <strong>${escapeHtml(leftTeam.name)} x ${escapeHtml(rightTeam.name)}</strong>
      </div>

      <div class="matchup-grid">
        ${renderTeamColumn(leftTeam, 'left')}
        <div class="match-divider" aria-hidden="true"></div>
        ${renderTeamColumn(rightTeam, 'right')}
      </div>
    </article>
  `;
}

function renderTeamColumn(team, side) {
  return `
    <article class="match-team match-team-${side}">
      <div class="team-content ${side === 'left' ? 'text-end' : ''}">
        <h3>${escapeHtml(team.name)}</h3>
        <ul class="match-player-list">
          ${renderPlayerList(team.players, side)}
        </ul>
      </div>
    </article>
  `;
}

function renderPlayerList(players, side) {
  return players
    .map(player => `
      <li class="${side === 'left' ? 'player-left' : 'player-right'}">
        ${renderShirtIcon(`Camisa do jogador ${escapeHtml(player)}`, 'player-shirt-icon')}
        <strong>${escapeHtml(player)}</strong>
      </li>
    `)
    .join('');
}

function renderShirtIcon(label, className) {
  return `
    <svg class="${className}" viewBox="0 0 64 64" role="img" aria-label="${label}" focusable="false">
      <path d="M23 8h18l5 6 11 5-6 12-7-3v28H20V28l-7 3-6-12 11-5 5-6Z" fill="currentColor"/>
      <path d="M24 9c1.8 4.2 4.4 6.2 8 6.2s6.2-2 8-6.2" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `;
}
