var menuState = {
	create: function() {

		game.add.image(0, alto-303, 'gatoMenu');

		game.add.text(315, 50, 'EL GATO GORDO', {fontSize: '40px', fill: '#633'});

		game.add.text(400, 250, 'Pulsa la pantalla', {fontSize: '20px', fill: '#633'});

		game.input.onDown.addOnce(this.start, this);
	},

	start: function() {
		game.state.start('play');
	}
};