

  const sock = io();
  let rect;
  let anim;

  const app = new PIXI.Application({
      autoResize: true,
      resolution: devicePixelRatio,
      backgroundColor: 0x000000
  });
  document.body.appendChild(app.view);

  app.loader
    .add('images/stickman.json')
    .load(begin);

function begin() {
  onAssetsLoaded();
  start();
}

function onAssetsLoaded() {
    // create an array of textures from an image path
    const frames = [];

    for (let i = 0; i < 24; i++) {
        const val = i < 10 ? `0${i}` : i;

        // magically works since the spritesheet was loaded with the pixi loader
        frames.push(PIXI.Texture.from(`frame00${val}.png`));
    }

    // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
    anim = new PIXI.AnimatedSprite(frames);
    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */

    anim.x = app.screen.width / 3;
    anim.y = app.screen.height / 3;
    anim.anchor.set(0.5,0.5);
    anim.animationSpeed = 0.4;

    app.stage.addChild(anim);
  
  }
function start() {
  anim.interactive = true;
  anim.on('mousedown', function() {
    anim.play();
  });
  anim.onLoop = function() {
    anim.stop();
  }

  const buttons_scale = (e) => {
      if (app.screen.width > app.screen.height) {
          scale = e.width/e.height;
          e.height = (1/3)*app.screen.height;
          e.width = scale*e.height;
      }
      else {
          scale = e.height/e.width;
          e.width = (1/3)*app.screen.width;
          e.height = scale*e.width;
      }
  }
  const button_center = (e, text) => {
      text.y = e.y - (1/2)*e.height - text.height;
      text.x = e.x;
  }

  const detective = PIXI.Sprite.from('images/detective_writing2.png');
  detective.interactive = true;
  detective.on('mousedown', function() {
      sock.emit('turn', "betray");
  })
  detective.on('mouseout', function() {
    detective.texture = PIXI.Texture.from('images/detective_writing2.png')
  })
  detective.on('mouseover', function() {
     detective.texture = PIXI.Texture.from('images/detective_white_writing2.png')
  })
  detective.anchor.set(0.5,0.5);
  buttons_scale(detective);
  detective.x = (1/2)*detective.width;
  detective.y = app.screen.height;
  let betray = new PIXI.Text('Betray');
  betray.anchor.set(0.5,0.5);
  app.stage.addChild(betray);
  app.stage.addChild(detective);

  const cooperate = PIXI.Sprite.from('images/handshake_writing.png');
  cooperate.interactive = true;
  cooperate.on('mousedown', function() {
      sock.emit('turn', "cooperate");
  });
  cooperate.on('mouseout', function() {
    cooperate.texture = PIXI.Texture.from('images/handshake_writing.png')
  })
  cooperate.on('mouseover', function() {
      cooperate.texture = PIXI.Texture.from('images/handshake_white_writing.png')
  });
  cooperate.anchor.set(0.5,0.5);
  buttons_scale(cooperate);
  cooperate.x = app.screen.width - (1/2)*cooperate.width;
  cooperate.y = app.screen.height;
  let coop = new PIXI.Text('Cooperate');
  coop.anchor.set(0.5,0.5);
  app.stage.addChild(coop);
  app.stage.addChild(cooperate);

  let centre = new PIXI.Text('');
  centre.style.fill = 0x3b3b3b;
  centre.anchor.set(0.5,0.5);
  app.stage.addChild(centre);

  let score1 = new PIXI.Text(0);
  let score2 = new PIXI.Text(0);
  score1.style.fill = 0x3b3b3b;
  score2.style.fill = 0x3b3b3b;
  score1.anchor.set(0.5,0.5);
  score2.anchor.set(0.5,0.5);
  app.stage.addChild(score1);
  app.stage.addChild(score2);

  window.addEventListener('resize', resize);

  function resize() {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      buttons_scale(detective);
      buttons_scale(cooperate);

      centre.position.set(
          (1/2)*app.screen.width,
          centre.height
      );

      cooperate.position.set(
          app.screen.width - (1/3)*app.screen.width,
          app.screen.height - (1/2)*cooperate.height
      );
      detective.position.set(
          (1/3)*app.screen.width,
          app.screen.height - (1/2)*detective.height
      );
      button_center(cooperate,coop);
      button_center(detective,betray);
      
      score1.position.set(
          (1/3)*app.screen.width,
          (1/2)*app.screen.height
      );
      score2.position.set(
        (2/3)*app.screen.width,
        (1/2)*app.screen.height
    );

    anim.position.set(
      app.screen.width/2,
      app.screen.height/3
    )
  }

  resize();

const updateScore = (scores) => {
  console.log(scores);
  if (player == 0){
    score1.text = scores[0] + "";
    score2.text = scores[1] + "";
  }
  else {
    score1.text = scores[1] + "";
    score2.text = scores[0] + "";
  }
}

const writeEvent = (text) => {
  centre.text = text;
};

const disconnected = () => {
  writeEvent('Opponent Disconnected')
}

writeEvent('Welcome to RPS');

let player = null;

sock.on('player', (number) => {
  player = number;
})
sock.on('score', (number) => {
  updateScore(number);
})
sock.on('message', writeEvent);
sock.on('disconnectEvent', (text) => {
  disconnected();
});
}

function create() {
  sock.emit('room', window.location.search);
}