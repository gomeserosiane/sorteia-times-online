// Renderiza o container do cronometro e seus botoes de controle.
function renderTimer() {
  const isFinished = matchState.timerSeconds === 0;
  const status = isFinished
    ? 'Tempo encerrado'
    : matchState.timerRunning
      ? 'Cronometro em andamento'
      : 'Aguardando inicio';

  return `
    <section class="match-timer" aria-label="Cronometro da partida">
      <div class="timer-copy">
        <span class="timer-label">Tempo da partida</span>
        <div class="timer-display-card">
          <span class="timer-glow" aria-hidden="true"></span>
          <strong class="timer-display">${formatTimer(matchState.timerSeconds)}</strong>
        </div>
      </div>
      <div class="timer-actions">
        <span class="timer-status">${status}</span>
        <button type="button" class="btn timer-btn" data-action="start-timer" ${matchState.timerRunning || isFinished ? 'disabled' : ''}>
          Iniciar
        </button>
        <button type="button" class="btn timer-btn ghost" data-action="pause-timer" ${!matchState.timerRunning ? 'disabled' : ''}>Pausar</button>
        <button type="button" class="btn timer-btn danger" data-action="end-match">Encerrar partida</button>
      </div>
    </section>
  `;
}
