const cookieKey = "cielo_game_state";
const cookieDays = 30; // Tempo de expiração

// Salva o estado do jogo em um cookie
export function saveGameState(state) {
  const expires = new Date();
  expires.setDate(expires.getDate() + cookieDays);

  const encoded = encodeURIComponent(JSON.stringify(state));
  document.cookie = `${cookieKey}=${encoded}; expires=${expires.toUTCString()}; path=/`;
}

// Lê o estado salvo do cookie, ou retorna null se não existir
export function loadGameState() {
  const cookies = document.cookie.split("; ");
  const found = cookies.find((c) => c.startsWith(`${cookieKey}=`));
  if (!found) return null;

  try {
    return JSON.parse(decodeURIComponent(found.split("=")[1]));
  } catch {
    return null;
  }
}

// Apaga o cookie de progresso (útil para resetar o jogo)
export function clearGameState() {
  console.log("clearGameState chamado, chave:", cookieKey);
  document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
