var loadState = {
	preload: function () {
		var loadingLabel = game.add.text(80,80, "Cargando...", {fontSize: '50px', fill: '#ffffff'});

		game.stage.backgroundColor='#e1ad9a';

		game.load.image('gatoMenu', 'assets/gatoMenu.png');

      	game.load.image('bg', 'assets/kitchen.png');

     	game.load.image('gato', 'assets/cat1.png');
		for (i=1;i<16;i++) {
			game.load.spritesheet('gato'+i, 'assets/cat'+i+'.png');
		}

		game.load.image('sardina', 'assets/sardina.png');

		for (i=1;i<4;i++) {
		game.load.image('bola'+i, 'assets/bola'+i+'.png');
		}
	},

	create: function() {
		game.state.start('menu');
	}
};