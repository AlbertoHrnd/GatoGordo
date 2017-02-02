var gameOverState = {
  create: function () {
    gameOverText = game.add.text(0, 0, 'GAME OVER', {font: '50px Arial', fill: '#311', boundsAlignH: "center"});
    mensajeText1 = game.add.text(0,0, 'Tu gato ha tenido que ir al veterinario', {font: '30px', fill: '#633', boundsAlignH: "center"});

    if (contMojado===5) {
    	mensaje = " por un resfriado gatuno.";
    } else {
    	mensaje = "por obesidad gatuna.";
    }

    mensajeText2 = game.add.text(0,0, mensaje, {font: '30px', fill: '#633', boundsAlignH: "center"});
    puntosText = game.add.text(0, 0, 'Has obtenido ' + puntuacion + ' PUNTOS!!', {font: '30px', fill: '#633', boundsAlignH: "center"});

    gameOverText.setTextBounds(0, 60, ancho, 0);
    mensajeText1.setTextBounds(0, 140, ancho, 0);
    mensajeText2.setTextBounds(0, 180, ancho, 0);
    puntosText.setTextBounds(0, 250, ancho, 0);  
  },

  update: function () {
    game.input.onTap.addOnce(function () {
      game.state.start('menu');
    });
  },
};