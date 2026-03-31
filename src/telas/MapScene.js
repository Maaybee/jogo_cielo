// Importa as definições de localizações, chaves de cena e estado global do jogo
import { LOCATIONS, SCENES, GAME_STATE } from "./gameConfig.js";
import { saveGameState } from "./cookieManager.js";

// Define a cena do mapa mundial com navegação entre fases e sistema de introdução/tutorial
export class MapScene extends Phaser.Scene {
  // Inicializa a cena com sua chave e define variáveis principais de controle
  constructor() {
    super({ key: SCENES.MAP });
    this.width = 1024;
    this.height = 768;
    this.control = 0;
    this.reputationScore = GAME_STATE.playerReputation;
  }

  // Carrega todos os assets utilizados na cena (imagens, personagens e sons)
  preload() {
    this.load.image("mapBackground", "assets/backgrounds/bgMapa.png");
    this.load.image("cieloLogo", "assets/logos/cieloLogo.png");
    this.load.image("reputationScore", "/assets/reputationScore.png");

    this.load.image("cieloLeader", "/assets/characters/liderCielo.png");
    this.load.image("baker", "/assets/characters/baker.png");
    this.load.image("gasStationManager", "/assets/characters/gasmanager.png");
    this.load.image(
      "restaurantOwner",
      "/assets/characters/restaurantOwner.png",
    );

    this.load.image("introBalloon", "/assets/baloonIntro.png");
    this.load.image("btnStart", "/assets/btnStart.png");
    this.load.image("dialogBox", "/assets/dialogBox.png");
    this.load.image("btnNext", "/assets/btnAvancar.png");
    this.load.image("btnHelp", "assets/btnHelp.png");

    this.load.image("lockedGreengrocer", "/assets/lockedGreengrocer.png");
    this.load.image("lockedRestaurant", "/assets/lockedRestaurant.png");
    this.load.image("lockedGasStation", "/assets/lockedGasStation.png");
    this.load.audio("mainMusic", "assets/sounds/mainMusicLoopVersion.mp3");
    this.load.audio("blockedMapSound", "assets/sounds/blockedMapSound.mp3");
    this.load.audio("buttonSelectMap", "assets/sounds/buttonSelectMap.mp3");
  }

  // Cria os elementos visuais, interações e inicia o sistema de introdução
  create() {
    this.sound.play("mainMusic", { loop: true, volume: 0.2 });

    // Garante que o áudio pare ao sair da cena
    this.events.on("shutdown", () => {
      this.sound.stopAll();
    });

    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Controle do estado do tutorial e bloqueio do mapa
    let introActive = true; 
    let lockMap = false;

    // Fundo do mapa
    const map = this.add
      .image(this.width + 275, this.height + 90, "mapBackground")
      .setScale(1.3)
      .setOrigin(0.5);

    this.cameras.main.setBounds(0, 0, map.displayWidth, map.displayHeight);

    // Overlay escuro usado durante diálogos/tutorial
    const overlay = this.add
      .rectangle(
        this.width / 2,
        this.height / 2,
        this.width,
        this.height,
        0x000000,
        0.75,
      )
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });

    // Áreas interativas das fases
    const bakeryArea = this.add
      .rectangle(
        LOCATIONS.BAKERY.x,
        LOCATIONS.BAKERY.y,
        LOCATIONS.BAKERY.width,
        LOCATIONS.BAKERY.height,
        0xff0000,
        0,
      )
      .setInteractive({ useHandCursor: true });

    const gasStationArea = this.add
      .rectangle(
        LOCATIONS.GASSTATION.x,
        LOCATIONS.GASSTATION.y,
        LOCATIONS.GASSTATION.width,
        LOCATIONS.GASSTATION.height,
        0xff0000,
        0,
      )
      .setInteractive({ useHandCursor: true });

    // Indicador de fase bloqueada (posto)
    this.lockedGasStation = this.add
      .image(
        LOCATIONS.GASSTATION.x + 2,
        LOCATIONS.GASSTATION.y + 32,
        "lockedGasStation",
      )
      .setScale(1.3);

    const restaurantArea = this.add
      .rectangle(
        LOCATIONS.RESTAURANT.x,
        LOCATIONS.RESTAURANT.y,
        LOCATIONS.RESTAURANT.width,
        LOCATIONS.RESTAURANT.height,
        0xff0000,
        0,
      )
      .setInteractive({ useHandCursor: true });

    // Indicador de fase bloqueada (restaurante)
    this.lockedRestaurant = this.add
      .image(
        LOCATIONS.RESTAURANT.x - 15,
        LOCATIONS.RESTAURANT.y - 22,
        "lockedRestaurant",
      )
      .setScale(1.3);

    // Sprites dos NPCs (usados em diálogos)
    const baker = this.add
      .image(this.width / 3.5, this.height - 240, "baker")
      .setScale(0.35)
      .setScrollFactor(0)
      .setVisible(false);

    const gasStationManager = this.add
      .image(this.width / 3.5, this.height - 280, "gasStationManager")
      .setScale(0.4)
      .setScrollFactor(0)
      .setVisible(false);

    const restaurantOwner = this.add
      .image(this.width / 3.5, this.height - 280, "restaurantOwner")
      .setScale(1.5)
      .setScrollFactor(0)
      .setVisible(false);

    // Elementos de interface de diálogo
    const dialogBox = this.add
      .image(this.width / 1.4, this.height / 2.5, "dialogBox")
      .setScale(1.5)
      .setScrollFactor(0)
      .setVisible(false);

    const btnStart = this.add
      .image(this.width / 1.4, this.height / 1.5, "btnStart")
      .setScale(0.1)
      .setScrollFactor(0)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    // Personagem guia (Cielita)
    const cieloLeader = this.add
      .image(this.width / 3.5, this.height / 1.48, "cieloLeader")
      .setScrollFactor(0)
      .setScale(1.5);

    // Balão e texto do tutorial
    const introBalloon = this.add
      .image(this.width / 1.4, this.height / 3.5, "introBalloon")
      .setScrollFactor(0)
      .setScale(1.36);

    const introText = this.add
      .text(
        introBalloon.x + 10,
        introBalloon.y,
        "Olá, eu sou a Cielita. Hoje você vai lidar com diferentes tipos de compradores, preste atenção nos diálogos para conseguir concluir uma venda.",
        {
          fontSize: "1.7rem",
          fontFamily: "Pixelify",
          fill: "#000000",
          align: "center",
          wordWrap: { width: 400 },
          lineSpacing: "6",
        },
      )
      .setScrollFactor(0)
      .setOrigin(0.5);

    // Botão para avançar o tutorial
    const clickText = this.add
      .image(introBalloon.x, introBalloon.y + 170, "btnNext")
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });

    // Botão de ajuda que reabre o tutorial
    const btnHelp = this.add
      .image(this.width - 970, 170, "btnHelp")
      .setScrollFactor(0)
      .setScale(0.22)
      .setInteractive({ useHandCursor: true });

    // Controle de etapas do tutorial
    let introStep = 1;

    // Avança o tutorial ao clicar
    clickText.on("pointerdown", () => {
      this.sound.play("buttonSelectMap");
      if (!introActive) return;

      if (introStep === 1) {
        introText.setText(
          "Pressione e arraste na tela para navegar pelo mapa, consiga vendas e ganhe reputação. Sua primeira missão é na padaria, boa sorte!"
        );
        introStep = 2;
        return;
      }

      // Finaliza o tutorial
      introActive = false;
      GAME_STATE.firstRun = false;
      saveGameState(GAME_STATE);

      this.tweens.add({
        targets: [cieloLeader, introBalloon, introText, clickText, overlay],
        alpha: 0,
        duration: 600,
        onComplete: () => {
          cieloLeader.setVisible(false).setAlpha(1);
          introBalloon.setVisible(false).setAlpha(1);
          introText.setVisible(false).setAlpha(1);
          clickText.setVisible(false).setAlpha(1);
          overlay.setVisible(false).setAlpha(1);
        },
      });
    });

    // Reabre o tutorial ao clicar no botão de ajuda
    btnHelp.on("pointerdown", () => {
      introActive = true;
      introStep = 1;

      cieloLeader.setVisible(true).setAlpha(1);
      introBalloon.setVisible(true).setAlpha(1);
      introText.setVisible(true).setAlpha(1).setText(
        "Olá, eu sou a Cielita. Hoje você vai lidar com diferentes tipos de compradores, preste atenção nos diálogos para conseguir concluir uma venda."
      );
      clickText.setVisible(true).setAlpha(1);
      overlay.setVisible(true).setAlpha(0.75);
    });

    // Fecha overlays ao clicar fora
    overlay.on("pointerdown", () => {
      if (introActive) return;

      overlay.setVisible(false);
      dialogBox.setVisible(false);
      btnStart.setVisible(false);
      lockMap = false;

      baker.setVisible(false);
      gasStationManager.setVisible(false);
      restaurantOwner.setVisible(false);
    });

    // Logo e HUD de reputação
    const logo = this.add
      .image(160, 30, "cieloLogo")
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setScale(0.9);

    const reputationScore = this.add
      .image(210, 90, "reputationScore")
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setScale(0.8);

    const txtReputationScore = this.add
      .text(
        reputationScore.x - 12,
        reputationScore.y + 10,
        `${GAME_STATE.playerReputation}/400`,
        {
          fontSize: "1.7rem",
          fontFamily: "Upheavel",
          fill: "#000000",
          align: "center",
          wordWrap: { width: 400 },
        },
      )
      .setOrigin(1, 0)
      .setScrollFactor(0);

    // Interação com a fase da padaria
    bakeryArea.on("pointerdown", () => {
      if (GAME_STATE.completedSales.includes("bakery")) {
        const msg = this.add
          .text(this.width / 2, this.height / 2, "Fase já concluída!", {
            fontSize: "2rem",
            fontFamily: "Pixelify",
            color: "#ffffff",
          })
          .setScrollFactor(0)
          .setOrigin(0.5);
        this.time.delayedCall(1500, () => msg.destroy());
        return;
      }
      this.sound.play("buttonSelectMap");
      this.time.delayedCall(150, () => {
        this.scene.start(SCENES.BAKERY, { location: LOCATIONS.BAKERY });
      });
    });

    // Interação com a fase do posto de gasolina
    gasStationArea.on("pointerdown", () => {
      if (GAME_STATE.playerReputation < 400){
        this.sound.play("blockedMapSound", { volume: 0.9 });
        const msg = this.add
          .text(this.width / 2, this.height / 2, "Reputação insuficiente", {
            fontSize: "2rem",
            fontFamily: "Pixelify",
            color: "#ffffff",
          })
          .setScrollFactor(0)
          .setOrigin(0.5);

        this.time.delayedCall(1500, () => msg.destroy());
      } else {
        if (GAME_STATE.completedSales.includes("gasStation")) {
          const msg = this.add
            .text(this.width / 2, this.height / 2, "Fase já concluída!", {
              fontSize: "2rem",
              fontFamily: "Pixelify",
              color: "#ffffff",
            })
            .setScrollFactor(0)
            .setOrigin(0.5);

          this.time.delayedCall(1500, () => msg.destroy());
          return;
        }

        this.sound.play("buttonSelectMap");
        this.time.delayedCall(150, () => {
          this.scene.start(SCENES.GASSTATION, { location: LOCATIONS.GASSTATION });
        });
      }
    });

    // Interação com a fase do restaurante
    restaurantArea.on("pointerdown", () => {
      if (GAME_STATE.playerReputation < 100){
        this.sound.play("blockedMapSound");
        const msg = this.add
        .text(this.width / 2, this.height / 2, "Reputação insuficiente", {
          fontSize: "2rem",
          fontFamily: "Pixelify",
          color: "#ffffff",
        })
        .setScrollFactor(0)
        .setOrigin(0.5);
        this.time.delayedCall(1500, () => msg.destroy());
      } else {
        if (GAME_STATE.completedSales.includes("restaurant")) {
          const msg = this.add
            .text(this.width / 2, this.height / 2, "Fase já concluída!", {
              fontSize: "2rem",
              fontFamily: "Pixelify",
              color: "#ffffff",
            })
            .setScrollFactor(0)
            .setOrigin(0.5);

          this.time.delayedCall(1500, () => msg.destroy());
          return;
        }

        this.sound.play("buttonSelectMap");
        this.time.delayedCall(150, () => {
          this.scene.start(SCENES.RESTAURANT, { location: LOCATIONS.RESTAURANT });
        });
      }
    });

    // Área da quitanda
    const greengrocerArea = this.add
      .rectangle(
        LOCATIONS.GREENGROCER.x,
        LOCATIONS.GREENGROCER.y,
        LOCATIONS.GREENGROCER.width,
        LOCATIONS.GREENGROCER.height,
        0x00ff00,
        0,
      )
      .setInteractive({ useHandCursor: true });

    // Interação com a quitanda
    greengrocerArea.on("pointerdown", () => {
      if (GAME_STATE.playerReputation < 100){
        this.sound.play("blockedMapSound");
        const msg = this.add
        .text(this.width / 2, this.height / 2, "Reputação insuficiente", {
          fontSize: "2rem",
          fontFamily: "Pixelify",
          color: "#ffffff",
        })
        .setScrollFactor(0)
        .setOrigin(0.5);
        this.time.delayedCall(1500, () => msg.destroy());
      } else {
        if (GAME_STATE.completedSales.includes("greengrocer")) {
          const msg = this.add
            .text(this.width / 2, this.height / 2, "Fase já concluída!", {
              fontSize: "2rem",
              fontFamily: "Pixelify",
              color: "#ffffff",
            })
            .setScrollFactor(0)
            .setOrigin(0.5);

          this.time.delayedCall(1500, () => msg.destroy());
          return;
        }

        this.sound.play("buttonSelectMap");
        this.time.delayedCall(150, () => {
          this.scene.start(SCENES.GREENGROCER, { location: LOCATIONS.GREENGROCER });
        });
      }
    });

    // Indicador de fase bloqueada (quitanda)
    this.lockedGreengrocer = this.add
      .image(
        LOCATIONS.GREENGROCER.x + 2,
        LOCATIONS.GREENGROCER.y + 82,
        "lockedGreengrocer",
      )
      .setScale(1.3);

    // Controle de movimentação da câmera ao arrastar
    this.input.on("pointermove", (p) => {
      if (introActive || lockMap) return;
      if (p.isDown) {
        this.cameras.main.scrollX -=
          (p.x - p.prevPosition.x) / this.cameras.main.zoom;
        this.cameras.main.scrollY -=
          (p.y - p.prevPosition.y) / this.cameras.main.zoom;
      }
    });

    // Verifica desbloqueio de fases
    this.unlockLevels()
  }

  update() {

  }

  // Libera fases com base na reputação do jogador
  unlockLevels(){ 
    for (let i = 0; i < GAME_STATE.locations.length; i++){ 
      switch (GAME_STATE.locations[i]) {
        case 'bakery': 
          break
        
        case 'greengrocery':
          if (GAME_STATE.playerReputation >= 100){ 
            this.lockedGreengrocer.destroy();
          }
          break
        
        case 'restaurant': 
          if (GAME_STATE.playerReputation >= 100){ 
            this.lockedRestaurant.destroy();
          }
          break 
        case 'gasStation': 
          if (GAME_STATE.playerReputation >= 400){ 
            this.lockedGasStation.destroy();
          }
      }
    }
  }
}