const COOKIE_KEY = "cielo_game_state";
const COOKIE_DAYS = 30; // Tempo de expiração

// Salva o estado do jogo em um cookie
export function saveGameState(state) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);

  const encoded = encodeURIComponent(JSON.stringify(state));
  document.cookie = `${COOKIE_KEY}=${encoded}; expires=${expires.toUTCString()}; path=/`;
}

// Lê o estado salvo do cookie, ou retorna null se não existir
export function loadGameState() {
  const cookies = document.cookie.split("; ");
  const found = cookies.find((c) => c.startsWith(`${COOKIE_KEY}=`));
  if (!found) return null;

  try {
    return JSON.parse(decodeURIComponent(found.split("=")[1]));
  } catch {
    return null;
  }
}

// Apaga o cookie de progresso (útil para resetar o jogo)
export function clearGameState() {
  console.log('clearGameState chamado, chave:', COOKIE_KEY);
  document.cookie = `${COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}