import {SCENES } from './gameConfig.js'; // importando as configurações de cenas

export class IntroScene extends Phaser.Scene { //classe para a construção da cen
    constructor() {
        super({ key: SCENES.INTRODUCTION }); //puxa a key da cena do arquivo importado

    }

    preload() { 
        this.load.image('liderCielo', '../assets/liderCielo.png'); //mudei o plano de fundo para que fique condizente com a minha ideia das nuvens
        this.load.image('balonIntro', '../assets/baloonIntro.png'); //mudei o plano de fundo para que fique condizente com a minha ideia das nuvens

    }

    create() {
        document.body.className = 'bg-intro'; // puxa o plano de fundo da cena pelo css (isso é necessário pois cada cena tem um plano de fundo diferente)

        // criando os elementos em html para manipular pelo css (COR E PEQUENOS ESTILOS)
        const introText = document.createElement('p');  // cria o elemento do tipo TEXTO para inserir a saudação inicial do jogo
        introText.className = 'introText'; // adiciona o estilo por meio de uma classe - linka com a estilização do css, permitindo manipulação 
        introText.innerHTML = ` 
            Explore o mapa, selecione um comércio para começar e conquiste o maior número de vendas possível! 
            <span style="color: red;">você ganha pontos!</span> a cada negócio fechado!!
        `; // tezto da saudação com uma tag span para mudar a cor do texto de uma parte especifica da mensagem

        const introTextClick = document.createElement('p'); // adiciona mais uma tag de texto
        introTextClick.className = 'introTextClick';  // adiciona a classe 
        introTextClick.textContent = "Clique em qualquer lugar da tela" // conteudo da tag
 
        // adiciona os elementos pré carregados no phaser
        this.add.image(200, 250, 'liderCielo').setScale(1.2)
        this.add.image(630, 150, 'balonIntro').setScale(1.2)

        // adicionando esses elementos dentro do phaser como elementos dom, passando cordenadas e escala.
        this.add.dom(650, 150, introText).setScale(1.2)
        this.add.dom(640, 300, introTextClick).setScale(1.25)

        // usando um método próprio para adicionar a função de click na tela toda
        // diferente da tela inicial que eu usei um addEventListener
        // motivo: na primeira tela o click é "guiado" pelo botão, então quando a cena acaba, o click se destroi
        //se eu usasse nesse caso, poderia acarretar em cliques fantasmas. 
        this.input.once('pointerdown', () => {
            
            // ao clicar EM QUALQUER LUGAR DA TELA: limpa a classe que adicionamos no começo da cena para limpar o background para a próxima cena
            document.body.className = ''; 

            // inicia a próxima cena, passando a KEY dela 
            this.scene.start(SCENES.MAP);
        });

    }
} 