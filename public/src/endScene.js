import {SCENES} from "./gameConfig.js";

export class EndScene extends Phaser.Scene {
  // Define a key da cena e as dimensões da tela
  constructor() {
    super({ key: SCENES.END });
    this.width = 1024;
    this.height = 768;
    this.debug = false; // Salvaguarda: Desativa o log contínuo por padrão para não travar o navegador
  }

  // Carrega os assets visuais antes da cena ser exibida
  preload() {
    this.load.image("bgEndScene", "public/assets/backgrounds/bgEndScene.png");
    this.load.image("endMsg", "public/assets/score_final.png");
    this.load.image("btnRestart", "public/assets/btnRestart.png");
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.add.image(this.width / 2, this.height / 2, "bgEndScene");
    const rectangle = this.add.rectangle(
      this.width / 2,
      this.height / 2,
      this.width,
      this.height,
      0x000000,
      0.5,
    );
    const endCielita = this.add
      .image(this.width / 2, this.height / 2, "endMsg")
      .setScale(0.7);

    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: [rectangle, endCielita],
        alpha: 0,
        duration: 600,
        onComplete: () => {
          rectangle.destroy();
          endCielita.destroy();
        },
      });
    });

    const btnRestart = this.add
      .image(this.width / 2, this.height / 1.3, "btnRestart")
      .setScale(0.15)
      .setInteractive({ useHandCursor: true });
    btnRestart.setAlpha(0); // começa invisível via alpha
    btnRestart.setVisible(true); // visível mas transparente

    this.time.delayedCall(3500, () => {
      this.tweens.add({
        targets: [btnRestart],
        alpha: 1,
        duration: 600,
        onComplete: () => {
          btnRestart.setVisible(true);
        },
      });
    });

    btnRestart.on("pointerdown", async () => {
      // Apaga todos os cookies
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      });

      localStorage.clear();
      sessionStorage.clear();

      console.log("Cookies após limpeza:", document.cookie); // confirma que limpou

      // Pequeno delay antes do reload para garantir que tudo foi apagado
      setTimeout(() => {
        window.location.href = window.location.origin; // mais confiável que reload()
      }, 100);
    });
  }

  update() {}
}
