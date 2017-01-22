var playState={
  create: function(){

    velocidad=0;
    puntuacion=0;
    gordo = 1;
    peso = 2;
    factorVelocidad = 350;

    tempSardinas=0;
    tempBolas=0;
    tempBrocolis=0;

    contSardinas=0;
    contGolpesBolas=0;

    updateIntervalSardinas=1;
    updateIntervalBolas=1;
    updateIntervalBrocolis=1;

    kkX=0;

    this.vigilaSensores();

    game.add.image(0, 0, 'bg');

    this.escribeTextos();    

    gato = game.add.sprite(this.inicioX(), alto-75, 'gato');
    sardinas = game.add.group();
    bolas = game.add.group();
    brocolis = game.add.group();
    kks = game.add.group();

    game.physics.enable([ gato, sardinas, bolas, brocolis, kks ], Phaser.Physics.ARCADE);

    gato.body.collideWorldBounds = true;
    gato.body.immovable = true;
    gato.body.bounce.set(0);
    gato.body.allowGravity = false;

    sardinas.enableBody = true;

    bolas.enableBody = true;

    brocolis.enableBody = true;

    kks.enableBody = true;    

    game.input.onDown.add(this.engordaGato, this);    
  },

  update: function() {
    gato.body.velocity.x = velocidad * factorVelocidad;

    game.physics.arcade.overlap(gato, sardinas, this.comeSardina, null, this);
    game.physics.arcade.overlap(gato, brocolis, this.plantaPino, null, this);

    game.physics.arcade.collide(gato, bolas);
    game.physics.arcade.collide(gato, kks);
    game.physics.arcade.collide(bolas, bolas);
    game.physics.arcade.collide(bolas, sardinas);
    game.physics.arcade.collide(bolas, brocolis);
    game.physics.arcade.collide(bolas, kks);

    if (gato.x < kkX) {
      gato.body.velocity.x=0;
      gato.x += 1;
    }

    tempSardinas++;
    if (tempSardinas > updateIntervalSardinas){
      this.sardinasOut();
      updateIntervalSardinas = Math.floor(Math.random() * 5) * 30; // 0 - 7sec @ 30fps
      tempSardinas = 0;
    }

    tempBolas++;
    if (tempBolas > updateIntervalBolas){
      this.bolasOut();
      updateIntervalBolas = Math.floor(Math.random() * 40) * 30; // 0 - 40sec @ 30fps
      tempBolas= 0;
    }

    tempBrocolis++;
    if (tempBrocolis > updateIntervalBrocolis){
      this.brocolisOut();
      updateIntervalBrocolis = Math.floor(Math.random() * 10) * 30; // 0 - 10sec @ 30fps
      tempBrocolis= 0;
    }
  },

  sardinasOut: function(){
      var sardina = sardinas.create(this.inicioX(), -40, 'sardina');

      sardina.body.gravity.y = 200;

      // Cuando la sardina sale del mundo la elimina.
      sardina.checkWorldBounds = true;
      sardina.outOfBoundsKill = true;    
  },

  bolasOut: function(){
      tipoBola = Math.floor(Math.random() * 3)+1;

      var bola = bolas.create(this.inicioX(), -40, 'bola'+tipoBola);

      bola.body.velocity.setTo(400,400);
      bola.body.gravity.y = 150;
      bola.body.mass = 0.4;

      // Para que rebote
      bola.body.bounce.set(0.9,0.9);

      // Para que gire
      bola.anchor.setTo(0.5, 0.5);
      bola.body.angularVelocity = 300;

      bola.body.collideWorldBounds = true;

      bola.body.onCollide = new Phaser.Signal();
      bola.body.onCollide.add(this.juegaGato, this);
  },

  brocolisOut: function(){
      var brocoli = brocolis.create(this.inicioX(), -40, 'brocoli');

      brocoli.body.gravity.y = 250;

      // Cuando el brocoli sale del mundo la elimina.
      brocoli.checkWorldBounds = true;
      brocoli.outOfBoundsKill = true;      
  },

  comeSardina: function(gato, sardina) {
      sardina.destroy();
      contSardinas++;
      puntuacion = puntuacion + 10;
      scoreText.text = puntuacion;

      if (contSardinas === 5) {
        this.engordaGato();
        contSardinas = 0;
      }
  },

  plantaPino: function(gato, brocoli) {
      brocoli.destroy();
      kk = kks.create(gato.x-18, alto-25, 'kk');
      kk.body.moves=false;
      kkX = gato.x + 15;
      game.time.events.add(Phaser.Timer.SECOND * 5, this.quitakk, this);
  },

  quitakk: function() {
    kks.callAll('destroy');
    if (kks.countLiving() === 0) {
      kkX=0;
    }
  },

  juegaGato: function(obj1, obj2) {
      if (obj2.key.indexOf('gato') !== -1) {
        contGolpesBolas++;

        if (contGolpesBolas >= 10) {
          bolas.callAll('kill');
          this.adelgazaGato();
          contGolpesBolas=0;
        }

      juegaBolasText.text = contGolpesBolas;
    }
  },

  engordaGato: function() {
      gordo = gordo + 1;

      if (gordo === 15) {
        game.state.start("gameOver",true,false,puntuacion);
      }

      if (gordo < 14) {
        factorVelocidad = factorVelocidad - 20;
        gato.loadTexture('gato' + gordo, 0);
        peso = 2 + ((gordo-1)/2);
        pesoText.text= peso + " Kilos";
      }

      if (gordo == 14) {
        avisoGordoText.text = "El gato está muy gordo!!";
      }
  },

  adelgazaGato: function() {
      if (gordo > 1) {
        gordo = gordo - 1;
        factorVelocidad = factorVelocidad + 20;
        gato.loadTexture('gato' + gordo, 0);
        peso = 2 + ((gordo-1)/2);
        pesoText.text= peso + " Kilos";
      }

      if (gordo == 13) {
        avisoGordoText.text = "";
      }
  },

  inicioX: function() {
    return this.numeroAleatorioHasta(ancho-53);
  },

  numeroAleatorioHasta: function(limite) {
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function() {

    function onError() {
      console.log('Error!!');
    }

    function onSuccess(datosAceleracion) {
      registraDireccion(datosAceleracion);
    }

    function registraDireccion(datosAceleracion){
      velocidad = datosAceleracion.y;
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{frequency: 10});
  }, 

  escribeTextos: function() {
    var bar = game.add.graphics();
    bar.beginFill(0xebc4de, 0.8);
    bar.drawRect(0, 0, ancho, 40);
    

    lblScoreText = game.add.text(16,4, "PUNTOS", {fontSize:'10px', fill:'#333'});
    scoreText= game.add.text(16,16, puntuacion, {fontSize:'20px', fill:'#633'});
    lblPesoText = game.add.text(146,4, "PESO", {fontSize:'10px', fill:'#333'});
    pesoText =  game.add.text(146,16, peso + " Kilos", {fontSize:'20px', fill:'#633'});
    lblJuegaBolasText = game.add.text(242,4, "JUEGOS CON BOLAS", {fontSize:'10px', fill:'#333'});
    juegaBolasText = game.add.text(242, 16, contGolpesBolas, {fontSize:'20px', fill:'#633'});

    var estiloAviso = { fontSize: "20px", fill: "#833"};
    avisoGordoText = game.add.text(380, 16, "", estiloAviso);
  }, 
};