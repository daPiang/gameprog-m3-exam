import Entity from "./Entity.js";

export default class Player extends Entity{
    constructor(scene, x, y) {
        super(scene.physics, scene.anims, scene.events, scene.input, scene.sound, scene.time);

        //Player Variables
        this.hp = 6;
        this.hpCap = 6;
        this.stamina = 1000;
        this.staminaCap = 1000

        this.sprintCost = 3;
        this.sprintRecovery = 2;
        this.jumpCost = 75;

        //Debuff State
        this.staminaDebuff = false;
        this.stamDebCount = 0;
        
        //Movement Variables
        this.moveSpeed = 100;
        this.jumpSpeed = 300;
        this.dashSpeed = this.moveSpeed * 7;
        this.gravity = 1000;

        //Movement Modifiers
        this.addSpeed = 0;
        this.addDash = 0;
        this.scaleMulti = 1;

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
        this.canSprint = true;
        this.isDead = false;

        //Init SFX
        // this.footstep = this.sound.add('step-grass', {
        //     loop: true,
        //     volume: 0.4
        // });

        // this.sprintstep = this.sound.add('step-grass', {
        //     loop: true,
        //     volume: 0.4,
        //     rate: 1.5
        // })

        //Init Player
        this.player = this.physics.add.sprite(x, y, "player_atlas", "idle00.png")
        .setSize(20,30)
        .setDepth(1);

        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(this.gravity);

        //Controls Init
        this.controls = this.input.keyboard.createCursorKeys();

        //Input Keys(arrow)
        this.RIGHT = this.controls.right;
        this.LEFT = this.controls.left;
        this.UP = this.controls.up;
        this.DOWN = this.controls.down;
        this.DOWN.enabled = false;

        //Input Keys(non-arrow)
        this.SPACE_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.SHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.TAB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
        
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.S.enabled = false;

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

    setScale(int) {
        this.player.setScale(int);
        this.scaleMulti = int;
    }

    getHp() {
        return this.hp;
    }

    getStamina() {
        return this.stamina;
    }

    enableControls(boolean) {
        this.UP.enabled = boolean;
        // this.DOWN.enabled = boolean;
        this.LEFT.enabled = boolean;
        this.RIGHT.enabled = boolean;
        this.W.enabled = boolean;
        this.A.enabled = boolean;
        // this.S.enabled = boolean;
        this.D.enabled = boolean;
        this.SPACE_KEY.enabled = boolean;
        this.SHIFT.enabled = boolean;
    }

    resetControls() {
        this.UP.reset();
        // this.DOWN.reset();
        this.LEFT.reset();
        this.RIGHT.reset();
        this.W.reset();
        this.A.reset();
        // this.S.reset();
        this.D.reset();
        this.SPACE_KEY.reset();
        this.SHIFT.reset();
    }

    update() {

        //Event Checkers
        // console.log(this.hp);

        this.events.once('mon_bite', ()=>{
            if(!this.player.invulnerable) {
                
                this.player.invulnerable = true;
                this.hp -= 3;
                this.events.emit('hpLoss');
            }

            this.time.delayedCall(1000, ()=>{
                this.player.invulnerable = false;
            })
        });

        this.events.once('mon-shot-hit', ()=>{
            if(!this.player.invulnerable) {
                
                this.player.invulnerable = true;
                this.hp -= 1;
                this.events.emit('hpLoss');
            }

            this.time.delayedCall(1000, ()=>{
                this.player.invulnerable = false;
            })
        });

        //Death State
        if(this.hp == 0) {
            this.isDead = true;
        } else {
            this.isDead = false;
        }

        if(this.isDead) {
            this.events.emit('game-over');
            // console.log('dead');
        }

        //Movement
        if((Phaser.Input.Keyboard.JustDown(this.UP) || (Phaser.Input.Keyboard.JustDown(this.W)) || (Phaser.Input.Keyboard.JustDown(this.SPACE_KEY))) && this.jumpCount < this.maxJump && !this.staminaDebuff && this.stamina >= this.jumpCost) {
            // this.inAir = true;
            this.stamina -= 75;
            this.isIdle = false;

            this.jumpCount++;

            this.player.setVelocityY(-this.jumpSpeed * this.scaleMulti);

            this.events.emit('jump');
        } else if(Phaser.Input.Keyboard.JustDown(this.DOWN) || Phaser.Input.Keyboard.JustDown(this.S)) {
            this.isDashing = true;

            this.timeCount = 0;

            if(this.isRight) {
                this.player.setVelocityX(this.dashSpeed * this.scaleMulti);
            }else if(!this.isRight) {
                this.player.setVelocityX(-this.dashSpeed * this.scaleMulti);
            }
        } else if((this.RIGHT.isDown || this.D.isDown) && !this.isDashing) {
            this.isMoving = true;
            this.isIdle = false;

            this.isRight = true;
            this.player.flipX = false;

            this.player.setVelocityX((this.moveSpeed + this.addSpeed + this.addDash) * this.scaleMulti);
        } else if((this.LEFT.isDown || this.A.isDown) && !this.isDashing) {
            this.isMoving = true;
            this.isIdle = false;

            this.isRight = false;
            this.player.flipX = true;

            this.player.setVelocityX((-this.moveSpeed + -this.addSpeed + -this.addDash) * this.scaleMulti);
        } else if(!this.isIdle && !this.inAir && !this.isDashing) {
            this.isIdle = true;
            this.isMoving = false;

            this.player.setVelocityX(0);
        }

        //Sprint
        if(this.SHIFT.isDown && this.isMoving && this.canSprint) {
            this.isSprinting = true;

            this.addSpeed = 100;
            
            this.stamina -= this.sprintCost;
            this.events.emit('sprint');

            if(this.stamina < 0) {
                this.stamina = 0;
            }
        } else {
            this.isSprinting = false;

            this.addSpeed = 0;

            if(this.stamina!=this.staminaCap && !this.staminaDebuff && this.player.body.onFloor()) {
                this.stamina += this.sprintRecovery;
                
                this.events.emit('sprintRecovery');
                if(this.stamina > this.staminaCap) {
                    this.stamina = this.staminaCap;
                }
            }
        }
        
        if(this.stamina >= this.staminaCap/3) {
            this.canSprint = true
        } else if(this.stamina <= 0) {
            this.canSprint = false;
            this.staminaDebuff = true;
        }

        if(this.staminaDebuff && this.player.body.onFloor()) {
            this.moveSpeed = 75;
            ++this.stamDebCount;
        }else if(!this.staminaDebuff) {
            this.moveSpeed = 150;
        }

        if(this.stamDebCount >= 300) {
            this.staminaDebuff = false;
            this.stamDebCount = 0;
        }

        // console.log(this.stamina);

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
            this.player.play('walk', true);
        } else if(this.isSprinting) {
            if(this.isMoving) {
                this.player.play('run', true);
            } else {
                this.player.play('idle', true);
            }
        } else if(this.isIdle) {
            this.player.play('idle', true);
        }

        console.log(this.hp);

        //Sound States
        // if(this.isMoving && this.inAir && !this.isSprinting) {
        //     this.footstep.play();
        // } else if(this.isMoving && this.inAir && this.isSprinting) {
        //     this.sprintstep.play();
        // } else if(this.isIdle) {
        //     this.footstep.stop();
        //     this.sprintstep.stop();
        // }
    }
}