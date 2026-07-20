// Renderiza a tabela de estatisticas acumuladas por time.
function renderStatsTable() {
  const rankedTeams = getRankedTeams();

  return `
    <section class="support-panel stats-panel">
      <span class="panel-kicker">Estatisticas por time</span>
      <div class="stats-table-wrap">
        <table class="stats-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>PTS</th>
              <th>V</th>
              <th>E</th>
              <th>D</th>
              <th>GM</th>
              <th>GS</th>
              <th>Obs</th>
            </tr>
          </thead>
          <tbody>
            ${rankedTeams.map(({ team, stats }, index) => renderStatsRow(team, stats, index + 1)).join('')}
          </tbody>
        </table>
      </div>
      <button type="button" class="btn stats-download-btn" data-action="download-stats-table">
        Baixar tabela
      </button>
    </section>
  `;
}

function renderStatsRow(team, stats, position) {
  const notes = renderStatsNotes(stats);

  return `
    <tr>
      <td>
        <span class="team-rank">${position}&deg;</span>
        ${escapeHtml(team.name)}
      </td>
      <td>${getTeamPoints(stats)}</td>
      <td>${stats.wins}</td>
      <td>${stats.draws}</td>
      <td>${stats.losses}</td>
      <td>${stats.goalsFor}</td>
      <td>${stats.goalsAgainst}</td>
      <td>${notes || '-'}</td>
    </tr>
  `;
}

function getRankedTeams() {
  return matchState.allTeams
    .map(team => ({
      team,
      stats: getTeamStats(team)
    }))
    .sort((a, b) => {
      const pointDiff = getTeamPoints(b.stats) - getTeamPoints(a.stats);
      if (pointDiff) return pointDiff;

      const winDiff = b.stats.wins - a.stats.wins;
      if (winDiff) return winDiff;

      const goalBalanceDiff = getGoalBalance(b.stats) - getGoalBalance(a.stats);
      if (goalBalanceDiff) return goalBalanceDiff;

      const goalsForDiff = b.stats.goalsFor - a.stats.goalsFor;
      if (goalsForDiff) return goalsForDiff;

      return a.team.name.localeCompare(b.team.name, 'pt-BR');
    });
}

function getTeamStats(team) {
  return matchState.stats[team.id] || {
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    tieBreakWins: 0,
    tieBreakLosses: 0
  };
}

function getTeamPoints(stats) {
  return (stats.wins * 3) + stats.draws;
}

function getGoalBalance(stats) {
  return stats.goalsFor - stats.goalsAgainst;
}

function renderStatsNotes(stats) {
  const notes = [];

  if (stats.tieBreakWins) {
    notes.push(`<span class="stats-note win-note">${stats.tieBreakWins} vitoria(s) no par ou impar</span>`);
  }

  if (stats.tieBreakLosses) {
    notes.push(`<span class="stats-note loss-note">${stats.tieBreakLosses} derrota(s) no par ou impar</span>`);
  }

  return notes.join('');
}
