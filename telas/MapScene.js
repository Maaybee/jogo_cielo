import { LOCATIONS, SCENES } from './gameConfig.js';


/**
 * MapScene - Cena principal do mapa urbano
 * Exibe um mapa interativo com diferentes estabelecimentos comerciais
 * Permite clicar em locais para entrar na cena de negociação
 */
export class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MAP });
    this.locations = new Map();
    this.selectedLocation = null;
  }

  preload() {
    // Carregue seus sprites aqui
    // this.load.image('mapBackground', 'assets/map-background.png');
  }

  create() {

    document.body.className = 'bg-map'; // puxa o plano de fundo da cena pelo css (isso é necessário pois cada cena tem um plano de fundo diferente)

    // Criar background do mapa (placeholder)
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x87ceeb, 1);
    graphics.fillRect(0, 0, 1024, 768);
    graphics.generateTexture('mapBackground', 1024, 768);
    graphics.destroy();

    this.add.image(512, 384, 'mapBackground');

    // Adicionar título
    this.add.text(512, 30, 'Mapa da Cidade', {
      fontSize: '28px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Criar locais clicáveis
    this.createLocation(LOCATIONS.BAKERY);

    // Adicionar instruções
    this.add.text(512, 730, 'Clique em um estabelecimento para negociar', {
      fontSize: '14px',
      color: '#000000',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Exibir reputação
    this.add.text(20, 20, `Reputação: ${this.registry.get('playerReputation') || 0}`, {
      fontSize: '16px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    });
  }

  createLocation(location) {
    // Criar sprite placeholder para o local
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xd4a574, 1); // Cor marrom para padaria
    graphics.fillRect(0, 0, location.width, location.height);
    graphics.generateTexture(`location_${location.id}`, location.width, location.height);
    graphics.destroy();

    const sprite = this.physics.add.sprite(
      location.x,
      location.y,
      `location_${location.id}`
    );

    sprite.setInteractive({ useHandCursor: true });
    sprite.on('pointerdown', () => this.selectLocation(location.id));
    sprite.on('pointerover', () => {
      sprite.setScale(1.1);
      this.showLocationInfo(location);
    });
    sprite.on('pointerout', () => {
      sprite.setScale(1);
      this.hideLocationInfo();
    });

    this.locations.set(location.id, sprite);

    // Adicionar label do local
    this.add.text(location.x, location.y + location.height / 2 + 20, location.name, {
      fontSize: '12px',
      color: '#000000',
      fontFamily: 'Arial',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  showLocationInfo(location) {
    console.log('Mostrando info:', location.name);
  }

  hideLocationInfo() {
    console.log('Escondendo info');
  }

  selectLocation(locationId) {
    this.selectedLocation = locationId;
    
    if (locationId === LOCATIONS.BAKERY.id) {
      this.scene.start(SCENES.BAKERY, { location: LOCATIONS.BAKERY });
    }
  }

  update() {
    // Lógica de update do mapa
  }
}
