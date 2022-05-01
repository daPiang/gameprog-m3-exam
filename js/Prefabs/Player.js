import Entity from "./Entity.js";
import PlayerController from "./PlayerController.js";

export default class Player extends Entity{
    constructor(physics, anims, input) {
        super(physics, anims);
        this.input = input;

        this.jumpCount = 0;
        this.maxJump = 1;
        this.isRight = true;

        this.player = this.physics.add.sprite(300,300, "player_atlas", "idle00.png")
        .setScale(2.3)
        .setSize(20,30);

        this.player.setCollideWorldBounds(false);
        this.player.setGravityY(1000);

        this.controller = new PlayerController(this.player);
        this.controls = this.input.keyboard.createCursorKeys();

        this.RIGHT = this.controls.right;
        this.LEFT = this.controls.left;

        this.SPACE_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.anims.create({
            key: 'idle',
            frameRate: 6,
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'idle0',
                suffix: '.png',
                start: 0,
                end: 4
            }),
            repeat: -1,
        });

        this.anims.create({
            key: 'run',
            frameRate: 8,
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'run0',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            repeat: -1,
        });
    }

    update() {
        //Left and Right Movement
        if(this.RIGHT.isDown) {
            this.controller.setState('moveRight');
            this.isRight = true;
        }
        if(this.LEFT.isDown) {
            this.controller.setState('moveLeft');
            this.isRight = false;
        }

        //Jump with Double Jump
        if(Phaser.Input.Keyboard.JustDown(this.controls.up) && (this.player.body.onFloor() || this.jumpCount < this.maxJump)) {
            this.controller.setState('moveUp');
            ++this.jumpCount;
        }
        if(this.player.body.onFloor()) {
            this.jumpCount = 0;
        }

        //Downwards Dash
        if(Phaser.Input.Keyboard.JustDown(this.controls.down) && !this.player.body.onFloor()) {
            this.controller.setState('moveDown');
        }

        //Side Dash BUGGED
        if(Phaser.Input.Keyboard.JustDown(this.SPACE_KEY)) {
            console.log('dash');
            switch(this.isRight) {
                case true:
                    this.controller.setState('dashRight');
                    break;
                case false:
                    this.controller.setState('dashLeft');
                    break;
            }
        }

        //Idle State Checker
        if(this.RIGHT.isUp && this.LEFT.isUp) {
            this.controller.setState('idle');
        }
    }
}