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
