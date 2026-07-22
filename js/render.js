// Monta a tela de partidas juntando os containers renderizados em arquivos separados.
function renderMatchFlow() {
  teamsContainer.innerHTML = `
    ${renderTimer()}
    ${renderCurrentMatchSection()}
    ${renderNextMatchPanel()}
    ${renderCompletedMatchesPanel()}
    ${renderStatsTable()}
    ${renderSortedTeamsFaq()}
  `;

  renderDecisionOverlay();
  bindMatchActions();
}
