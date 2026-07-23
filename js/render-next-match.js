// Renderiza o container de previa da proxima partida.
function renderNextMatchPanel() {
  return `
    <section class="support-panel queue-panel">
      <span class="panel-kicker">Proxima partida</span>
      ${renderNextMatchPreview()}
    </section>
  `;
}

function renderNextMatchPreview() {
  if (matchState.allTeams.length === 4) {
    return renderFourTeamNextMatchPreview();
  }

  const currentNumber = matchState.currentMatch?.number || 1;
  const thirdTeam = matchState.waitingTeams[0];

  if (currentNumber === 1 && thirdTeam) {
    return `
      <div class="queue-item">
        <strong>${escapeHtml(thirdTeam.name)} x (vencedor da partida 1)</strong>
      </div>
    `;
  }

  const previousLoser = matchState.results.find(result => result.number === currentNumber - 1)?.loser;

  if (previousLoser) {
    return `
      <div class="queue-item">
        <strong>${escapeHtml(previousLoser.name)} x vencedor da partida ${currentNumber}</strong>
      </div>
    `;
  }

  return `
    <div class="queue-item">
      <strong>perdedor da partida ${currentNumber} x vencedor da partida ${currentNumber}</strong>
    </div>
  `;
}

function renderFourTeamNextMatchPreview() {
  const currentNumber = matchState.currentMatch?.number || 1;
  const waitingTeam = matchState.waitingTeams[0];

  if (matchState.pendingTieMatch) {
    return `
      <div class="queue-item">
        <strong>vencedor da partida ${currentNumber} x ${escapeHtml(matchState.pendingTieMatch.winner.name)}</strong>
      </div>
    `;
  }

  if (waitingTeam) {
    return `
      <div class="queue-item">
        <strong>vencedor da partida ${currentNumber} x ${escapeHtml(waitingTeam.name)}</strong>
      </div>
    `;
  }

  const loserReference = Math.max(1, currentNumber - 2);

  return `
    <div class="queue-item">
      <strong>vencedor da partida ${currentNumber} x perdedor da partida ${loserReference}</strong>
    </div>
  `;
}
