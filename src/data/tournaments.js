
export const tournaments = [
  {
    id: 1,
    title: "Level Up Valorant Cup",
    game: "Valorant",
    image: "valorant.png",
    date: "15-12-2026",
    registered: 8,
    maxParticipants: 16,
    status: "Inscripciones abiertas",
    description:
      "Compite con otros jugadores y demuestra tus habilidades en este campeonato.",
  },
  {
    id: 2,
    title: "Mario Kart Championship",
    game: "Mario Kart",
    image: "mariokart.png",
    date: "20-12-2026",
    registered: 5,
    maxParticipants: 12,
    status: "Inscripciones abiertas",
    description:
      "Compite en emocionantes carreras y demuestra quién es el mejor piloto.",
  },
];

const TOURNAMENTS_KEY = "levelup.tournaments.v1";
export function getTournaments() {
  try { return JSON.parse(localStorage.getItem(TOURNAMENTS_KEY)) || tournaments; } catch { return tournaments; }
}
export function formatTournamentDate(value) {
  if (!value) return "Fecha por confirmar";
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [year, month, day] = text.split("-");
    return `${day}-${month}-${year}`;
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(text)) return text;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return text;
  return new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(parsed).replaceAll("/", "-");
}
export function createTournament({ title, game, mode, maxParticipants, date, image }) {
  const players = ["Shadow", "DarkWolf", "Phoenix", "Nexus", "Zero", "Viper", "Ghost", "Reaper"].sort(() => Math.random() - 0.5).slice(0, Number(maxParticipants));
  const matches = [];
  for (let i = 0; i < players.length; i += 2) matches.push({ playerOne: players[i], playerTwo: players[i + 1] || "BYE", status: "Pendiente" });
  const item = { id: Date.now(), title, game, image: image || "valorant.png", mode, date, maxParticipants: Number(maxParticipants), registered: 0, status: "Inscripciones abiertas", description: "Torneo simulado de la comunidad Level Up.", players, matches };
  const next = [...getTournaments(), item];
  localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(next));
  return item;
}
