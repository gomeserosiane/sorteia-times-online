const MATCH_DURATION_SECONDS = 7 * 60;

let timerInterval = null;
let matchState = createEmptyMatchState();

function createEmptyMatchState() {
  return {
    allTeams: [],
    currentMatchNumber: 1,
    currentMatch: null,
    waitingTeams: [],
    results: [],
    wins: {},
    stats: {},
    sortedTeamsOpen: false,
    matchDurationSeconds: MATCH_DURATION_SECONDS,
    timerSeconds: MATCH_DURATION_SECONDS,
    timerRunning: false,
    decisionOverlayOpen: false,
    decisionMode: 'winner',
    allowTie: true,
    selectedDecision: null,
    pendingWinnerSide: null,
    pendingTieScore: null,
    pendingWasTie: false,
    showTieBreaker: false
  };
}
