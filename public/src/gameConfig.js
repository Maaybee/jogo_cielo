import { loadGameState } from "./cookieManager.js";

// Exporta as keys únicas das cenas para facilitar a navegação e prevenir erros de digitação
export const SCENES = Object.freeze({
  START: "StartScene",
  HOWTOPLAY: "HowToPlay",
  MAP: "MapScene",
  BAKERY: "BakeryScene",
  GREENGROCER: "GreengrocerScene",
  GASSTATION: "GasStationScene",
  RESTAURANT: "RestaurantScene",
  END: "EndScene",
});

// Define as coordenadas geográficas, dimensões interativas e dados dos NPCs de cada local
export const LOCATIONS = Object.freeze({
  BAKERY: {
    id: "bakery",
    name: "Padaria do Oswaldo",
    x: 760, // Determina a posição horizontal no cenário do mapa
    y: 1100, // Determina a posição vertical no cenário do mapa
    width: 370, // Define a largura da zona invisível para detecção de clique
    height: 350, // Define a altura da zona invisível para detecção de clique
    description: "Uma aconchegante padaria local", // Descreve as características visuais do local
    npcName: "Oswaldo", // Armazena o nome do personagem principal da fase
    npcRole: "Padeiro", // Identifica a função profissional do personagem
  },

  GREENGROCER: {
    id: "greengrocer",
    name: "Quitanda da Julie",
    x: 2322, // Determina a posição horizontal no cenário do mapa
    y: 93, // Determina a posição vertical no cenário do mapa
    width: 280, // Define a largura da zona invisível para detecção de clique
    height: 350, // Define a altura da zona invisível para detecção de clique
    description: "Uma aconchegante quitanda local", // Descreve as características visuais do local
    npcName: "Julie", // Armazena o nome do personagem principal da fase
    npcRole: "Quitandeira", // Identifica a função profissional do personagem
  },

  GASSTATION: {
    id: "gasstation",
    name: "Posto do José",
    x: 952, // Determina a posição horizontal no cenário do mapa
    y: 120, // Determina a posição vertical no cenário do mapa
    width: 780, // Define a largura da zona invisível para detecção de clique
    height: 350, // Define a altura da zona invisível para detecção de clique
    description: "Posto de Gasolina local", // Descreve as características visuais do local
    npcName: "José", // Armazena o nome do personagem principal da fase
    npcRole: "Dono do Posto de Gasolina", // Identifica a função profissional do personagem
  },

  RESTAURANT: {
    id: "restaurant",
    name: "Restaurante do TXORI",
    x: 1220, // Determina a posição horizontal no cenário do mapa
    y: 1100, // Determina a posição vertical no cenário do mapa
    width: 370, // Define a largura da zona invisível para detecção de clique
    height: 350, // Define a altura da zona invisível para detecção de clique
    description: "Restaurante local", // Descreve as características visuais do local
    npcName: "TXORI", // Armazena o nome do personagem principal da fase
    npcRole: "Dono do Restaurante", // Identifica a função profissional do personagem
  },
});

const savedState = loadGameState();

// Estrutura os dados de progresso global inicial do jogador
export const GAME_STATE = savedState ?? {
  playerReputation: 0,
  completedSales: [],
  unlockedLocations: ["bakery"],
  locations: ["bakery", "restaurant", "greengrocery", "gasStation"],
  firstRun: true,
};

// Garante que saves antigos ganhem o campo default firstRun = false sem quebrar
if (!Object.prototype.hasOwnProperty.call(GAME_STATE, "firstRun")) {
  GAME_STATE.firstRun = false;
}

export const END_GAME_STATE = { ...GAME_STATE };

export function resetGameState() {
  Object.assign(GAME_STATE, END_GAME_STATE);
}
