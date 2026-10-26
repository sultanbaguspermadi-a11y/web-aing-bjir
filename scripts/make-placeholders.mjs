// Generates the two stand-in artworks in public/projects/.
// Replace them with real screenshots (see README) and delete this script if you like.
import { writeFileSync } from "node:fs";

const INK = "#121211";
const PAPER = "#FBFAF6";
const SOFT = "#E8E4D8";

// ---------------- Lughoti Vokasi: 1600 x 940, blue accent ----------------
function lughoti() {
  const A = "#8ECDF4";
  const bars = (x, y, widths, h = 10, gap = 22, fill = INK, op = 0.75) =>
    widths.map((w, i) => `<rect x="${x}" y="${y + i * gap}" width="${w}" height="${h}" rx="2" fill="${fill}" opacity="${op}"/>`).join("");
  const card = (x) => `
    <g>
      <rect x="${x}" y="560" width="318" height="270" rx="6" fill="#fff" stroke="${INK}" stroke-opacity=".14"/>
      <rect x="${x + 24}" y="584" width="64" height="64" rx="32" fill="${A}"/>
      ${bars(x + 24, 678, [210, 250, 160], 10, 24, INK, 0.7)}
      <rect x="${x + 24}" y="772" width="270" height="6" rx="3" fill="${INK}" opacity=".12"/>
      <rect x="${x + 24}" y="772" width="${120 + (x % 90)}" height="6" rx="3" fill="${A}"/>
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 940" width="1600" height="940">
  <rect width="1600" height="940" fill="${SOFT}"/>
  <rect x="60" y="50" width="1480" height="840" rx="10" fill="${PAPER}" stroke="${INK}" stroke-opacity=".18"/>
  <rect x="60" y="50" width="1480" height="56" rx="10" fill="#EDEAE0"/>
  <rect x="60" y="96" width="1480" height="10" fill="#EDEAE0"/>
  <circle cx="92" cy="78" r="7" fill="${INK}" opacity=".25"/><circle cx="116" cy="78" r="7" fill="${INK}" opacity=".25"/><circle cx="140" cy="78" r="7" fill="${INK}" opacity=".25"/>
  <rect x="520" y="66" width="560" height="24" rx="12" fill="#fff" stroke="${INK}" stroke-opacity=".12"/>
  <rect x="60" y="106" width="270" height="784" fill="#F4F1E9"/>
  <rect x="90" y="140" width="120" height="14" rx="3" fill="${INK}" opacity=".85"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="90" y="${210 + i * 56}" width="${i === 1 ? 190 : 150 + (i % 3) * 14}" height="34" rx="4" fill="${i === 1 ? A : "transparent"}" ${i === 1 ? "" : `stroke="${INK}" stroke-opacity=".12"`}/>`).join("")}
  <rect x="390" y="150" width="1090" height="340" rx="8" fill="${A}"/>
  ${bars(440, 200, [420, 520, 360], 18, 44, INK, 0.9)}
  <rect x="440" y="360" width="190" height="46" rx="3" fill="${INK}"/>
  <g opacity=".9">
    <circle cx="1270" cy="320" r="120" fill="none" stroke="${INK}" stroke-width="2"/>
    <circle cx="1270" cy="320" r="78" fill="none" stroke="${INK}" stroke-width="2" opacity=".55"/>
    <path d="M1210 330c20-50 40-50 60 0s40 50 60 0" fill="none" stroke="${INK}" stroke-width="3"/>
  </g>
  ${card(390)}${card(740)}${card(1090)}
</svg>`;
}

// ---------------- Arabic Scrabble: 1200 x 960, gold accent ----------------
function scrabble() {
  const GOLD = "#E9B44C";
  const N = 15, C = 46, X0 = 90, Y0 = 70;
  const premium = {
    tw: [[0, 0], [0, 7], [0, 14], [7, 0], [7, 14], [14, 0], [14, 7], [14, 14]],
    dw: [[1, 1], [2, 2], [3, 3], [4, 4], [10, 10], [11, 11], [12, 12], [13, 13], [1, 13], [2, 12], [3, 11], [4, 10], [10, 4], [11, 3], [12, 2], [13, 1]],
    tl: [[1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [5, 13], [9, 1], [9, 5], [9, 9], [9, 13], [13, 5], [13, 9]],
  };
  const color = { tw: "#E3A59A", dw: "#F0CDC4", tl: "#9CC3DE" };
  const kind = (r, c) => Object.keys(premium).find((k) => premium[k].some(([a, b]) => a === r && b === c));
  let cells = "";
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const k = kind(r, c) || (r === 7 && c === 7 ? "dw" : null);
    cells += `<rect x="${X0 + c * C}" y="${Y0 + r * C}" width="${C}" height="${C}" fill="${k ? color[k] : "#F6F2E6"}" stroke="${INK}" stroke-opacity=".14"/>`;
  }
  // Tiles laid out like a crossword. Shapes only: no letters, no gameplay.
  const placed = [[7,4],[7,5],[7,6],[7,7],[7,8],[7,9],[4,6],[5,6],[6,6],[8,6],[9,6],[10,6],[4,7],[4,8],[4,9],[9,8],[10,8],[11,8],[9,9],[9,10],[9,11]];
  const tiles = placed.map(([r, c]) => {
    const x = X0 + c * C + 3, y = Y0 + r * C + 3, s = C - 6;
    return `<g><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="3" fill="${GOLD}" stroke="${INK}" stroke-opacity=".7"/><path d="M${x + 12} ${y + 28}q6-18 12-6t10-14" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`;
  }).join("");
  const rack = [0, 1, 2, 3, 4, 5, 6].map((i) => `<g><rect x="${220 + i * 68}" y="${Y0 + N * C + 28}" width="58" height="58" rx="4" fill="${GOLD}" stroke="${INK}" stroke-opacity=".7"/><path d="M${232 + i * 68} ${Y0 + N * C + 62}q8-22 16-8t14-18" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/></g>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 960" width="1200" height="960">
  <rect width="1200" height="960" fill="${SOFT}"/>
  <g transform="rotate(0)">
    <rect x="60" y="40" width="${N * C + 60}" height="${N * C + 180}" rx="10" fill="${PAPER}" stroke="${INK}" stroke-opacity=".18"/>
    ${cells}${tiles}${rack}
  </g>
  <rect x="${X0 + N * C + 50}" y="70" width="160" height="${N * C}" rx="6" fill="#F4F1E9" stroke="${INK}" stroke-opacity=".12" transform="translate(0 0)"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="${X0 + N * C + 70}" y="${110 + i * 90}" width="120" height="10" rx="2" fill="${INK}" opacity=".7"/><rect x="${X0 + N * C + 70}" y="${132 + i * 90}" width="${70 + i * 10}" height="22" rx="2" fill="${GOLD}"/>`).join("")}
</svg>`;
}

writeFileSync("public/projects/lughoti-vokasi.svg", lughoti());
writeFileSync("public/projects/arabic-scrabble.svg", scrabble());
console.log("placeholders written");
