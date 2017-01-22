var gameOverState = {
  create: function () {
    game.add.text(180, 30, 'GAME OVER', {font: '50px Arial', fill: '#311'});
    game.add.text(150, 100, 'Has obtenido ' + puntuacion + ' PUNTOS!!', {font: '30px', fill: '#633'});    
  },

  update: function () {
    game.input.onTap.addOnce(function () {
      game.state.start('menu');
    });
  },
};