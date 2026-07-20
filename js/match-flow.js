// Controla a criacao das partidas, resultados e estatisticas do fluxo principal.
function setupMatchFlow(teams) {
  const teamModels = buildTeamModels(teams);

  stopTimer();
  matchState = createEmptyMatchState();
  matchState.allTeams = teamModels;
  matchState.wins = teamModels.reduce((wins, team) => {
    wins[team.id] = 0;
    return wins;
  }, {});
  matchState.stats = teamModels.reduce((stats, team) => {
    stats[team.id] = createTeamStats();
    return stats;
  }, {});
  matchState.currentMatch = {
    number: 1,
    leftTeam: teamModels[0],
    rightTeam: teamModels[1]
  };
  matchState.waitingTeams = teamModels.slice(2);
  renderMatchFlow();
}

function createTeamStats() {
  return {
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    tieBreakWins: 0,
    tieBreakLosses: 0
  };
}

function finishCurrentMatch(winnerSide, score, wasTie = false) {
  const { number, leftTeam, rightTeam } = matchState.currentMatch;
  const winner = winnerSide === 'left' ? leftTeam : rightTeam;
  const loser = winnerSide === 'left' ? rightTeam : leftTeam;

  stopTimer();
  matchState.wins[winner.id] = (matchState.wins[winner.id] || 0) + 1;
  updateTeamStats({ leftTeam, rightTeam, winner, loser, winnerSide, score, wasTie });
  matchState.results.push({
    number,
    leftTeam,
    rightTeam,
    winner,
    loser,
    score,
    wasTie
  });

  matchState.currentMatchNumber += 1;
  matchState.currentMatch = {
    number: matchState.currentMatchNumber,
    leftTeam: getNextOpponent(number, loser),
    rightTeam: winner
  };
  matchState.decisionOverlayOpen = false;
  matchState.decisionMode = 'winner';
  matchState.allowTie = true;
  matchState.selectedDecision = null;
  matchState.pendingWinnerSide = null;
  matchState.pendingTieScore = null;
  matchState.pendingWasTie = false;
  matchState.showTieBreaker = false;
  resetTimer();
  renderMatchFlow();
}

function updateTeamStats({ leftTeam, rightTeam, winner, loser, winnerSide, score, wasTie }) {
  const [firstGoals, secondGoals] = score.split('x').map(Number);
  const leftGoals = wasTie ? firstGoals : winnerSide === 'left' ? firstGoals : secondGoals;
  const rightGoals = wasTie ? secondGoals : winnerSide === 'right' ? firstGoals : secondGoals;

  matchState.stats[leftTeam.id].goalsFor += leftGoals;
  matchState.stats[leftTeam.id].goalsAgainst += rightGoals;
  matchState.stats[rightTeam.id].goalsFor += rightGoals;
  matchState.stats[rightTeam.id].goalsAgainst += leftGoals;

  if (wasTie) {
    matchState.stats[leftTeam.id].draws += 1;
    matchState.stats[rightTeam.id].draws += 1;
    matchState.stats[winner.id].tieBreakWins += 1;
    matchState.stats[loser.id].tieBreakLosses += 1;
    return;
  }

  matchState.stats[winner.id].wins += 1;
  matchState.stats[loser.id].losses += 1;
}

function getNextOpponent(finishedMatchNumber, loser) {
  if (finishedMatchNumber === 1 && matchState.waitingTeams.length) {
    return matchState.waitingTeams.shift();
  }

  const previousResult = matchState.results.find(result => result.number === finishedMatchNumber - 1);
  return previousResult?.loser || loser;
}
