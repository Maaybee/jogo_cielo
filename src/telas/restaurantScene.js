// Importa os diálogos, regras de vitória e chaves das cenas
import { TXORI_DIALOG } from "./dialogData.js";
import { SCENES, GAME_STATE } from "./gameConfig.js";
import { saveGameState } from "./cookieManager.js";

// Define a cena do Restaurante com sistema de diálogo e negociação
export class RestaurantScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.RESTAURANT });

    // Inicializa variáveis principais da fase
    this.txoriSprite = null;
    this.satisfaction = 50; // Nível de satisfação inicial
    this.currentDialogKey = "step1"; // Diálogo atual
    this.currentPartIndex = 0; // Controle de partes do diálogo
    this.dialogTexts = {};
    this.optionButtons = [];
    this.gameEnded = false;
    this.satisfactionBar = null;
    this.satisfactionText = null;
    this.feedbackText = null;
    this.dialogBg = null;
    this.instruction = null;
    this.width = 1024;
    this.height = 768;
  }

  // Reinicia o estado da cena ao ser iniciada
  init(data) {
    this.location = data?.location || null;

    const config = TXORI_DIALOG.config || {};
    this.satisfaction = config.initialScore ?? 50;
    this.currentDialogKey = "step1";
    this.currentPartIndex = 0;
    this.gameEnded = false;
    this.optionButtons = [];
    this.isProcessingOption = false; // Evita múltiplos cliques simultâneos
  }

  // Carrega todos os assets da fase
  preload() {
    // Elementos visuais da fase
    this.load.image("bgRestaurant", "/assets/backgrounds/bgRestaurant.png");
    this.load.image("dialogBoxLevel", "/assets/levels/dialogBoxLevels.png");
    this.load.image("btnExit", "/assets/levels/btnExit.png");
    this.load.image("emphasis", "/assets/levels/light.png");

    // Sprites do NPC (TXORI)
    this.load.image("restaurantowner", "/assets/characters/restaurantowner.png");
    this.load.image("angryRestaurantOwner", "/assets/characters/angryrestaurantowner.png");
    this.load.image("happyRestaurantOwner", "/assets/characters/happyrestaurantowner.png");

    // UI e sons
    this.load.image("optionBox", "assets/levels/optionBox.png");
    this.load.audio("buttonDialog", "assets/sounds/buttonDialog.mp3");
    this.load.audio("soundVictory", "assets/sounds/soundVictory.mp3");
    this.load.audio("soundDefeat", "assets/sounds/soundDefeat.mp3");
    this.load.audio("restaurantMusic", "assets/sounds/restaurantMusic.mp3");
  }

  // Cria os elementos visuais e inicia a lógica da cena
  create() {

    // Música de fundo em loop
    this.sound.play("restaurantMusic", { loop: true, volume: 0.1 });

    // Garante que o áudio pare ao sair da cena
    this.events.on("shutdown", () => {
      this.sound.stopAll();
    });

    // Fundo da cena
    this.add.image(this.width / 2, this.height / 2, "bgRestaurant").setScale(1);

    // Overlay escuro para destacar a interface
    this.add.rectangle(
      this.width / 2,
      this.height / 2,
      this.width,
      this.height,
      0x000000,
      0.5
    );

    // Sprite inicial do NPC
    this.txoriSprite = this.add.image(230, 590, "restaurantowner");

    // Elemento visual decorativo
    this.add.image(760, 80, "emphasis").setScale(0.26);

    // Botão de voltar ao mapa
    const backButton = this.add
      .image(150, 80, "btnExit")
      .setInteractive({ useHandCursor: true })
      .setScale(0.2);

    backButton.on("pointerdown", () => {
      if (!this.gameEnded) {
        this.sound.play("buttonSelectMap");
        this.time.delayedCall(150, () => {
          this.scene.start(SCENES.MAP);
        });
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
      this.getSatisfactionColor(this.satisfaction)
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
      .text(450, 250, "", {
        fontSize: "2rem",
        color: "#000000",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.6)
      .setDepth(30);
  }

  // Controla a exibição do diálogo atual
  displayCurrentDialog(autoShowOptions = false) {
    this.txoriSprite.setTexture("restaurantowner").setScale(0.4);
    this.dialogBg.setVisible(true);

    const dialog = TXORI_DIALOG[this.currentDialogKey];

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
    this.instruction = this.add.text(520, 720, "Clique para continuar", {
      fontSize: "1.5rem",
      color: "#ffffff",
      fontFamily: "Arial",
    }).setOrigin(0.5);

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
      const endText = Array.isArray(dialog.npcText) ? dialog.npcText.join(' ') : dialog.npcText;
      this.dialogTexts.npc.setText(endText);
      this.scheduleEndScreen(dialog.isSuccess);
      return;
    }

    // Mostra opções após o diálogo
    const showOptions = () => {
      if (!this.sys.isActive()) return;

      this.dialogTexts.npc.setVisible(false);

      const options = dialog.playerOptions || [];
      if (options.length === 0) {
        console.warn(`Opções não encontradas para o diálogo: ${this.currentDialogKey}`);
        return;
      }

      this.createOptionButtons(options);
      this.instruction.setText("Escolha uma opção");
      this.instruction.setPosition(700, 210);
    };

    // Divide falas do NPC em partes
    const npcTexts = Array.isArray(dialog.npcText) ? dialog.npcText : [dialog.npcText];
    this.currentPartIndex = 0;

    // Exibe partes do diálogo sequencialmente
    const showNextPart = () => {
      if (this.currentPartIndex < npcTexts.length) {
        this.dialogTexts.npc.setText(npcTexts[this.currentPartIndex]);
        this.currentPartIndex++;

        this.input.once("pointerdown", () => {
          this.sound.play("buttonDialog");
          showNextPart();
        });
      } else {
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
    if (this.gameEnded || this.isProcessingOption) return;
    this.isProcessingOption = true;

    // Bloqueia novos cliques
    this.optionButtons.forEach((btn) => btn.button.disableInteractive());

    // Feedback visual
    const feedbackColor = option.isCorrect ? "#00aa00" : "#cc0000";
    this.feedbackText
      .setColor(feedbackColor)
      .setText(option.isCorrect ? "✓ Resposta Correta!" : "✗ Resposta Errada");

    // Atualiza satisfação
    this.satisfaction = Math.max(0, Math.min(100, this.satisfaction + option.satisfaction));

    // Atualiza expressão do NPC
    this.txoriSprite.setTexture(
      option.isCorrect ? "happyRestaurantOwner" : "angryRestaurantOwner"
    ).setScale(0.4);

    this.updateSatisfactionBar();

    // Avança diálogo após delay
    this.time.delayedCall(1500, () => {
      if (!this.sys.isActive()) return;
      this.isProcessingOption = false;

      try {
        let nextKey = option.nextDialog;

        // Verifica condição de vitória
        if (nextKey === "check_victory") {
          const config = TXORI_DIALOG.config || {};
          const win = config.scoreToWin ?? 70;
          nextKey = this.satisfaction >= win ? "final_success" : "final_failure";
        }

        // Fallback de segurança
        if (!nextKey || !TXORI_DIALOG[nextKey]) {
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

    this.satisfactionBar.setFillStyle(this.getSatisfactionColor(this.satisfaction));
    this.satisfactionBar.setDisplaySize((this.satisfaction / 100) * barWidth, 26);
    this.satisfactionBar.setX(
      barX - barWidth / 2 + ((this.satisfaction / 100) * barWidth) / 2
    );

    this.satisfactionText.setText(`${this.satisfaction}%`);
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

    const resultColor = isSuccess ? "#00aa00" : "#cc0000";

    this.add
      .text(512, 300, isSuccess ? "VENDA CONCLUÍDA!" : "VENDA NÃO REALIZADA", {
        fontSize: "48px",
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
          ? "Parabéns! Você conquistou o cliente TXORI!"
          : "Infelizmente o cliente não aceitou a proposta.",
        {
          fontSize: "18px",
          color: "#ffffff",
          fontFamily: "Arial",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Botão de retorno ao mapa
    const btn = this.add
      .rectangle(512, 580, 200, 50, 0x4444ff)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(512, 580, "Voltar ao Mapa", {
        fontSize: "16px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Som de resultado
    this.sound.play(isSuccess ? "soundVictory" : "soundDefeat");

    btn.on("pointerdown", () => {
      if (isSuccess) {
        GAME_STATE.playerReputation += 150;

        // Salva progresso da fase
        if (!GAME_STATE.completedSales.includes("restaurant")) {
          GAME_STATE.completedSales.push("restaurant");
          saveGameState(GAME_STATE);
        }
      }

      this.scene.start(SCENES.MAP);
    });
  }
}