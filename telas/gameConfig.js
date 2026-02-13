/**
 * Configuração central do jogo Phaser
 * Define todas as cenas, assets e configurações globais
 */

export const SCENES = {
  START: 'StartScene',
  INTRODUCTION: 'IntroScene',
  MAP: 'MapScene',
  BAKERY: 'BakeryScene',
};

export const LOCATIONS = {
  BAKERY: {
    id: 'bakery',
    name: 'Padaria do Oswaldo',
    x: 300,
    y: 200,
    width: 100,
    height: 100,
    description: 'Uma aconchegante padaria local',
    npcName: 'Oswaldo',
    npcRole: 'Padeiro',
  },
};

export const GAME_STATE = {
  playerReputation: 0,
  completedSales: [],
  unlockedLocations: ['bakery'],
};
