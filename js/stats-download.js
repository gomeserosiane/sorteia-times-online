// Gera uma imagem PNG da tabela de estatisticas atual usando canvas.
function downloadStatsTableImage() {
  const rankedTeams = getRankedTeams();
  const headers = ['Pos', 'Time', 'PTS', 'V', 'E', 'D', 'GM', 'GS', 'Obs'];
  const rows = rankedTeams.map(({ team, stats }, index) => [
    `${index + 1}\u00ba`,
    team.name,
    String(getTeamPoints(stats)),
    String(stats.wins),
    String(stats.draws),
    String(stats.losses),
    String(stats.goalsFor),
    String(stats.goalsAgainst),
    getStatsNotesText(stats)
  ]);
  const canvas = buildStatsCanvas(headers, rows);

  canvas.toBlob(blob => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'estatisticas-por-time.png';
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function buildStatsCanvas(headers, rows) {
  const scale = window.devicePixelRatio || 1;
  const columnWidths = [72, 230, 78, 62, 62, 62, 72, 72, 330];
  const rowHeight = 58;
  const headerHeight = 64;
  const titleHeight = 76;
  const padding = 28;
  const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
  const width = tableWidth + (padding * 2);
  const height = titleHeight + headerHeight + (rows.length * rowHeight) + padding;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.scale(scale, scale);

  drawStatsCanvasBackground(context, width, height);
  drawStatsCanvasTitle(context, padding);
  drawStatsCanvasHeader(context, headers, columnWidths, padding, titleHeight, headerHeight);
  drawStatsCanvasRows(context, rows, columnWidths, padding, titleHeight + headerHeight, rowHeight);

  return canvas;
}

function drawStatsCanvasBackground(context, width, height) {
  context.fillStyle = '#f8fff6';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#39ff14';
  context.lineWidth = 2;
  context.strokeRect(14, 14, width - 28, height - 28);
}

function drawStatsCanvasTitle(context, padding) {
  context.fillStyle = '#128a00';
  context.font = '800 26px Inter, Arial, sans-serif';
  context.fillText('Estatisticas por time', padding, 46);
}

function drawStatsCanvasHeader(context, headers, columnWidths, padding, top, height) {
  let x = padding;

  context.fillStyle = '#ecffe8';
  context.fillRect(padding, top, columnWidths.reduce((sum, width) => sum + width, 0), height);
  headers.forEach((header, index) => {
    drawStatsCell(context, header, x, top, columnWidths[index], height, {
      color: '#128a00',
      font: '800 15px Inter, Arial, sans-serif'
    });
    x += columnWidths[index];
  });
}

function drawStatsCanvasRows(context, rows, columnWidths, padding, top, rowHeight) {
  rows.forEach((row, rowIndex) => {
    let x = padding;
    const y = top + (rowIndex * rowHeight);

    context.fillStyle = rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc';
    context.fillRect(padding, y, columnWidths.reduce((sum, width) => sum + width, 0), rowHeight);
    row.forEach((value, columnIndex) => {
      drawStatsCell(context, value, x, y, columnWidths[columnIndex], rowHeight, {
        color: getStatsCellColor(columnIndex, value),
        font: columnIndex === 0 || columnIndex === 2 ? '800 15px Inter, Arial, sans-serif' : '650 14px Inter, Arial, sans-serif'
      });
      x += columnWidths[columnIndex];
    });
  });
}

function drawStatsCell(context, value, x, y, width, height, options) {
  context.strokeStyle = '#bbf7d0';
  context.lineWidth = 1;
  context.strokeRect(x, y, width, height);
  context.fillStyle = options.color;
  context.font = options.font;
  context.textBaseline = 'middle';
  context.fillText(truncateCanvasText(context, value || '-', width - 20), x + 10, y + (height / 2));
}

function truncateCanvasText(context, text, maxWidth) {
  const cleanText = String(text);
  if (context.measureText(cleanText).width <= maxWidth) return cleanText;

  let truncated = cleanText;
  while (truncated.length > 1 && context.measureText(`${truncated}...`).width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }

  return `${truncated}...`;
}

function getStatsNotesText(stats) {
  const notes = [];

  if (stats.tieBreakWins) notes.push(`${stats.tieBreakWins} vitoria(s) no par ou impar`);
  if (stats.tieBreakLosses) notes.push(`${stats.tieBreakLosses} derrota(s) no par ou impar`);

  return notes.join(' | ') || '-';
}

function getStatsCellColor(columnIndex, value) {
  if (columnIndex === 8 && String(value).includes('derrota')) return '#dc2626';
  if (columnIndex === 8 && String(value).includes('vitoria')) return '#15803d';
  if (columnIndex === 0 || columnIndex === 2) return '#128a00';

  return '#0f172a';
}
