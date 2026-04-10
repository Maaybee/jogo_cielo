// Importa as definições de localizações, keys de cena e estado global do jogo
import { LOCATIONS, SCENES, GAME_STATE } from "./gameConfig.js";
import { saveGameState } from "./cookieManager.js";

// Define a cena do mapa mundial com navegação entre fases e sistema de introdução/tutorial
export class MapScene extends Phaser.Scene {
  // Inicializa a cena com sua key e define variáveis principais de controle
  constructor() {
    super({ key: SCENES.MAP });
    this.width = 1024;
    this.height = 768;
    this.control = 0;
    this.reputationScore = GAME_STATE.playerReputation;
    this.arrows = []; // Array para armazenar as setas
  }

  // Carrega todos os assets utilizados na cena (imagens, personagens e sons)
  preload() {
    this.load.image("mapBackground", "public/assets/backgrounds/bgMapa.png");
    this.load.image("cieloLogo", "public/assets/logos/cieloLogo.png");
    this.load.image("reputationScore", "public/assets/reputationScore.png");

    this.load.image("cieloLeader", "public/assets/characters/liderCielo.png");
    this.load.image("baker", "public/assets/characters/baker.png");
    this.load.image("gasStationManager", "public/assets/characters/gasmanager.png");
    this.load.image(
      "restaurantOwner",
      "public/assets/characters/restaurantowner.png",
    );

    this.load.image("introBalloon", "public/assets/baloonIntro.png");
    this.load.image("btnStart", "public/assets/btnStart.png");
    this.load.image("dialogBox", "public/assets/dialogBox.png");
    this.load.image("btnNext", "public/assets/btnAvancar.png");
    this.load.image("btnHelp", "public/assets/btnHelp.png");
    this.load.image("btnYes", "public/assets/btnStart.png"); // Botão Sim (reutilizar btnStart)
    this.load.image("btnNo", "public/assets/btnStart.png"); // Botão Não (reutilizar btnStart)

    this.load.image("lockedGreengrocer", "public/assets/lockedGreengrocer.png");
    this.load.image("lockedRestaurant", "public/assets/lockedRestaurant.png");
    this.load.image("lockedGasStation", "public/assets/lockedGasStation.png");
    this.load.audio("mainMusic", "public/assets/sounds/mainMusicLoopVersion.mp3");
    this.load.audio("blockedMapSound", "public/assets/sounds/blockedMapSound.mp3");
    this.load.audio("buttonSelectMap", "public/assets/sounds/buttonSelectMap.mp3");
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
    const mapData = this.scene.settings.data || {};
    const completedLocation = mapData.completedLocation;
    let introActive = GAME_STATE.firstRun || Boolean(completedLocation);
    let introMode = GAME_STATE.firstRun
      ? "tutorial"
      : completedLocation
        ? "hint"
        : null;
    let introStep = 1;
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
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    // Áreas interativas das fases
    const bakeryArea = this.add
      .rectangle(
        LOCATIONS.BAKERY.x,
        LOCATIONS.BAKERY.y,
        LOCATIONS.BAKERY.width,
        LOCATIONS.BAKERY.height,
        0x00ff00,
        0,
      )
      .setInteractive({ useHandCursor: true }); // Invisível, pois é sempre acessível

    const gasStationArea = this.add
      .rectangle(
        LOCATIONS.GASSTATION.x,
        LOCATIONS.GASSTATION.y,
        LOCATIONS.GASSTATION.width,
        LOCATIONS.GASSTATION.height,
        0xff0000,
        0,
      )
      .setInteractive({ useHandCursor: true }); // Invisível

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
      .setInteractive({ useHandCursor: true }); // Invisível

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
      .setScale(1.5)
      .setVisible(false);

    // Balão e texto do tutorial
    const introBalloon = this.add
      .image(this.width / 1.4, this.height / 3.5, "introBalloon")
      .setScrollFactor(0)
      .setScale(1.36)
      .setVisible(false);

    const introText = this.add
      .text(
        introBalloon.x + 10,
        introBalloon.y,
        GAME_STATE.firstRun
          ? "Olá, eu sou a Cielita. Hoje você vai lidar com diferentes tipos de compradores, preste atenção nos diálogos para conseguir concluir uma venda."
          : completedLocation
            ? this.getCompletionMessage(completedLocation)
            : "",
        {
          fontSize: "1.7rem",
          fontFamily: "Roboto",
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
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    // Botão de ajuda que reabre o tutorial
    const btnHelp = this.add
      .image(this.width - 970, 170, "btnHelp")
      .setScrollFactor(0)
      .setScale(0.22)
      .setInteractive({ useHandCursor: true });

    const hideIntroElements = () => {
      introActive = false;
      introMode = null;

      overlay.setVisible(false).setAlpha(1);
      cieloLeader.setVisible(false).setAlpha(1);
      introBalloon.setVisible(false).setAlpha(1);
      introText.setVisible(false).setAlpha(1);
      clickText.setVisible(false).setAlpha(1);
    };

    const showTutorial = () => {
      introActive = true;
      introMode = "tutorial";
      introStep = 1;

      cieloLeader.setVisible(true).setAlpha(1);
      introBalloon.setVisible(true).setAlpha(1);
      introText
        .setVisible(true)
        .setAlpha(1)
        .setText(
          "Olá, eu sou a Cielita. Hoje você vai lidar com diferentes tipos de compradores, preste atenção nos diálogos para conseguir concluir uma venda.",
        );
      clickText.setVisible(true).setAlpha(1);
      overlay.setVisible(true).setAlpha(0.75);
    };

    const showCompletionHint = (message) => {
      introActive = true;
      introMode = "hint";
      introStep = 0;

      cieloLeader.setVisible(true).setAlpha(1);
      introBalloon.setVisible(true).setAlpha(1);
      introText.setVisible(true).setAlpha(1).setText(message);
      clickText.setVisible(true).setAlpha(1);
      overlay.setVisible(true).setAlpha(0.75);
    };

    // Exibe tutorial ou dica de conclusão de fase
    if (GAME_STATE.firstRun) {
      showTutorial();
    } else if (completedLocation) {
      showCompletionHint(this.getCompletionMessage(completedLocation));
    }

    // Avança o tutorial ao clicar
    clickText.on("pointerdown", () => {
      this.sound.play("buttonSelectMap");
      if (!introActive) return;

      if (introMode === "tutorial") {
        if (introStep === 1) {
          introText.setText(
            "Pressione e arraste na tela para navegar pelo mapa, consiga vendas e ganhe reputação. Sua primeira missão é na padaria, boa sorte!",
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
            hideIntroElements();
          },
        });
      } else if (introMode === "hint") {
        hideIntroElements();
      }
    });

    // Reabre o tutorial ao clicar no botão de ajuda
    btnHelp.on("pointerdown", () => {
      this.sound.play("buttonSelectMap");
      if (GAME_STATE.firstRun) {
        showTutorial();
      } else {
        showCompletionHint(this.getHelpMessage());
      }
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
        `${GAME_STATE.playerReputation}/600`,
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
      if (introActive) return; // Salva-guardas para a introdução

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
      this.showConfirmationDialog("Padaria", SCENES.BAKERY, LOCATIONS.BAKERY);
    });

    // Interação com a fase do posto de gasolina
    gasStationArea.on("pointerdown", () => {
      if (introActive) return; // Salva-guardas para a introdução

      if (GAME_STATE.playerReputation < 400) {
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
        this.showConfirmationDialog(
          "Posto de Gasolina",
          SCENES.GASSTATION,
          LOCATIONS.GASSTATION,
        );
      }
    });

    // Interação com a fase do restaurante
    restaurantArea.on("pointerdown", () => {
      if (introActive) return; // Salva-guardas para a introdução

      if (GAME_STATE.playerReputation < 100) {
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
        this.showConfirmationDialog(
          "Restaurante",
          SCENES.RESTAURANT,
          LOCATIONS.RESTAURANT,
        );
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
      .setInteractive({ useHandCursor: true }); // Invisível

    // Interação com a quitanda
    greengrocerArea.on("pointerdown", () => {
      if (introActive) return; // Salva-guardas para a introdução

      if (GAME_STATE.playerReputation < 100) {
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
        this.showConfirmationDialog(
          "Quitanda",
          SCENES.GREENGROCER,
          LOCATIONS.GREENGROCER,
        );
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
    this.unlockLevels();

    // Mostra seta para o próximo local recomendado
    this.showNextArrow();
  }

  update() {
    this.updateArrows();
  }

  // Mostra um diálogo de confirmação antes de entrar na fase
  showConfirmationDialog(phaseName, sceneKey, location) {
    // Overlay escuro
    const confirmOverlay = this.add
      .rectangle(
        this.width / 2,
        this.height / 2,
        this.width,
        this.height,
        0x000000,
        0.7,
      )
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });

    // Caixa modal com background branco
    const modalBox = this.add
      .rectangle(this.width / 2, this.height / 2, 400, 220, 0xffffff)
      .setScrollFactor(0)
      .setDepth(1);

    // Borda da caixa modal
    const modalBorder = this.add.graphics().setScrollFactor(0).setDepth(1);
    modalBorder.lineStyle(3, 0x333333, 1);
    modalBorder.strokeRect(
      this.width / 2 - 200,
      this.height / 2 - 110,
      400,
      220,
    );

    // Texto da confirmação
    const confirmText = this.add
      .text(
        this.width / 2,
        this.height / 2 - 40,
        `Deseja entrar em\n${phaseName}?`,
        {
          fontSize: "1.6rem",
          fontFamily: "Pixelify",
          fill: "#333333",
          align: "center",
          wordWrap: { width: 350 },
        },
      )
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDepth(2);

    // Container para os botões
    const btnYesContainer = this.add
      .rectangle(this.width / 2 - 90, this.height / 2 + 60, 160, 50, 0x4caf50)
      .setScrollFactor(0)
      .setDepth(2)
      .setInteractive({ useHandCursor: true });

    const btnYesText = this.add
      .text(this.width / 2 - 90, this.height / 2 + 60, "ENTRAR", {
        fontSize: "1.3rem",
        fontFamily: "Pixelify",
        fill: "#ffffff",
        align: "center",
      })
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDepth(3);

    const btnNoContainer = this.add
      .rectangle(this.width / 2 + 90, this.height / 2 + 60, 160, 50, 0xf44336)
      .setScrollFactor(0)
      .setDepth(2)
      .setInteractive({ useHandCursor: true });

    const btnNoText = this.add
      .text(this.width / 2 + 90, this.height / 2 + 60, "CANCELAR", {
        fontSize: "1.3rem",
        fontFamily: "Pixelify",
        fill: "#ffffff",
        align: "center",
      })
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDepth(3);

    // Função para fechar o diálogo
    const closeDialog = () => {
      confirmOverlay.destroy();
      modalBox.destroy();
      modalBorder.destroy();
      confirmText.destroy();
      btnYesContainer.destroy();
      btnYesText.destroy();
      btnNoContainer.destroy();
      btnNoText.destroy();
    };

    // Clique em Entrar - inicia a fase
    btnYesContainer.on("pointerdown", () => {
      this.sound.play("buttonSelectMap");
      closeDialog();
      this.time.delayedCall(150, () => {
        this.scene.start(sceneKey, { location: location });
      });
    });

    // Clique em Cancelar - fecha o diálogo
    btnNoContainer.on("pointerdown", () => {
      this.sound.play("buttonSelectMap");
      closeDialog();
    });

    // Efeito hover no botão Entrar
    btnYesContainer.on("pointerover", () => {
      btnYesContainer.setFillStyle(0x45a049);
      btnYesText.setScale(1.1);
    });

    btnYesContainer.on("pointerout", () => {
      btnYesContainer.setFillStyle(0x4caf50);
      btnYesText.setScale(1);
    });

    // Efeito hover no botão Cancelar
    btnNoContainer.on("pointerover", () => {
      btnNoContainer.setFillStyle(0xda190b);
      btnNoText.setScale(1.1);
    });

    btnNoContainer.on("pointerout", () => {
      btnNoContainer.setFillStyle(0xf44336);
      btnNoText.setScale(1);
    });

    // Fechar ao clicar no overlay
    confirmOverlay.on("pointerdown", () => {
      closeDialog();
    });
  }

  // Retorna mensagem específica após concluir cada local
  getCompletionMessage(location) {
    switch (location) {
      case "bakery":
        return "Agora você liberou a Quitanda e o Restaurante, navegue pelo mapa e escolha seu próximo cliente.";
      case "greengrocer":
        if (
          GAME_STATE.completedSales.includes("restaurant") ||
          GAME_STATE.playerReputation >= 400
        ) {
          return "Agora você liberou o Posto de Gasolina. Continue navegando pelo mapa e escolha seu próximo cliente.";
        }
        return "Agora você liberou o Restaurante. Continue navegando pelo mapa e escolha seu próximo cliente.";
      case "restaurant":
        if (
          GAME_STATE.completedSales.includes("greengrocer") ||
          GAME_STATE.playerReputation >= 400
        ) {
          return "Agora você liberou o Posto de Gasolina. Continue navegando pelo mapa e escolha seu próximo cliente.";
        }
        return "Agora você liberou a Quitanda. Continue navegando pelo mapa e escolha seu próximo cliente.";
      case "gasStation":
        return "Ótimo! Você concluiu o posto de gasolina. Continue navegando pelo mapa para conferir seu progresso.";
      default:
        return "Navegue pelo mapa para escolher seu próximo cliente.";
    }
  }

  // Retorna mensagem de ajuda com base no progresso atual do jogador
  getHelpMessage() {
    if (!GAME_STATE.completedSales.includes("bakery")) {
      return "Seu próximo objetivo é concluir a Padaria. Toque na área da Padaria no mapa.";
    }

    if (GAME_STATE.playerReputation < 100) {
      return "Ganhe reputação na Padaria para desbloquear a Quitanda e o Restaurante.";
    }

    const hasGreengrocer = GAME_STATE.completedSales.includes("greengrocer");
    const hasRestaurant = GAME_STATE.completedSales.includes("restaurant");
    const hasGasStation = GAME_STATE.completedSales.includes("gasStation");

    if (!hasGreengrocer && !hasRestaurant) {
      return "Agora você pode ir para a Quitanda ou para o Restaurante. Escolha seu próximo cliente no mapa.";
    }

    if (!hasGreengrocer) {
      return "Agora você pode ir para a Quitanda. Toque na área da Quitanda no mapa.";
    }

    if (!hasRestaurant) {
      return "Agora você pode ir para o Restaurante. Toque na área do Restaurante no mapa.";
    }

    if (!hasGasStation) {
      return "Agora você pode ir para o Posto de Gasolina. Toque na área do Posto no mapa.";
    }

    return "Você já liberou todos os locais. Continue navegando pelo mapa para conferir seu progresso.";
  }

  // Libera fases com base na reputação do jogador
  unlockLevels() {
    for (let i = 0; i < GAME_STATE.locations.length; i++) {
      switch (GAME_STATE.locations[i]) {
        case "bakery":
          break;

        case "greengrocery":
          if (GAME_STATE.playerReputation >= 100) {
            this.lockedGreengrocer.destroy();
          }
          break;

        case "restaurant":
          if (GAME_STATE.playerReputation >= 100) {
            this.lockedRestaurant.destroy();
          }
          break;
        case "gasStation":
          if (GAME_STATE.playerReputation >= 400) {
            this.lockedGasStation.destroy();
          }
      }
    }
  }

  // Mostra uma ou duas setas apontando para o próximo local(is) recomendado
  showNextArrow() {
    let nextLocations = [];

    if (!GAME_STATE.completedSales.includes("bakery")) {
      nextLocations.push("bakery");
    } else if (GAME_STATE.playerReputation < 100) {
      nextLocations.push("bakery"); // Para ganhar reputação
    } else {
      const hasGreengrocer = GAME_STATE.completedSales.includes("greengrocer");
      const hasRestaurant = GAME_STATE.completedSales.includes("restaurant");
      const hasGasStation = GAME_STATE.completedSales.includes("gasStation");

      if (!hasGreengrocer && !hasRestaurant) {
        // Ambos desbloqueados - mostra duas setas
        nextLocations.push("greengrocer", "restaurant");
      } else if (!hasGreengrocer) {
        nextLocations.push("greengrocer");
      } else if (!hasRestaurant) {
        nextLocations.push("restaurant");
      } else if (!hasGasStation) {
        nextLocations.push("gasStation");
      }
    }

    // Cria uma seta para cada local
    nextLocations.forEach((location) => {
      const arrow = this.add.graphics();
      arrow.fillStyle(0xffff00);
      arrow.lineStyle(4, 0xffff00);
      arrow.setScrollFactor(0);

      this.tweens.add({
        targets: arrow,
        alpha: 0.3,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });

      this.arrows.push({
        graphics: arrow,
        targetLocation: location,
      });
    });
  }

  // Atualiza a posição das setas a cada frame
  updateArrows() {
    const cameraCenterX = this.cameras.main.scrollX + this.width / 2;
    const cameraCenterY = this.cameras.main.scrollY + this.height / 2;

    this.arrows.forEach((arrow) => {
      let targetPos = this.getLocationPosition(arrow.targetLocation);
      if (!targetPos) return;

      // Verifica se o local está visível na câmera
      const isVisible =
        targetPos.x > this.cameras.main.scrollX &&
        targetPos.x < this.cameras.main.scrollX + this.width &&
        targetPos.y > this.cameras.main.scrollY &&
        targetPos.y < this.cameras.main.scrollY + this.height;

      // Limpa a seta anterior
      arrow.graphics.clear();
      arrow.graphics.fillStyle(0xffff00);
      arrow.graphics.lineStyle(4, 0xffff00);

      if (isVisible) {
        // Local está visível - coloca a seta em cima dele
        const screenX = targetPos.x - this.cameras.main.scrollX;
        const screenY = targetPos.y - this.cameras.main.scrollY;

        // Desenha seta apontando para baixo
        const size = 25;
        arrow.graphics.fillTriangle(
          screenX,
          screenY - 40,
          screenX - size,
          screenY,
          screenX + size,
          screenY,
        );
      } else {
        // Local não está visível - aponta direção como antes
        const dx = targetPos.x - cameraCenterX;
        const dy = targetPos.y - cameraCenterY;
        const angle = Math.atan2(dy, dx);

        const distance = 120;
        const arrowX = this.width / 2 + Math.cos(angle) * distance;
        const arrowY = this.height / 2 + Math.sin(angle) * distance;

        const size = 20;
        const p1x = arrowX + Math.cos(angle) * size;
        const p1y = arrowY + Math.sin(angle) * size;
        const p2x = arrowX + Math.cos(angle + 2.5) * size;
        const p2y = arrowY + Math.sin(angle + 2.5) * size;
        const p3x = arrowX + Math.cos(angle - 2.5) * size;
        const p3y = arrowY + Math.sin(angle - 2.5) * size;

        arrow.graphics.fillTriangle(p1x, p1y, p2x, p2y, p3x, p3y);
      }
    });
  }

  // Retorna a posição de um local pelo nome
  getLocationPosition(location) {
    switch (location) {
      case "bakery":
        return { x: LOCATIONS.BAKERY.x, y: LOCATIONS.BAKERY.y };
      case "greengrocer":
        return { x: LOCATIONS.GREENGROCER.x, y: LOCATIONS.GREENGROCER.y };
      case "restaurant":
        return { x: LOCATIONS.RESTAURANT.x, y: LOCATIONS.RESTAURANT.y };
      case "gasStation":
        return { x: LOCATIONS.GASSTATION.x, y: LOCATIONS.GASSTATION.y };
      default:
        return null;
    }
  }
}
