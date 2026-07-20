// Renderiza o FAQ com os times sorteados originalmente.
function renderSortedTeamsFaq() {
  return `
    <section class="support-panel sorted-teams-panel">
      <div class="faq-heading">
        <div>
          <span class="panel-kicker">Times sorteados</span>
          <h3>Verificar os times que foram sorteados</h3>
        </div>
        <button type="button" class="btn faq-toggle-btn" data-action="toggle-sorted-teams">
          ${matchState.sortedTeamsOpen ? 'Ocultar times' : 'Ver times'}
        </button>
      </div>

      ${matchState.sortedTeamsOpen ? `
        <div class="sorted-teams-grid">
          ${matchState.allTeams.map(team => `
            <article class="sorted-team-card">
              <h4>${escapeHtml(team.name)}</h4>
              <ul class="compact-player-list">
                ${renderPlayerList(team.players, 'right')}
              </ul>
            </article>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `;
}
