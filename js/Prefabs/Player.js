import Entity from "./Entity.js";

export default class Player extends Entity{
    constructor(physics, anims, input) {
        super(physics, anims);
        this.input = input;

        //Movement modifier
        this.addSpeed = 0;

        //Jump Variables
        this.jumpCount = 0;
        this.maxJump = 1;

        //Dash Variables
        this.dashCount = 0;
        this.maxDash = 2;

        //Direction Bool
        this.isRight = true;

        //State Bool
        this.inAir = false;
        this.isDashing = false;
        this.isMoving = false;
        this.isIdle = true;
        this.isSprinting = false;

        //Init Player
        this.player = this.physics.add.sprite(300,300, "player_atlas", "idle00.png")
        .setSize(20,30);

        this.player.setCollideWorldBounds(false);
        this.player.setGravityY(1000);

        //Controls Init
        this.controls = this.input.keyboard.createCursorKeys();

        //Input Keys(arrow)
        this.RIGHT = this.controls.right;
        this.LEFT = this.controls.left;
        this.UP = this.controls.up;

        //Input Keys(non-arrow)
        this.SPACE_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.SHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //Local Anims
        this.player.anims.create({
            key: 'idle',
            frameRate: 8,
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'idle0',
                suffix: '.png',
                start: 0,
                end: 4
            }),
            repeat: -1,
        });

        this.player.anims.create({
            key: 'walk',
            frameRate: 8,
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'run0',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            repeat: -1,
        });

        this.player.anims.create({
            key: 'run',
            frameRate: 16,
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

        //Movement
        if((Phaser.Input.Keyboard.JustDown(this.UP) || (Phaser.Input.Keyboard.JustDown(this.W))) && (this.jumpCount < this.maxJump)) {
            this.inAir = true;
            this.isIdle = false;

            ++this.jumpCount;

            this.player.setVelocityY(-300);
        } else if((this.RIGHT.isDown || this.D.isDown) && !this.isDashing) {
            this.isMoving = true;
            this.isIdle = false;

            this.isRight = true;
            this.player.flipX = false;

            this.player.setVelocityX(150 + this.addSpeed);
        } else if((this.LEFT.isDown || this.A.isDown) && !this.isDashing) {
            this.isMoving = true;
            this.isIdle = false;

            this.isRight = false;
            this.player.flipX = true;

            this.player.setVelocityX(-150 + -this.addSpeed);
        } else if(!this.isIdle && !this.inAir) {
            this.isIdle = true;
            this.isMoving = false;

            this.player.setVelocityX(0);
        }

        //Sprint
        if(this.SHIFT.isDown) {
            this.isSprinting = true;

            this.addSpeed = 100;
        } else {
            this.isSprinting = false;

            this.addSpeed = 0;
        }

        //Jump Checker
        if(this.player.body.onFloor()) {
            this.inAir = false;

            this.jumpCount = 0;
        }

        //Animation States
        if(this.isIdle) {
            this.player.play('idle', true);
        }

        if(this.isMoving && !this.isSprinting) {
            this.player.play('walk', true)
        }

        if(this.isSprinting) {
            if(this.isMoving) {
                this.player.play('run', true);
            } else {
                this.player.play('idle', true);
            }
        }
    }
}