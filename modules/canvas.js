const Canvas = () => {

}
const N = 4
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
   backgroundColor: '#d4d5d',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);
game.stage.backgroundColor = '#f3cca3';
function preload() {
  // Load your assets here
  // this.load.image('obstacle1', './assets/stone1.png')
  // this.load.image('obstacle2', './assets/stone2.png')
  // this.load.image('obstacle3', './assets/stone3.jpg')
}

function create() {
  // Create a circular map
  const map = this.add.graphics();
  map.fillStyle(0x008800, 1);
  map.fillCircle(400, 400, 400);

  // Create obstacles
  const obstacles = this.physics.add.group();
  for (let i = 0; i < 3; i++) {
    const oName = 'obstacle' + (i + 1);
    const oTextures = this.textures.getFrame(oName);
    const obstacle = obstacles.create(
      Phaser.Math.Between(50, 750),
      Phaser.Math.Between(50, 550),
      oName,
    );
    obstacle.setCollideWorldBounds(true);
    obstacle.setBounce(1);

    obstacle.body.setCircle(obstacle.width / 2);
    // const scale = Math.min(obstacle.width/oTextures.width, obstacle.height/oTextures.height)
    // obstacle.setScale(scale);
    obstacle.body.onWorldBounds = true;
    obstacle.setTint(0x0000ff);
  }

  // Create rabbits
  const rabbits = this.physics.add.group();
  for (let i = 0; i < N; i++) {
    const rabbit = rabbits.create(
      Phaser.Math.Between(50, 750),
      Phaser.Math.Between(50, 550),
      'rabbit'
    );
    rabbit.setCollideWorldBounds(true);
    rabbit.setBounce(1);
    rabbit.energy = 1000;
    rabbit.score = 0;
    rabbit.invincible = false;
    this.physics.add.collider(rabbit, obstacles, function(rabbit, obstacle) {
      rabbit.score -= 1;
      rabbit.setVelocity(-rabbit.body.velocity.x, -rabbit.body.velocity.y);
    });
    rabbit.body.onWorldBounds = true;
    rabbit.body.world.on('worldbounds', function(body) {
      if (body.gameObject === rabbit) {
        rabbit.setVelocity(-rabbit.body.velocity.x, -rabbit.body.velocity.y);
      }
    });
  }
  // Handle collisions between rabbits
  this.physics.add.overlap(rabbits, rabbits, function(rabbit1, rabbit2) {
    if (rabbit1.invincible || rabbit2.invincible) {
      // Do nothing if a rabbit is invincible
    } else {
      let energy1 = rabbit1.energy;
      let energy2 = rabbit2.energy;
      if (energy1 > energy2) {
        rabbit1.score += 1;
        rabbit2.score -= 1;
      } else if (energy1 < energy2) {
        rabbit1.score -= 1;
        rabbit2.score += 1;
      }
      rabbit1.energy = 0;
      rabbit2.energy = 0;
    }
  });

  // Replenish rabbits' energy every 30 seconds
  this.time.addEvent({
    delay: 30000,
    callback: function() {
      rabbits.children.iterate(function(rabbit) {
        rabbit.energy = 1000;
      });
    },
    callbackScope: this,
    loop: true,
  });

  // Handle golden carrot
  let carrot;
  this.time.addEvent({
    delay: 30000,
    callback: function() {
      if (carrot) carrot.destroy();
      carrot = this.physics.add.sprite(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(50, 550),
        'carrot'
      );
      carrot.invincible = true;
      this.time.addEvent({
        delay: 10000,
        callback: function() {
          carrot.invincible = false;
        },
      });
    },
    callbackScope: this,
    loop: true,
  });
  let that = this;
  this.physics.add.overlap(rabbits, carrot, function(rabbit, carrot) {
    rabbit.invincible = true;
    that.time.addEvent({
      delay: 10000,
      callback: function() {
        rabbit.invincible = false;
      },
    });
    carrot.destroy();
  });


  // Handle collisions between rabbits and stones
  this.physics.add.collider(rabbits, obstacles, function(rabbit, stone) {
    rabbit.setVelocity(-rabbit.body.velocity.x, -rabbit.body.velocity.y);
  });
}

function update() {
  // Update your game state here
}

export { Canvas }
