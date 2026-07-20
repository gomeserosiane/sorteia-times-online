// Monta a tela de partidas juntando os containers renderizados em arquivos separados.
function renderMatchFlow() {
  teamsContainer.innerHTML = `
    ${renderTimer()}
    ${renderMatchesTimeline()}
    ${renderNextMatchPanel()}
    ${renderStatsTable()}
    ${renderSortedTeamsFaq()}
  `;

  renderDecisionOverlay();
  bindMatchActions();
}
