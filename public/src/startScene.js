import { SCENES } from "./gameConfig.js";

export class StartScene extends Phaser.Scene {
  // Define a key da cena e as dimensões da tela
  constructor() {
    super({ key: SCENES.START });
    this.width = 1024;
    this.height = 768;
    this.debug = false; // Salvaguarda: Desativa o log contínuo por padrão para não travar o navegador
  }

  // Carrega os assets visuais antes da cena ser exibida
  preload() {
    this.load.image("btnStart", "public/assets/btnStart.png");
    this.load.image("btnHowToPlay", "public/assets/levels/btnCmJogar.png");
    this.load.image("logoStart", "public/assets/logos/logoInicio.png");
    this.load.image("bgStart", "public/assets/backgrounds/bgInicio.png");
    this.load.image("airship", "public/assets/airship.png");
    this.load.audio("btnStartSound", "public/assets/sounds/buttonStart.mp3");
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Adiciona o fundo centralizado na tela
    this.add
      .image(this.width / 2, this.height / 2, "bgStart")
      .setOrigin(0.5)
      .setScale(0.5);

    // Cria o balão na posição inicial e salva a referência para uso no update()
    this.airship = this.add.image(1024, 384, "airship").setScale(0.06);

    // Inicia o movimento do balão chamando a função com os parâmetros definidos:
    // posição inicial (1024, 384), posição final (0, 384), duração de 5 segundos
    this.animateAirship(1024, 384, 0, 384, 5, this.airship);

    // Adiciona o logotipo centralizado na parte superior da tela
    this.add
      .image(this.width / 2, this.height / 2.4, "logoStart")
      .setOrigin(0.5)
      .setScale(1.5);

    // Cria o botão de início centralizado na parte inferior da tela
    const btnStart = this.add
      .image(this.width / 2, this.height / 1.3, "btnStart")
      .setOrigin(0.5)
      .setScale(1.5);

    const btnHowToPlay = this.add
      .image(this.width / 2, this.height / 1.13, "btnHowToPlay")
      .setOrigin(0.5)
      .setScale(1.5);

    // Habilita o cursor de ponteiro ao passar o mouse sobre o botão
    btnStart.setInteractive({ cursor: "pointer" });
    btnHowToPlay.setInteractive({ cursor: "pointer" });

    // Aumenta o botão levemente ao passar o mouse — feedback visual
    btnStart.on("pointerover", () => {
      btnStart.setScale(1.55);
    });

    // Retorna o botão ao tamanho original ao retirar o mouse
    btnStart.on("pointerout", () => {
      btnStart.setScale(1.5);
    });

    // Ao clicar no botão, executa fade-out e troca para a cena do mapa
    btnStart.on("pointerdown", () => {
      this.sound.play("btnStartSound"); // Executa o som do botão ao apertar.
      this.cameras.main.fadeOut(700, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start(SCENES.MAP);
        },
      );
    });
    // Aumenta o botão levemente ao passar o mouse — feedback visual
    btnHowToPlay.on("pointerover", () => {
      btnHowToPlay.setScale(1.55);
    });

    // Retorna o botão ao tamanho original ao retirar o mouse
    btnHowToPlay.on("pointerout", () => {
      btnHowToPlay.setScale(1.5);
    });

    // Ao clicar no botão, executa fade-out e troca para a cena do mapa
    btnHowToPlay.on("pointerdown", () => {
      this.sound.play("btnStartSound"); // Executa o som do botão ao apertar.
      this.cameras.main.fadeOut(700, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start(SCENES.HOWTOPLAY);
        },
      );
    });
  }

  // Função responsável por configurar o movimento bidimensional do element gráfico.
  // Recebe como parâmetros: posição inicial (xInitial, yInitial), posição final (xFinal, yFinal),
  // duração total da animação em segundos e o element gráfico a ser animado.
  //
  // O movimento combina dois tipos de cinemática:
  //   - Eixo X: Movimento Uniforme (MU) — velocidade constante
  //   - Eixo Y: Movimento Uniformemente Variado (MUV) — começa do repouso e acelera
  //
  // A trajetória resultante forma uma parábola: o balão parte da direita,
  // sobe até o topo da tela e desce até retornar à height inicial.
  animateAirship(xInitial, yInitial, xFinal, yFinal, duration, element) {
    // Salvaguarda: Impede divisão por zero garantindo um valor mínimo de duração
    if (duration <= 0) duration = 0.1;

    // Calcula a velocidade constante em X (MU).
    // Para percorrer a distância (xFinal - xInitial) em exatamente "duration" segundos,
    // a velocidade deve ser: velocityX = (xFinal - xInitial) / T
    const velocityX = (xFinal - xInitial) / duration;

    // Calcula a aceleração da phase 1 (subida no Phaser = Y diminui).
    // O balão parte do repouso (v0 = 0) em yInitial e precisa chegar em y = 0 na metade do tempo.
    // Isolando "a" na fórmula da posição S = S0 + ½·a·t², obtemos: a = 2·(yFinal - yInitial) / t²
    // Como yFinal = 0 e t = duration / 2: accelerationY1 = 2 * (0 - yInitial) / (duration/2)²
    const accelerationY1 = (2 * (0 - yInitial)) / ((duration / 2) * (duration / 2));

    // Calcula a aceleração da phase 2 (descida no Phaser = Y aumenta).
    // O balão parte do repouso em y = 0 e precisa chegar em yInitial na segunda metade do tempo.
    // Usando a mesma fórmula: accelerationY2 = 2 * (yInitial - 0) / (duration/2)²
    const accelerationY2 = (2 * (yInitial - 0)) / ((duration / 2) * (duration / 2));

    // Armazena todos os dados de animação diretamente no element gráfico.
    // Esses valores serão lidos a cada frame pelo update() para calcular a nova posição.
    element._anim = {
      xInitial: xInitial, // posição X inicial
      yInitial: yInitial, // posição Y inicial
      xFinal: xFinal, // posição X final
      velocityX: velocityX, // velocidade constante em X (MU)
      accelerationY1: accelerationY1, // aceleração em Y na phase 1 (subida)
      accelerationY2: accelerationY2, // aceleração em Y na phase 2 (descida)
      phase: 1, // phase atual do MUV: 1 = subindo, 2 = descendo
      timeAccumulatedX: 0, // tempo acumulado no eixo X em segundos
      timeAccumulatedY: 0, // tempo acumulado no eixo Y em segundos (reseta na phase 2)
      duration: duration, // duração total da animação em segundos
    };
  }

  // Executado automaticamente pelo Phaser a cada frame.
  // Aplica as fórmulas de MU e MUV para atualizar a posição do balão.
  update() {
    // Salvaguarda: Impede crash caso o objeto ou a animação ainda não tenham sido instanciados
    if (!this.airship || !this.airship._anim) return;

    // Atalho para acessar os dados de animação do balão
    const animationData = this.airship._anim;

    // Calcula o tempo decorrido desde o último frame em segundos.
    // Usar o delta garante que a animação tenha a mesma velocidade em qualquer computador.
    const deltaTime = this.game.loop.delta / 1000;

    // --- EIXO X: Movimento Uniforme (MU) ---
    // Fórmula da posição: x(t) = xInitial + velocityX · t
    // A velocidade é constante, então a posição cresce linearmente com o tempo.
    if (animationData.timeAccumulatedX < animationData.duration) {
      animationData.timeAccumulatedX += deltaTime;
      this.airship.x = animationData.xInitial + animationData.velocityX * animationData.timeAccumulatedX;
      if (this.debug)
        console.log(
          "MU | velocidade em X: ",
          animationData.velocityX,
          " | posição X: ",
          this.airship.x,
        );
    } else {
      // Trava o balão na posição final quando o tempo total é atingido
      this.airship.x = animationData.xFinal;
    }

    // Avança o tempo acumulado do eixo Y a cada frame
    animationData.timeAccumulatedY += deltaTime;

    // --- EIXO Y: Movimento Uniformemente Variado (MUV) ---

    if (animationData.phase === 1) {
      // phase 1 — Subida: o balão parte do repouso em yInitial e acelera para cima.
      // Como accelerationY1 é negativo, Y diminui (no Phaser, Y menor = mais acima na tela).
      // Fórmula da posição: y(t) = yInitial + ½ · accelerationY1 · t²
      this.airship.y = animationData.yInitial + 0.5 * animationData.accelerationY1 * animationData.timeAccumulatedY * animationData.timeAccumulatedY;
      if (this.debug)
        console.log(
          "MUV phase 1 | aceleração Y: ",
          animationData.accelerationY1,
          " | velocidade Y: ",
          animationData.accelerationY1 * animationData.timeAccumulatedY,
          " | posição Y: ",
          this.airship.y,
        );

      // Quando metade do tempo total é atingida, o balão chegou ao topo da parábola.
      // Inicia a phase 2 e reseta o tempo do eixo Y para recomeçar o cálculo do MUV.
      if (animationData.timeAccumulatedY >= animationData.duration / 2) {
        animationData.phase = 2;
        animationData.timeAccumulatedY = 0;
      }
    } else {
      // phase 2 — Descida: o balão parte do repouso em y = 0 e acelera para baixo.
      // Como accelerationY2 é positivo, Y aumenta (no Phaser, Y maior = mais abaixo na tela).
      // Fórmula da posição: y(t) = 0 + ½ · accelerationY2 · t²
      if (animationData.timeAccumulatedY < animationData.duration / 2) {
        this.airship.y = 0 + 0.5 * animationData.accelerationY2 * animationData.timeAccumulatedY * animationData.timeAccumulatedY;
        if (this.debug)
          console.log(
            "MUV phase 2 | aceleração Y: ",
            animationData.accelerationY2,
            " | velocidade Y: ",
            animationData.accelerationY2 * animationData.timeAccumulatedY,
            " | posição Y: ",
            this.airship.y,
          );
      } else {
        // Trava o balão na posição final yInitial quando o tempo da phase 2 é atingido
        this.airship.y = animationData.yInitial;
      }
    }
  }
}
