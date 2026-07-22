sortForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  sortError.classList.add('d-none');
  sortError.textContent = '';

  try {
    const teamCount = Number(document.getElementById('teamCount').value);
    const playersPerTeam = Number(document.getElementById('playersPerTeam').value);
    const matchDurationSeconds = Number(document.getElementById('matchDuration').value);
    const playerList = document.getElementById('playerList').value;

    if (!teamCount || !playersPerTeam || !matchDurationSeconds || !playerList.trim()) {
      throw new Error('Preencha todos os campos antes de enviar.');
    }

    const players = parsePlayers(playerList);
    const minimumPlayers = teamCount * playersPerTeam;

    if (players.length < minimumPlayers) {
      throw new Error(`Voce informou ${players.length} jogador(es), mas esse formato precisa de ${minimumPlayers}.`);
    }

    const teams = distributePlayers(players, teamCount, playersPerTeam);

    await playLoadingTransition();
    setupMatchFlow(teams, matchDurationSeconds);
    showScreen('result');
  } catch (error) {
    sortError.textContent = error.message || 'Nao foi possivel realizar o sorteio.';
    sortError.classList.remove('d-none');
  }
});

async function playLoadingTransition() {
  loadingOverlay.classList.remove('d-none');
  loadingOverlay.classList.remove('expand');
  await delay(900);
  loadingOverlay.classList.add('expand');
  await delay(500);
  loadingOverlay.classList.add('d-none');
  loadingOverlay.classList.remove('expand');
}

showScreen('form');
