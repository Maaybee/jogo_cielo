// Importa as classes das cenas para permitir a construção do fluxo entre a introdução, o mapa e os estabelecimentos
import { StartScene } from "./startScene.js";
import { MapScene } from "./mapScene.js";
import { BakeryScene } from "./bakeryScene.js";
import { GreengrocerScene } from "./greengrocerScene.js";
import { GasStationScene } from "./gasStationScene.js";
import { RestaurantScene } from "./restaurantScene.js"; // importa a cena do restaurante
import { EndScene } from "./endScene.js";
import { HowToPlay } from "./howToPlay.js";

const isDebugMode = false; // Salvaguarda: Controle para desativar a depuração visual em produção

// Estabelece as configurações globais do motor Phaser e define o renderizador automático conforme o suporte do navegador
const config = {
  type: Phaser.AUTO,
  parent: "game-container", // Salvaguarda: Ancora o jogo em uma div segura no HTML

  // Gerencia o redimensionamento responsivo e centraliza a visualização do simulador no container do navegador
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1024,
    height: 768,
  },

  // Configura o motor de física básica, remove a gravidade e ativa as ferramentas de depuração visual
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: isDebugMode, // Salvaguarda aplicada aqui
    },
  },

  // Registra a lista de todas as cenas disponíveis na arquitetura do jogo para possibilitar as transições
  scene: [
    StartScene,
    HowToPlay,
    MapScene,
    BakeryScene,
    GreengrocerScene,
    GasStationScene,
    RestaurantScene,
    EndScene,
  ],
};

// Instancia o núcleo do jogo após o carregamento total do DOM e aplica as definições de configuração
window.addEventListener("DOMContentLoaded", () => {
  const game = new Phaser.Game(config);
});
