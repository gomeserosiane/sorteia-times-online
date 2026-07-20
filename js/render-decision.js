// Renderiza o alerta em tela cheia usado para confirmar encerramento e escolher vencedores.
function renderDecisionOverlay() {
  if (!matchState.decisionOverlayOpen || !matchState.currentMatch) {
    matchDecisionOverlay.classList.add('d-none');
    matchDecisionOverlay.innerHTML = '';
    return;
  }

  const { number, leftTeam, rightTeam } = matchState.currentMatch;
  const title = matchState.decisionMode === 'confirm-end'
    ? 'Tem certeza que vai encerrar a partida?'
    : 'Quem venceu a partida?';

  matchDecisionOverlay.innerHTML = `
    <section class="decision-modal" role="dialog" aria-modal="true" aria-labelledby="decisionTitle">
      <span class="panel-kicker">Partida ${number} encerrada</span>
      <h2 id="decisionTitle">${title}</h2>
      <p>${escapeHtml(leftTeam.name)} x ${escapeHtml(rightTeam.name)}</p>

      ${renderDecisionStep(leftTeam, rightTeam)}
      ${renderTieBreaker()}
    </section>
  `;

  matchDecisionOverlay.classList.remove('d-none');
  bindOverlayActions();
}

function renderDecisionStep(leftTeam, rightTeam) {
  if (matchState.decisionMode === 'confirm-end') {
    return `
      <div class="decision-actions modal-actions">
        <button type="button" class="btn decision-btn danger" data-action="confirm-end">Sim</button>
        <button type="button" class="btn decision-btn" data-action="cancel-end">Nao</button>
      </div>
    `;
  }

  return `
    <div class="decision-actions modal-actions">
      <button type="button" class="${getDecisionButtonClass('left')}" data-action="winner" data-team-side="left" data-winner-context="main">
        ${escapeHtml(leftTeam.name)}
      </button>
      ${matchState.allowTie ? `<button type="button" class="${getDecisionButtonClass('tie')}" data-action="tie">Empate</button>` : ''}
      <button type="button" class="${getDecisionButtonClass('right')}" data-action="winner" data-team-side="right" data-winner-context="main">
        ${escapeHtml(rightTeam.name)}
      </button>
    </div>
    ${renderScorePicker()}
  `;
}

function getDecisionButtonClass(option) {
  const classes = ['btn', 'decision-btn'];

  if (matchState.selectedDecision === option) {
    classes.push('selected');
  } else if (matchState.selectedDecision) {
    classes.push('muted');
  }

  return classes.join(' ');
}

function renderScorePicker() {
  if (matchState.decisionMode !== 'score') return '';

  const isTieScore = matchState.selectedDecision === 'tie';
  const scores = isTieScore ? ['0x0', '1x1'] : ['1x0', '2x0', '2x1'];

  return `
    <div class="score-picker-panel" aria-label="Escolher placar">
      <span class="panel-kicker">Placar</span>
      <h3>Qual foi o placar?</h3>
      <div class="decision-actions">
        ${scores.map(score => `
          <button type="button" class="${getScoreButtonClass(score)}" data-action="score" data-score="${score}">${score}</button>
        `).join('')}
      </div>
    </div>
  `;
}

function getScoreButtonClass(score) {
  const classes = ['btn', 'decision-btn', 'light'];

  if (matchState.pendingTieScore === score) {
    classes.push('selected');
  }

  return classes.join(' ');
}

function renderTieBreaker() {
  if (!matchState.showTieBreaker || !matchState.currentMatch) return '';

  const { leftTeam, rightTeam } = matchState.currentMatch;
  const disabled = matchState.pendingTieScore ? '' : 'disabled';

  return `
    <div class="tie-breaker-panel" aria-label="Desempate no par ou impar">
      <span class="panel-kicker">Desempate</span>
      <h3>Qual time ganhou o par ou impar?</h3>
      <div class="decision-actions">
        <button type="button" class="btn decision-btn light" data-action="winner" data-team-side="left" data-winner-context="tie" ${disabled}>${escapeHtml(leftTeam.name)}</button>
        <button type="button" class="btn decision-btn light" data-action="winner" data-team-side="right" data-winner-context="tie" ${disabled}>${escapeHtml(rightTeam.name)}</button>
      </div>
    </div>
  `;
}
