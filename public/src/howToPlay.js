import { SCENES } from "./gameConfig.js";

export class HowToPlay extends Phaser.Scene {
  // Define a key da cena e as dimensões da tela
  constructor() {
    super({ key: SCENES.HOWTOPLAY });
    this.width = 1024;
    this.height = 768;
    this.debug = false; // Salvaguarda: Desativa o log contínuo por padrão para não travar o navegador
  }

  // Carrega os assets visuais antes da cena ser exibida
  preload() {
    this.load.image("btnStart", "public/assets/btnStart.png");
    this.load.image("bgStart", "public/assets/backgrounds/bgInicio.png");
    this.load.image("instructionDashboard", "public/assets/comoJogar.png");
    this.load.image("btnReturn", "public/assets/btnVoltar.png");
    this.load.audio("btnStartSound", "public/assets/sounds/buttonStart.mp3");
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);
    // Adiciona o fundo centralizado na tela
    this.add
      .image(this.width / 2, this.height / 2, "bgStart")
      .setOrigin(0.5)
      .setScale(0.5);

    // Adiciona o painel de instruções
    this.add
      .image(this.width / 2, this.height / 2, "instructionDashboard")
      .setScale(0.58);

    const btnReturn = this.add
      .image(this.width / 8, this.height / 8, "btnReturn")
      .setScale(1.5);
    btnReturn.setInteractive({ cursor: "pointer" });

    btnReturn.on("pointerover", () => {
      btnReturn.setScale(1.55);
    });

    // Retorna o botão ao tamanho original ao retirar o mouse
    btnReturn.on("pointerout", () => {
      btnReturn.setScale(1.5);
    });

    // Ao clicar no botão, executa fade-out e troca para a cena do mapa
    btnReturn.on("pointerdown", () => {
      this.sound.play("btnStartSound"); // Executa o som do botão ao apertar.
      this.cameras.main.fadeOut(700, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start(SCENES.START);
        },
      );
    });
  }
}
