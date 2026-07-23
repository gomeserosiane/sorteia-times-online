// Controla o cronometro da partida e a abertura do alerta ao fim do tempo.
function startTimer() {
  if (timerInterval || matchState.timerSeconds === 0) return;

  matchState.timerRunning = true;
  renderMatchFlow();

  timerInterval = setInterval(() => {
    matchState.timerSeconds -= 1;

    if (matchState.timerSeconds <= 0) {
      matchState.timerSeconds = 0;
      stopTimer();
      matchState.decisionOverlayOpen = true;
      matchState.decisionMode = 'winner';
      matchState.allowTie = true;
      matchState.selectedDecision = null;
      matchState.pendingScore = null;
      matchState.pendingTieScore = null;
      matchState.pendingTieBreakerSide = null;
      renderMatchFlow();
      return;
    }

    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  stopTimer();
  renderMatchFlow();
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  matchState.timerRunning = false;
}

function resetTimer() {
  stopTimer();
  matchState.timerSeconds = matchState.matchDurationSeconds || MATCH_DURATION_SECONDS;
  matchState.decisionOverlayOpen = false;
  matchState.decisionMode = 'winner';
  matchState.allowTie = true;
  matchState.selectedDecision = null;
  matchState.pendingWinnerSide = null;
  matchState.pendingScore = null;
  matchState.pendingTieScore = null;
  matchState.pendingTieBreakerSide = null;
  matchState.pendingWasTie = false;
  matchState.showTieBreaker = false;
}

function requestEndMatch() {
  stopTimer();
  matchState.decisionOverlayOpen = true;
  matchState.decisionMode = 'confirm-end';
  matchState.allowTie = false;
  matchState.selectedDecision = null;
  matchState.pendingWinnerSide = null;
  matchState.pendingScore = null;
  matchState.pendingTieScore = null;
  matchState.pendingTieBreakerSide = null;
  matchState.pendingWasTie = false;
  matchState.showTieBreaker = false;
  renderMatchFlow();
}

function updateTimerDisplay() {
  const display = teamsContainer.querySelector('.timer-display');
  const status = teamsContainer.querySelector('.timer-status');

  if (display) display.textContent = formatTimer(matchState.timerSeconds);
  if (status) status.textContent = 'Cronometro em andamento';
}
