// Conecta os botoes presentes nos containers da tela de partidas.
function bindMatchActions() {
  teamsContainer.querySelectorAll('[data-action="start-timer"]').forEach(button => {
    button.addEventListener('click', startTimer);
  });

  teamsContainer.querySelectorAll('[data-action="pause-timer"]').forEach(button => {
    button.addEventListener('click', pauseTimer);
  });

  teamsContainer.querySelectorAll('[data-action="end-match"]').forEach(button => {
    button.addEventListener('click', requestEndMatch);
  });

  teamsContainer.querySelectorAll('[data-action="toggle-sorted-teams"]').forEach(button => {
    button.addEventListener('click', () => {
      matchState.sortedTeamsOpen = !matchState.sortedTeamsOpen;
      renderMatchFlow();
    });
  });

  teamsContainer.querySelectorAll('[data-action="download-stats-table"]').forEach(button => {
    button.addEventListener('click', downloadStatsTableImage);
  });
}
