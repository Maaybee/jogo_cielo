// Importa os diálogos, regras de vitória e keys das cenas
import { JULIE_DIALOG } from "./dialogData.js";
import { SCENES, GAME_STATE } from "./gameConfig.js";
import { saveGameState } from "./cookieManager.js";

// Define a cena da Quitanda com sistema de diálogo e negociação
export class GreengrocerScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GREENGROCER }); // Define a key da cena

    // Inicializa variáveis principais da fase
    this.julieSprite = null;
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
    this.satisfactionBar = null;
    this.satisfactionText = null;
  }

  // Reinicia o estado da cena ao ser iniciada
  init(data) {
    this.location = data?.location || null;
    this.exitConfirmationActive = false;

    const config = JULIE_DIALOG.config || {};
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

  // Carrega todos os assets da fase
  preload() {
    // Elementos visuais
    this.load.image("bgGreengrocer", "public/assets/backgrounds/quitanda.png");
    this.load.image("dialogBoxLevel", "public/assets/levels/dialogBoxLevels.png");
    this.load.image("btnExit", "public/assets/levels/btnExit.png");
    this.load.image("emphasis", "public/assets/levels/light.png");
    this.load.image('btnReturn','public/assets/levels/btnSair.png');


    // Sprites da NPC (Julie)
    this.load.image("greengrocer", "public/assets/characters/greengrocer.png");
    this.load.image(
      "angryGreengrocer",
      "public/assets/characters/angryGreengrocer.png",
    );
    this.load.image(
      "happyGreengrocerManager",
      "public/assets/characters/happyGreengrocer.png",
    );

    // UI e sons
    this.load.image("optionBox", "public/assets/levels/optionBox.png");
    this.load.audio("buttonDialog", "public/assets/sounds/buttonDialog.mp3");
    this.load.audio("soundVictory", "public/assets/sounds/soundVictory.mp3");
    this.load.audio("soundDefeat", "public/assets/sounds/soundDefeat.mp3");
    this.load.audio("greengroceryMusic", "public/assets/sounds/greengrocerMusic.mp3");
    this.load.audio("buttonSelectMap", "public/assets/sounds/buttonSelectMap.mp3");
  }

  // Cria os elementos visuais e inicia o sistema da cena
  create() {
    // Música de fundo em loop
    this.sound.play("greengroceryMusic", { loop: true, volume: 0.1 });

    // Garante que o áudio pare ao sair da cena
    this.events.on("shutdown", () => {
      this.sound.stopAll();
    });

    // Fundo da cena
    this.add
      .image(this.width / 2, this.height / 2, "bgGreengrocer")
      .setScale(0.5);

    // Overlay escuro para destacar a interface
    this.add.rectangle(
      this.width / 2,
      this.height / 2,
      this.width,
      this.height,
      0x000000,
      0.5,
    );

    // Sprite inicial da NPC
    this.julieSprite = this.add.image(250, 520, "greengrocer").setScale(0.4);

    // Elemento visual decorativo
    this.add.image(760, 80, "emphasis").setScale(0.26);

    // Botão de voltar ao mapa
    const backButton = this.add
      .image(150, 80, "btnExit")
      .setInteractive({ useHandCursor: true })
      .setScale(0.2);

    backButton.on("pointerdown", () => {
      if (!this.gameEnded) {
        this.showExitConfirmation();
      }
    });

    // Inicializa HUD e sistema de diálogo
    this.createSatisfactionBar();
    this.createDialogBox();
    this.displayCurrentDialog();
  }

  // Cria a barra de satisfação do cliente
  createSatisfactionBar() {
    const barX = 750,
      barY = 80,
      barWidth = 220,
      barHeight = 30;

    // Fundo da barra
    const barBg = this.add.rectangle(barX, barY, barWidth, barHeight, 0xcccccc);
    barBg.setStrokeStyle(2, 0x000000);

    // Texto da barra
    this.add.text(barX - barWidth / 2 - 20, barY - 30, "Satisfação:", {
      fontSize: "14px",
      color: "#000000",
      fontFamily: "Arial",
      fontStyle: "bold",
    });

    // Barra dinâmica
    this.satisfactionBar = this.add.rectangle(
      barX - barWidth / 2 + ((this.satisfaction / 100) * barWidth) / 2,
      barY,
      (this.satisfaction / 100) * barWidth,
      barHeight - 4,
      this.getSatisfactionColor(this.satisfaction),
    );

    // Porcentagem
    this.satisfactionText = this.add
      .text(barX + barWidth / 2 + 20, barY, `${this.satisfaction}%`, {
        fontSize: "14px",
        color: "#000000",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);
  }

  // Define a cor da barra com base na satisfação
  getSatisfactionColor(satisfaction) {
    if (satisfaction >= 70) return 0x00aa00;
    if (satisfaction >= 40) return 0xffaa00;
    return 0xcc0000;
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

  // Controla a exibição do diálogo atual
  displayCurrentDialog(autoShowOptions = false) {
    this.julieSprite.setTexture("greengrocer").setScale(0.4);
    this.dialogBg.setVisible(true);

    const dialog = JULIE_DIALOG[this.currentDialogKey];

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
      .text(690, 720, "Clique para continuar", {
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
      this.input.once('pointerdown', () => {
        if (this.exitConfirmationActive) return;
        this.showEndScreen(dialog.isSuccess);
      });
      return;
    }

    // Mostra opções após o diálogo
    const showOptions = () => {
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
      this.instruction.setPosition(700, 210);
    };

    // Divide falas do NPC em partes
    const npcTexts = Array.isArray(dialog.npcText)
      ? dialog.npcText
      : [dialog.npcText];
    this.currentPartIndex = 0;

    // Exibe partes do diálogo sequencialmente
    const showNextPart = () => {
      if (this.currentPartIndex < npcTexts.length) {
        this.dialogTexts.npc.setText(npcTexts[this.currentPartIndex]);
        this.currentPartIndex++;

        // Salvaguarda: bloqueia cliques muito rápidos
        this.input.once("pointerdown", () => {
          if (this.exitConfirmationActive) return;
          if (!this.canAdvanceDialog) return; // Ignora se em cooldown
          
          this.canAdvanceDialog = false; // Bloqueia novos avanços
          this.sound.play("buttonDialog");
          
          // Permite novo avanço apenas após delay
          this.time.delayedCall(700, () => {
            this.canAdvanceDialog = true;
            showNextPart();
          });
        });
      } else {
        showOptions();
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
        .setInteractive({ useHandCursor: true });

      const text = this.add
        .text(700, buttonY, option.text, {
          fontSize: "1rem",
          fontStyle: "bold",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          fontFamily: "Arial",
          wordWrap: { width: 550 },
          align: "center",
        })
        .setOrigin(0.5);

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
    if (this.gameEnded || this.isProcessingOption || !this.canClickDialog()) return;
    this.isProcessingOption = true;

    // Bloqueia novos cliques
    this.optionButtons.forEach((btn) => btn.button.disableInteractive());

    // Atualiza satisfação
    this.satisfaction = Math.max(
      0,
      Math.min(100, this.satisfaction + option.satisfaction),
    );

    // Atualiza expressão da NPC
    this.julieSprite
      .setTexture(
        option.isCorrect ? "happyGreengrocerManager" : "angryGreengrocer",
      )
      .setScale(0.4);

    this.updateSatisfactionBar();

    // Avança diálogo após delay
    this.time.delayedCall(1500, () => {
      if (!this.sys.isActive()) return;
      this.isProcessingOption = false;

      try {
        let nextKey = option.nextDialog;

        // Verifica condição de vitória
        if (nextKey === "check_victory") {
          const config = JULIE_DIALOG.config || {};
          const win = config.scoreToWin ?? 70;
          nextKey =
            this.satisfaction >= win ? "final_success" : "final_failure";
        }

        // Fallback de segurança
        if (!nextKey || !JULIE_DIALOG[nextKey]) {
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

  // Atualiza visual da barra de satisfação
  updateSatisfactionBar() {
    const barWidth = 220,
      barX = 750;

    this.satisfactionBar.setFillStyle(
      this.getSatisfactionColor(this.satisfaction),
    );
    this.satisfactionBar.setDisplaySize(
      (this.satisfaction / 100) * barWidth,
      26,
    );
    this.satisfactionBar.setX(
      barX - barWidth / 2 + ((this.satisfaction / 100) * barWidth) / 2,
    );

    this.satisfactionText.setText(`${this.satisfaction}%`);
  }

  // Agenda tela final
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
          ? "Parabéns! Você conquistou a cliente Julie!"
          : "Infelizmente a cliente não aceitou a proposta. Tente novamente",
        {
          fontSize: "30px",
          color: "#000000",
          fontFamily: "Arial",
          align: "center",
          wordWrap: { width: 700 }
        },
      )
      .setOrigin(0.5);

    // Botão de retorno ao mapa
    const btnExit = this.add.image(512, 480,'btnReturn').setInteractive({ useHandCursor: true }).setScale(1.8);

    // Som de resultado
    this.sound.play(isSuccess ? "soundVictory" : "soundDefeat");

    btnExit.on("pointerdown", () => {
      if (isSuccess) {
        GAME_STATE.playerReputation += 150;

        // Salva progresso da fase
        if (!GAME_STATE.completedSales.includes("greengrocer")) {
          GAME_STATE.completedSales.push("greengrocer");
          saveGameState(GAME_STATE);
        }
      }

      this.scene.start(
        SCENES.MAP,
        isSuccess ? { completedLocation: "greengrocer" } : undefined,
      );
    });
  }
}
