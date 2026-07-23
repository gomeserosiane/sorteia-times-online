const MATCH_DURATION_SECONDS = 7 * 60;

let timerInterval = null;
let matchState = createEmptyMatchState();

function createEmptyMatchState() {
  return {
    allTeams: [],
    currentMatchNumber: 1,
    currentMatch: null,
    waitingTeams: [],
    loserQueue: [],
    pendingTieMatch: null,
    results: [],
    wins: {},
    stats: {},
    sortedTeamsOpen: false,
    timerSeconds: MATCH_DURATION_SECONDS,
    timerRunning: false,
    decisionOverlayOpen: false,
    decisionMode: 'winner',
    allowTie: true,
    selectedDecision: null,
    pendingWinnerSide: null,
    pendingScore: null,
    pendingTieScore: null,
    pendingTieBreakerSide: null,
    pendingWasTie: false,
    showTieBreaker: false
  };
}
