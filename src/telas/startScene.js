import { SCENES } from "./gameConfig.js";

export class StartScene extends Phaser.Scene {

  // Define a chave da cena e as dimensões da tela
  constructor() {
    super({ key: SCENES.START });
    this.width = 1024;
    this.height = 768;
    this.debug = false; // Salvaguarda: Desativa o log contínuo por padrão para não travar o navegador
  }

  // Carrega os assets visuais antes da cena ser exibida
  preload() {
    this.load.image("btnStart", "assets/btnStart.png");
    this.load.image("logoStart", "assets/logos/logoInicio.png");
    this.load.image("bgStart", "/assets/backgrounds/bgInicio.png");
    this.load.image("airship", "/assets/airship.png");
    this.load.audio("btnStartSound", "assets/sounds/buttonStart.mp3");
  }

  create() {

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

    // Habilita o cursor de ponteiro ao passar o mouse sobre o botão
    btnStart.setInteractive({ cursor: "pointer" });

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
        }
      );
    });
  }

  // Função responsável por configurar o movimento bidimensional do element gráfico.
  // Recebe como parâmetros: posição inicial (xi, yi), posição final (xf, yf),
  // duração total da animação em segundos e o element gráfico a ser animado.
  //
  // O movimento combina dois tipos de cinemática:
  //   - Eixo X: Movimento Uniforme (MU) — velocidade constante
  //   - Eixo Y: Movimento Uniformemente Variado (MUV) — começa do repouso e acelera
  //
  // A trajetória resultante forma uma parábola: o balão parte da direita,
  // sobe até o topo da tela e desce até retornar à height inicial.
  animateAirship(xi, yi, xf, yf, duration, element) {

    // Salvaguarda: Impede divisão por zero garantindo um valor mínimo de duração
    if (duration <= 0) duration = 0.1;

    // Calcula a velocidade constante em X (MU).
    // Para percorrer a distância (xf - xi) em exatamente "duration" segundos,
    // a velocidade deve ser: vx = (xf - xi) / T
    const vx = (xf - xi) / duration;

    // Calcula a aceleração da phase 1 (subida no Phaser = Y diminui).
    // O balão parte do repouso (v0 = 0) em yi e precisa chegar em y = 0 na metade do tempo.
    // Isolando "a" na fórmula da posição S = S0 + ½·a·t², obtemos: a = 2·(yf - yi) / t²
    // Como yf = 0 e t = duration / 2: ay1 = 2 * (0 - yi) / (duration/2)²
    const ay1 = (2 * (0 - yi)) / ((duration / 2) * (duration / 2));

    // Calcula a aceleração da phase 2 (descida no Phaser = Y aumenta).
    // O balão parte do repouso em y = 0 e precisa chegar em yi na segunda metade do tempo.
    // Usando a mesma fórmula: ay2 = 2 * (yi - 0) / (duration/2)²
    const ay2 = (2 * (yi - 0)) / ((duration / 2) * (duration / 2));

    // Armazena todos os dados de animação diretamente no element gráfico.
    // Esses valores serão lidos a cada frame pelo update() para calcular a nova posição.
    element._anim = {
      xi: xi,           // posição X inicial
      yi: yi,           // posição Y inicial
      xf: xf,           // posição X final
      vx: vx,           // velocidade constante em X (MU)
      ay1: ay1,         // aceleração em Y na phase 1 (subida)
      ay2: ay2,         // aceleração em Y na phase 2 (descida)
      phase: 1,          // phase atual do MUV: 1 = subindo, 2 = descendo
      tX: 0,            // tempo acumulado no eixo X em segundos
      tY: 0,            // tempo acumulado no eixo Y em segundos (reseta na phase 2)
      duration: duration  // duração total da animação em segundos
    };
  }

  // Executado automaticamente pelo Phaser a cada frame.
  // Aplica as fórmulas de MU e MUV para atualizar a posição do balão.
  update() {

    // Salvaguarda: Impede crash caso o objeto ou a animação ainda não tenham sido instanciados
    if (!this.airship || !this.airship._anim) return;

    // Atalho para acessar os dados de animação do balão
    const a = this.airship._anim;

    // Calcula o tempo decorrido desde o último frame em segundos.
    // Usar o delta garante que a animação tenha a mesma velocidade em qualquer computador.
    const dt = this.game.loop.delta / 1000;

    // --- EIXO X: Movimento Uniforme (MU) ---
    // Fórmula da posição: x(t) = xi + vx · t
    // A velocidade é constante, então a posição cresce linearmente com o tempo.
    if (a.tX < a.duration) {
      a.tX += dt;
      this.airship.x = a.xi + a.vx * a.tX;
      if (this.debug) console.log('MU | velocidade em X: ', a.vx, ' | posição X: ', this.airship.x);
    } else {
      // Trava o balão na posição final quando o tempo total é atingido
      this.airship.x = a.xf;
    }

    // Avança o tempo acumulado do eixo Y a cada frame
    a.tY += dt;

    // --- EIXO Y: Movimento Uniformemente Variado (MUV) ---

    if (a.phase === 1) {

      // phase 1 — Subida: o balão parte do repouso em yi e acelera para cima.
      // Como ay1 é negativo, Y diminui (no Phaser, Y menor = mais acima na tela).
      // Fórmula da posição: y(t) = yi + ½ · ay1 · t²
      this.airship.y = a.yi + 0.5 * a.ay1 * a.tY * a.tY;
      if (this.debug) console.log('MUV phase 1 | aceleração Y: ', a.ay1, ' | velocidade Y: ', a.ay1 * a.tY, ' | posição Y: ', this.airship.y);

      // Quando metade do tempo total é atingida, o balão chegou ao topo da parábola.
      // Inicia a phase 2 e reseta o tempo do eixo Y para recomeçar o cálculo do MUV.
      if (a.tY >= a.duration / 2) {
        a.phase = 2;
        a.tY = 0;
      }

    } else {

      // phase 2 — Descida: o balão parte do repouso em y = 0 e acelera para baixo.
      // Como ay2 é positivo, Y aumenta (no Phaser, Y maior = mais abaixo na tela).
      // Fórmula da posição: y(t) = 0 + ½ · ay2 · t²
      if (a.tY < a.duration / 2) {
        this.airship.y = 0 + 0.5 * a.ay2 * a.tY * a.tY;
        if (this.debug) console.log('MUV phase 2 | aceleração Y: ', a.ay2, ' | velocidade Y: ', a.ay2 * a.tY, ' | posição Y: ', this.airship.y);
      } else {
        // Trava o balão na posição final yi quando o tempo da phase 2 é atingido
        this.airship.y = a.yi;
      }

    }
  }
}