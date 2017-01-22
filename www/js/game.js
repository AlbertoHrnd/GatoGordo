alto = document.documentElement.clientHeight;
ancho = document.documentElement.clientWidth;

var game = new Phaser.Game(ancho,alto, Phaser.CANVAS, 'phaser');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('gameOver', gameOverState);

game.state.start('boot');
