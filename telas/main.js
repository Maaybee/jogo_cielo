import { StartScene } from './startScene.js';
import { IntroScene } from './introScene.js';
import { MapScene } from './MapScene.js';
import { BakeryScene } from './BakeryScene.js';

/**
 * Inicialização do jogo Phaser - Cielo Sales Simulator
 * Artefato de treinamento para Gerentes de Negócios
 */

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  transparent: true,

  scale: {
    mode: Phaser.Scale.FIT, // Ajusta o jogo para caber no container mantendo a proporção
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centraliza o canvas automaticamente
    width: '100%',
    height: '100%'
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  parent: 'game-container',
  dom: {
    createContainer: true
  },
  
  scene: [StartScene, IntroScene, MapScene, BakeryScene],

};

const game = new Phaser.Game(config);



