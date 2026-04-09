// Importa os diálogos, regras de vitória e keys das cenas
import { JOSE_DIALOG } from "./dialogData.js";
import { SCENES, GAME_STATE } from "./gameConfig.js";
import { saveGameState } from "./cookieManager.js";

// Define a cena do Posto de Gasolina com sistema de diálogo e negociação
export class GasStationScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GASSTATION }); // Define a key da cena

    // Inicializa variáveis principais da fase
    this.joseSprite = null;
    this.satisfaction = 50; // Nível de satisfação inicial
    this.currentDialogKey = "step1"; // Diálogo atual
    this.currentPartIndex = 0; // Controle de partes do diálogo
    this.dialogTexts = {};
    this.optionButtons = [];
    this.gameEnded = false;
    this.feedbackText = null;
    this.width = 1024;
    this.height = 768;
    this.dialogBg = null;
    this.instruction = null;
  }

  // Recebe dados da cena anterior e reinicia o estado da fase
  init(data) {
    this.location = data?.location || null;

    const config = JOSE_DIALOG.config || {};
    this.satisfaction = config.initialScore ?? 50;
    this.currentDialogKey = "step1";
    this.currentPartIndex = 0;
    this.gameEnded = false;
    this.optionButtons = [];
    this.isProcessingOption = false; // Evita múltiplos cliques simultâneos
    this.lastDialogClickTime = 0; // Salvaguarda: controla cliques duplos rápidos
    this.dialogClickCooldown = 700; // Delay mínimo entre cliques (em ms)
    this.canAdvanceDialog = true; // Salvaguarda: bloqueia avanço durante cooldown
  }

  // Salvaguarda: Verifica se é permitido fazer clique no diálogo (evita cliques duplos rápidos)
  canClickDialog() {
    const now = this.time.now;
    if (now - this.lastDialogClickTime >= this.dialogClickCooldown) {
      this.lastDialogClickTime = now;
      return true;
    }
    return false;
  }

  // Carrega todos os assets utilizados na fase
  preload() {
    // Elementos visuais da fase
    this.load.image("bgGasStation", "public/assets/backgrounds/bgGasstation.png");
    this.load.image("dialogBoxLevel", "public/assets/levels/dialogBoxLevels.png");
    this.load.image("btnExit", "public/assets/levels/btnExit.png");
    this.load.image("optionBox", "public/assets/levels/optionBox.png");
    this.load.image("btnReturn", "public/assets/levels/btnSair.png");

    // Sons de feedback
    this.load.audio("soundVictory", "public/assets/sounds/soundVictory.mp3");
    this.load.audio("soundDefeat", "public/assets/sounds/soundDefeat.mp3");

    // Sprites do NPC (José)
    this.load.image(
      "neutralGasManager",
      "public/assets/characters/neutralGasManager.png",
    );
    this.load.image(
      "angryGasManager",
      "public/assets/characters/angryGasManager.png",
    );
    this.load.image("gasManager", "public/assets/characters/gasManager.png");

    // Áudios de interação
    this.load.audio("buttonDialog", "public/assets/sounds/buttonDialog.mp3");
    this.load.audio("gasStationMusic", "public/assets/sounds/gasStationMusic.mp3");
  }

  // Cria os elementos da cena e inicia o diálogo
  create() {
    // Música de fundo em loop
    this.sound.play("gasStationMusic", { loop: true, volume: 0.1 });

    // Garante que o áudio pare ao sair da cena
    this.events.on("shutdown", () => {
      this.sound.stopAll();
    });

    // Fundo da cena
    this.add
      .image(this.width / 2, this.height / 2, "bgGasStation")
      .setScale(0.5);

    // Overlay escuro para destacar UI
    this.add.rectangle(
      this.width / 2,
      this.height / 2,
      this.width,
      this.height,
      0x000000,
      0.5,
    );

    // Sprite inicial do NPC
    this.joseSprite = this.add
      .image(250, 540, "neutralGasManager")
      .setScale(0.45);

    // Botão de voltar ao mapa
    const backButton = this.add
      .image(150, 80, "btnExit")
      .setInteractive({ useHandCursor: true })
      .setScale(0.2);

    backButton.on("pointerdown", () => {
      if (!this.gameEnded && !this.exitConfirmationActive) {
        this.showExitConfirmation();
      }
    });

    // Inicializa sistema de diálogo
    this.createDialogBox();
    this.displayCurrentDialog();
  }

  // Mostra tela de confirmação para sair da fase
  showExitConfirmation() {
    this.exitConfirmationActive = true;
    // Desabilita toda entrada da cena enquanto overlay está ativo

    // Overlay escuro (Camada 999)
    const overlay = this.add
      .rectangle(
        this.width / 2,
        this.height / 2,
        this.width,
        this.height,
        0x000000,
        0.7,
      )
      .setScrollFactor(0)
      .setDepth(999)
      .setInteractive({ useHandCursor: false });

    // Impede cliques de passar para elementos abaixo
    overlay.on("pointerdown", () => {
      // Não faz nada, apenas consome o clique
    });

    // CAIXAS SOLTAS REMOVIDAS DAQUI!

    // Caixa modal com background branco (Camada 1000 - ACIMA do overlay)
    const confirmBox = this.add
      .rectangle(this.width / 2, this.height / 2, 400, 220, 0xffffff)
      .setScrollFactor(0)
      .setDepth(1000);

    // Borda da caixa modal (Camada 1000)
    const confirmBoxBorder = this.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(1000);
    confirmBoxBorder.lineStyle(3, 0x333333, 1);
    confirmBoxBorder.strokeRect(
      this.width / 2 - 200,
      this.height / 2 - 110,
      400,
      220,
    );

    // Texto de confirmação (Camada 1001)
    const confirmText = this.add
      .text(
        this.width / 2,
        this.height / 2 - 60,
        "Deseja mesmo sair da fase?",
        {
          fontSize: "24px",
          fontFamily: "Pixelify",
          fill: "#333333",
          align: "center",
          wordWrap: { width: 350 },
        },
      )
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDepth(1001);

    // Botão Sim (Camadas 1001 e 1002)
    const btnYes = this.add
      .rectangle(this.width / 2 - 120, this.height / 2 + 60, 100, 50, 0x4caf50)
      .setScrollFactor(0)
      .setDepth(1001)
      .setInteractive({ useHandCursor: true });

    const textYes = this.add
      .text(this.width / 2 - 120, this.height / 2 + 60, "Sim", {
        fontSize: "1.3rem",
        fill: "#ffffff",
        fontFamily: "Pixelify",
        align: "center",
      })
      .setScrollFactor(0)
      .setDepth(1002)
      .setOrigin(0.5);

    // Botão Cancelar (Camadas 1001 e 1002)
    const btnCancel = this.add
      .rectangle(this.width / 2 + 120, this.height / 2 + 60, 100, 50, 0xe74c3c)
      .setScrollFactor(0)
      .setDepth(1001)
      .setInteractive({ useHandCursor: true });

    const textCancel = this.add
      .text(this.width / 2 + 120, this.height / 2 + 60, "Cancelar", {
        fontSize: "1.3rem",
        fontFamily: "Pixelify",
        fill: "#ffffff",
        align: "center",
      })
      .setScrollFactor(0)
      .setDepth(1002)
      .setOrigin(0.5);

    // Eventos dos botões
    btnYes.on("pointerdown", () => {
      this.sound.play("buttonDialog");
      this.exitConfirmationActive = false;
      overlay.disableInteractive();
      overlay.destroy();
      confirmBox.destroy();
      confirmBoxBorder.destroy(); // Faltava destruir a borda!
      confirmText.destroy();
      btnYes.destroy();
      textYes.destroy();
      btnCancel.destroy();
      textCancel.destroy();
      this.time.delayedCall(150, () => {
        this.scene.start(SCENES.MAP);
      });
    });

    btnCancel.on("pointerdown", () => {
      this.sound.play("buttonDialog");
      // Reabilita entrada da cena antes de destruir overlay
      this.input.enabled = true;
      this.exitConfirmationActive = false;
      overlay.disableInteractive();
      overlay.destroy();
      confirmBox.destroy();
      confirmBoxBorder.destroy(); // Faltava destruir a borda!
      confirmText.destroy();
      btnYes.destroy();
      textYes.destroy();
      btnCancel.destroy();
      textCancel.destroy();
    });

    // Efeito visual ao passar mouse
    btnYes.on("pointerover", () => {
      btnYes.setFillStyle(0x229954);
    });
    btnYes.on("pointerout", () => {
      btnYes.setFillStyle(0x4caf50);
    });

    btnCancel.on("pointerover", () => {
      btnCancel.setFillStyle(0xc0392b);
    });
    btnCancel.on("pointerout", () => {
      btnCancel.setFillStyle(0xe74c3c);
    });
  }

  // Cria a caixa de diálogo e textos principais
  createDialogBox() {
    this.dialogBg = this.add.image(700, 380, "dialogBoxLevel").setScale(0.82);
    this.dialogBg.setVisible(true);

    // Texto do NPC
    this.dialogTexts.npc = this.add
      .text(this.dialogBg.x, this.dialogBg.y, "", {
        fontSize: "1.4rem",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        fontFamily: "Arial",
        wordWrap: { width: 550 },
        align: "center",
      })
      .setOrigin(0.5);

    // Texto de feedback (acerto/erro)
    this.feedbackText = this.add
      .text(390, 190, "", {
        fontSize: "2rem",
        color: "#000000",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(30);
  }


  // Cria a caixa de diálogo e textos principais
  createDialogBox() {
    this.dialogBg = this.add.image(700, 380, "dialogBoxLevel").setScale(0.82);
    this.dialogBg.setVisible(true);

    // Texto do NPC
    this.dialogTexts.npc = this.add
      .text(this.dialogBg.x, this.dialogBg.y, "", {
        fontSize: "1.4rem",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        fontFamily: "Arial",
        wordWrap: { width: 550 },
        align: "center",
      })
      .setOrigin(0.5);

    // Texto de feedback (acerto/erro)
    this.feedbackText = this.add
      .text(520, 320, "", {
        fontSize: "20px",
        color: "#000000",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
  }

  // Controla a exibição do diálogo atual
  displayCurrentDialog(autoShowOptions = false) {
    this.joseSprite.setTexture("neutralGasManager");
    this.dialogBg.setVisible(true);

    const dialog = JOSE_DIALOG[this.currentDialogKey];

    // Fallback caso o diálogo não exista
    if (!dialog) {
      console.warn(`Dialog key not found: ${this.currentDialogKey}`);
      this.currentDialogKey = "step1";
      this.displayCurrentDialog();
      return;
    }

    // Limpa instrução anterior
    if (this.instruction) this.instruction.destroy();

    // Texto de instrução
    this.instruction = this.add
      .text(this.dialogBg.x, 720, "Clique para continuar", {
        fontSize: "1.5rem",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Limpa feedback e botões antigos
    this.feedbackText.setText("");
    this.optionButtons.forEach((btn) => {
      btn.button.destroy();
      btn.text.destroy();
    });
    this.optionButtons = [];

    this.dialogTexts.npc.setVisible(true);

    // Caso seja diálogo final
    if (dialog.isEndDialog) {
      this.gameEnded = true;
      const endText = Array.isArray(dialog.npcText)
        ? dialog.npcText.join(" ")
        : dialog.npcText;
      this.dialogTexts.npc.setText(endText);
      // Wait for click to show end screen
      this.input.once("pointerdown", () => {
        this.showEndScreen(dialog.isSuccess);
      });
      return;
    }

    // Exibe opções após término do diálogo
    const showOptions = () => {
      if (!this.sys.isActive()) return;

      this.dialogTexts.npc.setVisible(false);

      const options = dialog.playerOptions || [];
      if (options.length === 0) {
        console.warn(
          `Opções não encontradas para o diálogo: ${this.currentDialogKey}`,
        );
        return;
      }

      this.createOptionButtons(options);
      this.instruction.setText("Escolha uma opção");
      this.instruction.setPosition(this.dialogBg.x, 200);
    };

    // Divide o texto do NPC em partes
    const npcTexts = Array.isArray(dialog.npcText)
      ? dialog.npcText
      : [dialog.npcText];
    this.currentPartIndex = 0;

    // Exibe cada parte do diálogo sequencialmente
    // Exibe cada parte do diálogo sequencialmente
    const showNextPart = () => {
      if (this.currentPartIndex < npcTexts.length) {
        this.dialogTexts.npc.setText(npcTexts[this.currentPartIndex]);
        this.currentPartIndex++;

        this.instruction.setText("Clique para continuar");
        this.instruction.setPosition(this.dialogBg.x, 720);

        // O Phaser envia o pointer (mouse) e os targets (elementos da interface clicados)
        const advanceHandler = (pointer, targets) => {
          // 1. Se clicou em um BOTÃO (targets.length > 0) ou se o modal de saída estiver aberto, ignora o clique!
          if (targets.length > 0 || this.exitConfirmationActive) return; 

          // 2. Ignora cliques durante o cooldown
          if (!this.canAdvanceDialog) return; 

          this.canAdvanceDialog = false; // Bloqueia novos avanços
          this.sound.play("buttonDialog");

          // Remove o listener corretamente após um clique válido
          this.input.off("pointerdown", advanceHandler);

          // Permite novo avanço apenas após delay
          this.time.delayedCall(700, () => {
            this.canAdvanceDialog = true;
            showNextPart();
          });
        };

        // Usa .on no lugar de .once
        this.input.on("pointerdown", advanceHandler);
      } else {
        // Pode mostrar opções direto ou com pequeno delay
        if (autoShowOptions) {
          this.instruction.setText("Aguarde...");
          this.time.delayedCall(900, showOptions);
        } else {
          showOptions();
        }
      }
    };

    showNextPart();
  }

  // Cria os botões de escolha do jogador
  createOptionButtons(options) {
    this.dialogBg.setVisible(false);

    const startY = 340,
      spacing = 150;

    options.forEach((option, index) => {
      const buttonY = startY + index * spacing;

      const button = this.add
        .image(700, buttonY, "optionBox")
        .setScale(0.35)
        .setInteractive({ useHandCursor: true })
        .setDepth(5);

      const text = this.add
        .text(700, buttonY, option.text, {
          fontSize: "1.1rem",
          fontStyle: "bold",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          fontFamily: "Arial",
          wordWrap: { width: 550 },
          align: "center",
        })
        .setOrigin(0.5)
        .setDepth(6);

      // Eventos do botão
      button.on("pointerdown", () => {
        this.sound.play("buttonDialog");
        this.handleOptionSelected(option);
      });

      button.on("pointerover", () => button.setScale(0.37));
      button.on("pointerout", () => button.setScale(0.35));

      this.optionButtons.push({ button, text });
    });
  }

  // Processa a escolha do jogador
  handleOptionSelected(option) {
    // Salvaguarda: evita cliques duplos rápidos e processamento simultâneo
    if (this.gameEnded || this.isProcessingOption || !this.canClickDialog() || this.exitConfirmationActive)
      return;
    this.isProcessingOption = true;

    // Bloqueia novos cliques
    this.optionButtons.forEach((btn) => btn.button.disableInteractive());

    // Atualiza satisfação
    this.satisfaction = Math.max(
      0,
      Math.min(100, this.satisfaction + option.satisfaction),
    );

    // Atualiza expressão do NPC
    this.joseSprite.setTexture(
      option.isCorrect ? "gasManager" : "angryGasManager",
    );

    // Avança diálogo após delay
    this.time.delayedCall(1500, () => {
      if (!this.sys.isActive()) return;
      this.isProcessingOption = false;

      try {
        let nextKey = option.nextDialog;

        // Verifica condição de vitória
        if (nextKey === "check_victory") {
          const config = JOSE_DIALOG.config || {};
          const win = config.scoreToWin;
          nextKey =
            this.satisfaction >= win ? "final_success" : "final_failure";
        }

        // Fallback de segurança
        if (!nextKey || !JOSE_DIALOG[nextKey]) {
          console.warn(`Dialog key not found: ${nextKey}`);
          this.currentDialogKey = "step1";
          this.displayCurrentDialog();
          return;
        }

        this.currentDialogKey = nextKey;
        this.displayCurrentDialog(option.isCorrect);
      } catch (error) {
        console.error("Erro ao avançar diálogo:", error);
        this.displayCurrentDialog();
      }
    });
  }

  // Agenda a tela final
  scheduleEndScreen(isSuccess) {
    this.time.delayedCall(2000, () => {
      if (!this.sys.isActive()) return;
      this.showEndScreen(isSuccess);
    });
  }

  // Exibe tela de vitória ou derrota
  showEndScreen(isSuccess) {
    this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.7);
    const backgroundWinLose = this.add.graphics();
    backgroundWinLose.fillStyle(0xffffff, 1);
    backgroundWinLose.fillRoundedRect(75, 100, 900, 500, 50);

    const resultColor = isSuccess ? "#00aa00" : "#cc0000";

    this.add
      .text(512, 300, isSuccess ? "VENDA CONCLUÍDA!" : "VENDA NÃO REALIZADA", {
        fontSize: "60px",
        color: resultColor,
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(
        512,
        380,
        isSuccess
          ? "Parabéns! Você conquistou o cliente José!"
          : "Infelizmente o cliente não aceitou a proposta. Tente novamente",
        {
          fontSize: "30px",
          color: "#000000",
          fontFamily: "Arial",
          align: "center",
          wordWrap: { width: 700 },
        },
      )
      .setOrigin(0.5);

    // Botão de retorno ao mapa
    const btnExit = this.add
      .image(512, 480, "btnReturn")
      .setInteractive({ useHandCursor: true })
      .setScale(1.8);

    // Som de resultado
    this.sound.play(isSuccess ? "soundVictory" : "soundDefeat");

    btnExit.on("pointerdown", () => {
      if (isSuccess) {
        GAME_STATE.playerReputation += 150;

        // Salva progresso da fase
        if (!GAME_STATE.completedSales.includes("gasStation")) {
          GAME_STATE.completedSales.push("gasStation");
          saveGameState(GAME_STATE);
        }

        // Transição para tela final
        this.cameras.main.fadeOut(700, 0, 0, 0);
        this.cameras.main.once(
          Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
          () => {
            this.scene.start(SCENES.END);
          },
        );
      } else {
        this.scene.start(SCENES.MAP);
      }
    });
  }
}
