// Conecta os botoes do alerta de decisao as regras de vencedor, empate e placar.
function bindOverlayActions() {
  matchDecisionOverlay.querySelectorAll('[data-action="confirm-end"]').forEach(button => {
    button.addEventListener('click', () => {
      matchState.decisionMode = 'winner';
      matchState.allowTie = false;
      renderDecisionOverlay();
    });
  });

  matchDecisionOverlay.querySelectorAll('[data-action="cancel-end"]').forEach(button => {
    button.addEventListener('click', () => {
      matchState.decisionOverlayOpen = false;
      matchState.decisionMode = 'winner';
      matchState.allowTie = true;
      matchState.selectedDecision = null;
      matchState.pendingWinnerSide = null;
      matchState.pendingTieScore = null;
      matchState.pendingWasTie = false;
      renderMatchFlow();
    });
  });

  matchDecisionOverlay.querySelectorAll('[data-action="tie"]').forEach(button => {
    button.addEventListener('click', () => {
      const shouldCloseTieBreaker = matchState.selectedDecision === 'tie' && matchState.showTieBreaker;

      matchState.selectedDecision = shouldCloseTieBreaker ? null : 'tie';
      matchState.showTieBreaker = !shouldCloseTieBreaker;
      matchState.decisionMode = shouldCloseTieBreaker ? 'winner' : 'score';
      matchState.pendingWinnerSide = null;
      matchState.pendingTieScore = null;
      matchState.pendingWasTie = false;
      renderDecisionOverlay();
    });
  });

  matchDecisionOverlay.querySelectorAll('[data-action="winner"]').forEach(button => {
    button.addEventListener('click', () => {
      selectWinner(button.dataset.teamSide, button.dataset.winnerContext || 'main');
    });
  });

  matchDecisionOverlay.querySelectorAll('[data-action="score"]').forEach(button => {
    button.addEventListener('click', () => {
      if (matchState.selectedDecision === 'tie') {
        matchState.pendingTieScore = button.dataset.score;
        renderDecisionOverlay();
        return;
      }

      finishCurrentMatch(matchState.pendingWinnerSide, button.dataset.score);
    });
  });
}

function selectWinner(winnerSide, context = 'main') {
  const isTieBreakerSelection = context === 'tie';
  const selectedOption = isTieBreakerSelection ? 'tie' : winnerSide;

  if (isTieBreakerSelection) {
    if (!matchState.pendingTieScore) return;
    finishCurrentMatch(winnerSide, matchState.pendingTieScore, true);
    return;
  }

  const shouldCloseScorePicker = matchState.selectedDecision === selectedOption && matchState.decisionMode === 'score';

  if (shouldCloseScorePicker) {
    matchState.selectedDecision = null;
    matchState.pendingWinnerSide = null;
    matchState.pendingTieScore = null;
    matchState.pendingWasTie = false;
    matchState.decisionMode = 'winner';
    renderDecisionOverlay();
    return;
  }

  matchState.selectedDecision = selectedOption;
  matchState.pendingWinnerSide = winnerSide;
  matchState.pendingTieScore = null;
  matchState.pendingWasTie = isTieBreakerSelection;
  matchState.decisionMode = 'score';
  matchState.showTieBreaker = false;
  renderDecisionOverlay();
}
