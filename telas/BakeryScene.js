import { OSWALDO_DIALOG, VICTORY_CONDITIONS } from './dialogData.js';
import { SCENES } from './gameConfig.js';

/**
 * BakeryScene - Cena da padaria com Oswaldo
 * Sistema de diálogo interativo com opções corretas e erradas
 * Barra de satisfação dinâmica com cores
 */
export class BakeryScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BAKERY });
    this.satisfaction = VICTORY_CONDITIONS.INITIAL_SATISFACTION;
    this.currentDialogKey = 'etapa1';
    this.dialogTexts = {};
    this.optionButtons = [];
    this.gameEnded = false;
    this.satisfactionBar = null;
    this.satisfactionText = null;
    this.feedbackText = null;
  }

  init(data) {
    this.location = data.location;
  }

  preload() {
    // Carregue seus sprites aqui
    // this.load.image('bakeryBackground', 'assets/bakery-background.png');
    // this.load.image('oswaldo', 'assets/oswaldo.png');
  }

  create() {

    document.body.className = 'bg-bakery'; // puxa o plano de fundo da cena pelo css (isso é necessário pois cada cena tem um plano de fundo diferente)

    // Sprite do Oswaldo (placeholder)
    const npcGraphics = this.make.graphics({ x: 0, y: 0 });
    npcGraphics.fillStyle(0xcc8844, 1);
    npcGraphics.fillRect(0, 0, 100, 150);
    npcGraphics.generateTexture('oswaldoSprite', 100, 150);
    npcGraphics.destroy();
    this.add.image(150, 350, 'oswaldoSprite');
    this.add.text(150, 510, 'Oswaldo', {
      fontSize: '14px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Barra de satisfação
    this.createSatisfactionBar();

    // Área de diálogo
    this.createDialogBox();

    // Botão voltar
    const backButton = this.add.text(50, 730, '← Voltar', {
      fontSize: '12px',
      color: '#0066cc',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setInteractive({ useHandCursor: true });

    backButton.on('pointerdown', () => {
      if (!this.gameEnded) {
        this.scene.start(SCENES.MAP);
      }
    });

    // Iniciar diálogo
    this.displayCurrentDialog();
  }

  createSatisfactionBar() {
    // Background da barra
    const barX = 750;
    const barY = 80;
    const barWidth = 220;
    const barHeight = 30;

    const barBg = this.add.rectangle(barX, barY, barWidth, barHeight, 0xcccccc);
    barBg.setStrokeStyle(2, 0x000000);

    // Label
    this.add.text(barX - barWidth / 2 - 20, barY - 30, 'Satisfação:', {
      fontSize: '14px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    });

    // Barra de satisfação preenchida
    this.satisfactionBar = this.add.rectangle(
      barX - barWidth / 2 + (this.satisfaction / 100) * barWidth / 2,
      barY,
      (this.satisfaction / 100) * barWidth,
      barHeight - 4,
      this.getSatisfactionColor(this.satisfaction)
    );

    // Texto de porcentagem
    this.satisfactionText = this.add.text(barX + barWidth / 2 + 20, barY, `${this.satisfaction}%`, {
      fontSize: '14px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);
  }

  getSatisfactionColor(satisfaction) {
    if (satisfaction >= 70) {
      return 0x00aa00; // Verde - Bom
    } else if (satisfaction >= 40) {
      return 0xffaa00; // Laranja - Médio
    } else {
      return 0xcc0000; // Vermelho - Ruim
    }
  }

  createDialogBox() {
    // Background do diálogo, retângulo branco
    const dialogBg = document.createElement('div');
    dialogBg.className = 'dialogBg';

    this.dialogTexts.npc = this.add.dom(550, 260, dialogBg);


    // Feedback de opção correta/errada
    this.feedbackText = this.add.text(520, 320, '', {
      fontSize: '12px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

  }

  displayCurrentDialog() {
    const dialog = OSWALDO_DIALOG[this.currentDialogKey];

    const instrucao = document.createElement('p');
    instrucao.textContent = 'Clique em qualquer lugar para pular';
    instrucao.className = 'instrucao';

    this.instrucao = this.add.dom(550, 390, instrucao);
    
    if (!dialog) {
      console.error('Dialog not found:', this.currentDialogKey);
      return;
    }

    // Limpar feedback anterior
    this.feedbackText.setText('');
    // Limpar botões anteriores
    this.optionButtons.forEach(btn => {
      btn.button.destroy();
      btn.text.destroy();
    });
    this.optionButtons = [];


    if (this.dialogTexts.npc) {
      // Usa 'flex' se o seu CSS usa flexbox, ou 'block' se for normal. 
      // Se usar string vazia '', ele volta ao padrão do CSS.
      this.dialogTexts.npc.setVisible(true);
      this.dialogTexts.npc.node.style.display = 'flex';
      this.dialogTexts.npc.node.innerHTML = dialog.npcText;
    }

    // Verificar se é final
    if (dialog.isEndDialog) {
      this.gameEnded = true;
      this.scheduleEndScreen(dialog.isSuccess);
      return;
    }
  
    const advanceDialog = () => { 
      if (this.dialogTexts.npc.node){
        this.dialogTexts.npc.node.onclick = null;
      }

      this.input.off('pointerdown',advanceDialog);

      if (this.dialogTexts.npc) {
        this.dialogTexts.npc.setVisible(false);
        this.dialogTexts.npc.node.style.display = 'none'; 
        instrucao.textContent = 'Escolha uma opção';
        this.instrucao.setPosition(610,390);
      }

      this.createOptionButtons(dialog.playerOptions);

    }

    this.input.once('pointerdown', advanceDialog);


  }


  //Caixas de diálogo do NPC
  createOptionButtons(options) {
    const startY = 200;
    const spacing = 70;
    const buttonWidth = 600;
    const buttonHeight = 50;

    options.forEach((option, index) => {
      const buttonY = startY + index * spacing;
      
      // Botão
      const button = this.add.rectangle(550, buttonY, buttonWidth, buttonHeight, 0x4444ff);
      button.setStrokeStyle(2, 0x000000);
      button.setInteractive({ useHandCursor: true });

      // Texto do botão
      const text = this.add.text(550, buttonY, option.text, {
        fontSize: '11px',
        color: '#ffffff',
        fontFamily: 'Arial',
        wordWrap: { width: buttonWidth - 20 },
        align: 'center'
      }).setOrigin(0.5);

      // Eventos do botão
      button.on('pointerdown', () => {
        this.handleOptionSelected(option);
      });

      button.on('pointerover', () => {
        button.setFillStyle(0x6666ff);
      });

      button.on('pointerout', () => {
        button.setFillStyle(0x4444ff);
      });

      this.optionButtons.push({ button, text });
    });
  }

  handleOptionSelected(option) {
    if (this.gameEnded) return;

    // Desabilitar todos os botões
    this.optionButtons.forEach(btn => {
      btn.button.disableInteractive();
    });

    // Atualizar satisfação
    this.satisfaction = Math.max(0, Math.min(100, this.satisfaction + option.satisfaction));

    // Mostrar feedback
    const feedbackColor = option.isCorrect ? '#00aa00' : '#cc0000';
    const feedbackText = option.isCorrect ? '✓ Resposta Correta!' : '✗ Resposta Errada';
    this.feedbackText.setColor(feedbackColor);
    this.feedbackText.setText(feedbackText);

    // Atualizar barra de satisfação
    this.updateSatisfactionBar();

    // Aguardar antes de mostrar próximo diálogo
    this.time.delayedCall(1500, () => {
      if (option.nextDialog) {
        this.currentDialogKey = option.nextDialog;
        this.displayCurrentDialog();
      }
    });
  }

  updateSatisfactionBar() {
    const barX = 750;
    const barY = 80;
    const barWidth = 220;

    // Atualizar cor e tamanho da barra
    this.satisfactionBar.setFillStyle(this.getSatisfactionColor(this.satisfaction));
    this.satisfactionBar.setDisplaySize(
      (this.satisfaction / 100) * barWidth,
      26
    );
    this.satisfactionBar.setX(barX - barWidth / 2 + (this.satisfaction / 100) * barWidth / 2);

    // Atualizar texto de porcentagem
    this.satisfactionText.setText(`${this.satisfaction}%`);
  }

  scheduleEndScreen(isSuccess) {
    this.time.delayedCall(2000, () => {
      this.showEndScreen(isSuccess);
    });
  }

  showEndScreen(isSuccess) {
    // Overlay semi-transparente
    const overlay = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.7);

    // Texto de resultado
    const resultText = isSuccess ? 'VENDA CONCLUÍDA!' : 'VENDA NÃO REALIZADA';
    const resultColor = isSuccess ? '#00aa00' : '#cc0000';
    const resultMessage = isSuccess 
      ? 'Parabéns! Você conquistou o cliente Oswaldo!' 
      : 'Infelizmente o cliente não aceitou a proposta.';

    this.add.text(512, 300, resultText, {
      fontSize: '48px',
      color: resultColor,
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(512, 380, resultMessage, {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial',
      wordWrap: { width: 700 },
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(512, 480, `Satisfação Final: ${this.satisfaction}%`, {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Botão voltar
    const backButton = this.add.rectangle(512, 580, 200, 50, 0x4444ff);
    backButton.setStrokeStyle(2, 0xffffff);
    backButton.setInteractive({ useHandCursor: true });

    const backText = this.add.text(512, 580, 'Voltar ao Mapa', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    backButton.on('pointerdown', () => {
      // Atualizar reputação se venda bem-sucedida
      if (isSuccess) {
        const currentReputation = this.registry.get('playerReputation') || 0;
        this.registry.set('playerReputation', currentReputation + 50);
      }
      this.scene.start(SCENES.MAP);
    });

    backButton.on('pointerover', () => {
      backButton.setFillStyle(0x6666ff);
    });

    backButton.on('pointerout', () => {
      backButton.setFillStyle(0x4444ff);
    });
  }

  update() {
    // Lógica de update
  }
}
