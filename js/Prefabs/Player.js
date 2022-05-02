import Entity from "./Entity.js";

export default class Player extends Entity{
    constructor(x, y, physics, anims, input) {
        super(physics, anims);
        this.input = input;

        //Movement Variables
        this.moveSpeed = 100;
        this.jumpSpeed = 300;
        this.dashSpeed = this.moveSpeed * 7;
        this.gravity = 1000;

        this.addSpeed = 0;
        this.addDash = 0;

        //Jump Variables
        this.jumpCount = 0;
        this.maxJump = 1;

        //Dash Variables
        this.dashCount = 0;
        this.maxDash = 2;
        this.timeCount = 0;
        this.timeMax = 35;

        //Direction Bool
        this.isRight = true;

        //State Bool
        this.inAir = false;
        this.isDashing = false;
        this.isMoving = false;
        this.isIdle = true;
        this.isSprinting = false;

        //Init Player
        this.player = this.physics.add.sprite(x, y, "player_atlas", "idle00.png")
        .setSize(20,30);

        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(this.gravity);

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
                prefix: 'walk0',
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

        this.player.anims.create({
            key: 'jump',
            frameRate: 8,
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'run0',
                suffix: '.png',
                start: 3,
                end: 5
            })
        });

        this.player.anims.create({
            key: 'dash',
            frameRate: 24,
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'run0',
                suffix: '.png',
                start: 5,
                end: 6
            }),
            repeat: -1,
        });        
    }

    setWorldCollider(boolean) {
        this.player.setCollideWorldBounds(boolean);
    }

    update() {

        //Movement
        if((Phaser.Input.Keyboard.JustDown(this.UP) || (Phaser.Input.Keyboard.JustDown(this.W))) && (this.jumpCount < this.maxJump)) {
            // this.inAir = true;
            this.isIdle = false;

            ++this.jumpCount;

            this.player.setVelocityY(-this.jumpSpeed);
        } else if(Phaser.Input.Keyboard.JustDown(this.SPACE_KEY)) {
            this.isDashing = true;

            this.timeCount = 0;

            if(this.isRight) {
                this.player.setVelocityX(this.dashSpeed);
            }else if(!this.isRight) {
                this.player.setVelocityX(-this.dashSpeed);
            }
        } else if((this.RIGHT.isDown || this.D.isDown) && !this.isDashing) {
            this.isMoving = true;
            this.isIdle = false;

            this.isRight = true;
            this.player.flipX = false;

            this.player.setVelocityX(this.moveSpeed + this.addSpeed + this.addDash);
        } else if((this.LEFT.isDown || this.A.isDown) && !this.isDashing) {
            this.isMoving = true;
            this.isIdle = false;

            this.isRight = false;
            this.player.flipX = true;

            this.player.setVelocityX(-this.moveSpeed + -this.addSpeed + -this.addDash);
        } else if(!this.isIdle && !this.inAir && !this.isDashing) {
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
        } else if(!this.player.body.onFloor()) {
            this.inAir = true;
        }

        //Dash State
        ++this.timeCount;
        if(this.isDashing && this.timeCount >= this.timeMax) {
            this.isDashing = false;

            // this.moveSpeed = 0;

            this.A.enabled = true;
            this.D.enabled = true;
            this.RIGHT.enabled = true;
            this.LEFT.enabled = true; 
            this.SHIFT.enabled = true;

            // this.moveSpeed = 150;

            this.player.setVelocityX(0);
        }

        if(this.isDashing) {
            this.A.enabled = false;
            this.D.enabled = false;
            this.RIGHT.enabled = false;
            this.LEFT.enabled = false;
            this.SHIFT.enabled = false;
        }

        //Animation States
        if(this.isDashing) {
            this.player.play('dash', true);
        } else if(this.inAir) {
            this.player.play('jump', true);
        }  else if(this.isMoving && !this.isSprinting) {
            this.player.play('walk', true)
        } else if(this.isSprinting) {
            if(this.isMoving) {
                this.player.play('run', true);
            } else {
                this.player.play('idle', true);
            }
        } else if(this.isIdle) {
            this.player.play('idle', true);
        }
    }
}