import {SCENES } from './gameConfig.js'; // importando as configurações de cenas


export class StartScene extends Phaser.Scene { //classe para a construção da cena
  constructor() {
    super({ key: SCENES.START }); //puxa a key da cena do arquivo importado

}

  preload() { 

  }

  create() {

    document.body.className = 'bg-start'; // puxa o plano de fundo da cena pelo css (isso é necessário pois cada cena tem um plano de fundo diferente)

    // criando os elementos em html para manipular pelo css (COR E PEQUENOS ESTILOS)
    const logoStart = document.createElement('img'); // cria o elemento do tipo IMAGEM para inserir o logo
    logoStart.className = 'logoConexao'; // adiciona o estilo por meio de uma classe - linka com a estilização do css, permitindo manipulação 
    logoStart.src = './assets/logoInicio.png'; // adiciona o caminho da imagem para o atributo URL da tag IMG

    const btnStart = document.createElement('button'); // cria o botao para passar para a proxima fase
    btnStart.className ='btnStart'; // adiciona a classe 
    btnStart.textContent = 'Jogar'; // adiciona o texto que aparece no botão

    // adicionando esses elementos dentro do phaser como elementos dom, passando cordenadas e ponto de origem.
    this.add.dom(230,150, logoStart).setOrigin(0.5);
    this.add.dom(440,320, btnStart).setOrigin(0.5);

    // função para o botão 
    btnStart.addEventListener('click', () => { 
        // ao clicar o botão limpa a classe que adicionamos no começo da cena para limpar o background para a próxima cena
        document.body.className = ''; 

        // inicia a próxima cena, passando a KEY dela 
        this.scene.start(SCENES.INTRODUCTION);
    });
    
  }

  update() {
  }
}