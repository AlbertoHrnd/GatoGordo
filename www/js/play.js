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
    tempAguas=0;

    contSardinas=0;
    contGolpesBolas=0;
    contMojado=0;

    updateIntervalSardinas=1;
    updateIntervalBolas=1;
    updateIntervalBrocolis=1;
    updateIntervalAguas=1;

    kkIzq=-50;
    kkDer=ancho;

    this.vigilaSensores();

    game.add.image(0, 0, 'bg');

    this.escribeTextos();    

    gato = game.add.sprite(this.inicioX(), alto-75, 'gato');
    sardinas = game.add.group();
    bolas = game.add.group();
    brocolis = game.add.group();
    kksDerecha = game.add.group();
    kksIzquierda = game.add.group();
    aguas = game.add.group();

    game.physics.enable([ gato, sardinas, bolas, brocolis, kksIzquierda, kksDerecha, aguas ], Phaser.Physics.ARCADE);

    gato.body.collideWorldBounds = true;
    gato.body.setSize(60, 70, 35, 4); // Hacemos el "cuerpo" (zona de detección de colisiones) más pequeño
                                      // Un cuadrado de 60x60 a 35 px en x y 4 en y del inicio del sprite
    gato.body.immovable = true;
    gato.body.gravity.y=200+(gordo*30);
    gato.anchor.x = 0.5;

    sardinas.enableBody = true;

    bolas.enableBody = true;

    brocolis.enableBody = true;

    kksDerecha.enableBody = true;
    kksIzquierda.enableBody = true;

    aguas.enableBody = true; 

    game.input.onDown.add(this.engordaGato, this);    
  },

  update: function() {
    gato.body.velocity.x = velocidad * factorVelocidad;
    gato.body.gravity.y=400+(gordo*40);

    if (velocidad<-0.2) {
      gato.scale.x = -1;
    } else if (velocidad>0.2) {
      gato.scale.x = 1;
    }

    game.physics.arcade.overlap(gato, sardinas, this.comeSardina, null, this);
    game.physics.arcade.overlap(gato, brocolis, this.plantaPino, null, this);
    game.physics.arcade.overlap(gato, aguas, this.mojaGato, null, this);

    game.physics.arcade.collide(gato, bolas);
    game.physics.arcade.collide(gato, kksDerecha);
    game.physics.arcade.collide(gato, kksIzquierda);
    game.physics.arcade.collide(bolas, bolas);
    game.physics.arcade.collide(bolas, sardinas);
    game.physics.arcade.collide(bolas, brocolis);
    game.physics.arcade.collide(bolas, kksDerecha);
    game.physics.arcade.collide(bolas, kksIzquierda);

    this.controlaKks();

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

    tempAguas++;
    if (tempAguas > updateIntervalAguas){

      lado = Math.floor(Math.random() * 2);
      if (lado === 1) {
        lado = ancho;
      }
      console.log(lado);

      this.aguasOut(lado);
      updateIntervalAguas = Math.floor(Math.random() * 10) * 30; // 0 - 10sec @ 30fps
      tempAguas = 0;
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

  aguasOut: function(lado){
      var agua = aguas.create(lado, 50, 'agua');

      velocidadBola = Math.floor(Math.random() * 400)+50;

      if (lado>0) {
        agua.body.velocity.setTo(-velocidadBola,-50);
      } else {
        agua.body.velocity.setTo(velocidadBola,-50);
      }

      agua.body.gravity.y=400;

      // Cuando el agua sale del mundo la elimina.
      agua.checkWorldBounds = true;
      agua.outOfBoundsKill = true; 
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
      if (velocidad>0) {
        kk = kksIzquierda.create(gato.x-50, alto-25, 'kk');
        kkIzq = gato.x - 50;        
      } else {
        kk = kksDerecha.create(gato.x+50, alto-25, 'kk');
        kkDer = gato.x + 50;
      }

      kk.body.moves=false;

      game.time.events.add(Phaser.Timer.SECOND * 5, this.quitakk, kk);
  },

  mojaGato: function(gato, agua) {
    agua.destroy();
    contMojado++;
    if (contMojado === 5) {
      game.state.start("gameOver",true,false,puntuacion);
    }
    if (contMojado == 4) {
      avisoText.text = "El gato se va a constipar!!";
    }
    mojadoText.text = contMojado;
    gato.body.velocity.y=-200;
  },

  controlaKks: function() {
    if (velocidad<0) { // El gato va hacia la izquierda
      if (gato.x - 70 < kkIzq) {
        gato.body.velocity.x=0;
        gato.x += 1;
      }
    } else { // El gato va hacia la derecha
      if (gato.x + 40 > kkDer) {
        gato.body.velocity.x=0;
        gato.x -= 1;
      }
    }
  },

  quitakk: function() {
    var kkADestruir = this;
    this.destroy();

    // Comprobamos kks a la derecha
    if (kksDerecha.countLiving() === 0) {     // Si no queda ninguna
      kkDer=ancho;                            // Resetamos al ancho
    } else {                                  // Si quedan
      kksDerecha.forEachAlive(function(kk) {  // Para cada kk que quede
        if (kk.x < kkADestruir.x) {           // Si esa kk está a la izquierda de la destruida
          kkDer=kk.x;                         // No movemos el tope
        }
      }, this)
    }

    // Comprobamos kks a la izquierda
    if (kksIzquierda.countLiving() === 0) {   // Si no queda ninguna  
      kkIzq=-50;                                // Reseteamos a 0 
    } else {                                  // Si quedan
      kksDerecha.forEachAlive(function(kk) {  // Para cada kk que quede
        if (kk.x > kkADestruir.x) {           // Si esa kk está a la derecha de la destruida
          kkIzq=kk.x;                         // No movemos el tope
        }
      }, this)
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

      if (gordo <= 14) {
        if (gordo == 14) {
          avisoText.text = "El gato está muy gordo!!";
        }
        factorVelocidad = factorVelocidad - 20;
        gato.loadTexture('gato' + gordo, 0);
        peso = 2 + ((gordo-1)/2);
        pesoText.text= peso + " Kilos";
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
        avisoText.text = "";
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
    

    lblScoreText = game.add.text(15,4, "PUNTOS", {fontSize:'10px', fill:'#333'});
    scoreText= game.add.text(15,16, puntuacion, {fontSize:'20px', fill:'#633'});
    lblPesoText = game.add.text(130,4, "PESO", {fontSize:'10px', fill:'#333'});
    pesoText =  game.add.text(130,16, peso + " Kilos", {fontSize:'20px', fill:'#633'});
    lblJuegaBolasText = game.add.text(225,4, "JUEGOS", {fontSize:'10px', fill:'#333'});
    juegaBolasText = game.add.text(225, 16, contGolpesBolas, {fontSize:'20px', fill:'#633'});
    lblMojadoText = game.add.text(275,4, "MOJADO", {fontSize:'10px', fill:'#333'});
    mojadoText = game.add.text(275, 16, contMojado, {fontSize:'20px', fill:'#633'});

    var estiloAviso = { fontSize: "20px", fill: "#833"};
    avisoText = game.add.text(380, 16, "", estiloAviso);
  }, 
};