// Controla a criacao das partidas, resultados e estatisticas do fluxo principal.
function setupMatchFlow(teams, matchDurationSeconds = MATCH_DURATION_SECONDS) {
  const teamModels = buildTeamModels(teams);

  stopTimer();
  matchState = createEmptyMatchState();
  matchState.matchDurationSeconds = matchDurationSeconds;
  matchState.timerSeconds = matchDurationSeconds;
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
  matchState.loserQueue = [];
  matchState.pendingTieMatch = null;
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
  matchState.currentMatch = getNextMatch({ number, leftTeam, rightTeam, winner, loser, wasTie });
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

function getNextMatch(result) {
  if (matchState.allTeams.length === 4) {
    return getNextFourTeamMatch(result);
  }

  return {
    number: matchState.currentMatchNumber,
    leftTeam: getNextOpponent(result.number, result.loser),
    rightTeam: result.winner
  };
}

function getNextFourTeamMatch({ leftTeam, rightTeam, winner, loser, wasTie }) {
  if (wasTie) {
    addUniqueTeamToQueue(loser);

    const previousTieTeams = matchState.pendingTieMatch?.teams || [];
    const nextPair = previousTieTeams.length === 2
      ? previousTieTeams
      : getTeamsWaitingOutsideMatch(leftTeam, rightTeam);

    matchState.pendingTieMatch = {
      winner,
      teams: [leftTeam, rightTeam]
    };
    removeTeamsFromQueue(nextPair);

    return createNextMatch(nextPair[0] || winner, nextPair[1] || getNextQueuedOpponent(winner));
  }

  addUniqueTeamToQueue(loser);

  if (matchState.pendingTieMatch) {
    const pendingWinner = matchState.pendingTieMatch.winner;
    matchState.pendingTieMatch = null;
    removeTeamsFromQueue([winner, pendingWinner]);
    return createNextMatch(winner, pendingWinner);
  }

  if (matchState.waitingTeams.length) {
    return createNextMatch(winner, matchState.waitingTeams.shift());
  }

  return createNextMatch(winner, getNextQueuedOpponent(winner));
}

function createNextMatch(leftTeam, rightTeam) {
  return {
    number: matchState.currentMatchNumber,
    leftTeam,
    rightTeam
  };
}

function getTeamsWaitingOutsideMatch(leftTeam, rightTeam) {
  const currentIds = new Set([leftTeam.id, rightTeam.id]);
  const waitingPair = matchState.waitingTeams.filter(team => !currentIds.has(team.id));

  if (waitingPair.length >= 2) {
    matchState.waitingTeams = matchState.waitingTeams.filter(team => !waitingPair.slice(0, 2).includes(team));
    return waitingPair.slice(0, 2);
  }

  return matchState.allTeams.filter(team => !currentIds.has(team.id)).slice(0, 2);
}

function addUniqueTeamToQueue(team) {
  if (!team || matchState.loserQueue.some(queuedTeam => queuedTeam.id === team.id)) return;
  matchState.loserQueue.push(team);
}

function removeTeamsFromQueue(teams) {
  const idsToRemove = new Set(teams.filter(Boolean).map(team => team.id));
  matchState.loserQueue = matchState.loserQueue.filter(team => !idsToRemove.has(team.id));
}

function getNextQueuedOpponent(currentWinner) {
  const opponentIndex = matchState.loserQueue.findIndex(team => team.id !== currentWinner.id);

  if (opponentIndex >= 0) {
    return matchState.loserQueue.splice(opponentIndex, 1)[0];
  }

  return matchState.allTeams.find(team => team.id !== currentWinner.id) || currentWinner;
}

function getNextOpponent(finishedMatchNumber, loser) {
  if (finishedMatchNumber === 1 && matchState.waitingTeams.length) {
    return matchState.waitingTeams.shift();
  }

  const previousResult = matchState.results.find(result => result.number === finishedMatchNumber - 1);
  return previousResult?.loser || loser;
}
