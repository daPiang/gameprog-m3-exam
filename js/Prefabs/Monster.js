import Entity from "./Entity.js";
import MonsterBullet from "./MonsterBullet.js";
import MonsterBulletGroup from "./MonsterBulletGroup.js";

export default class Monster extends Entity{
    constructor(scene, x, y, target) {
        super(scene.physics, scene.anims);
        this.scene = scene;
        this.target = target;

        this.moveSpeed = 75;

        this.scaleMulti = 1;

        this.shootTimer = 0;
        this.shootTimerMax = 1000;
        this.waitTimer = 0;
        this.waitTimerMax = 50;

        this.minDistance = 50;

        //Monster States
        this.isBiting = false;
        this.isFlying = true;
        this.isShooting = false;
        this.isRight = false;
        this.waiting = false;

        this.fired = false;
        this.biteCollision = false;

        // this.bulletGroup = new MonsterBulletGroup(this.scene);
        this.bullet = new MonsterBullet(this.scene);

        this.monster = this.physics.add.sprite(x, y, "mon_atlas", "fly00.png")
        // .setOrigin(0.5,0.5)
        .setSize(30, 30);

        // this.monster.body.setEnable(false);

        this.monster.anims.create({
            key: 'fly',
            frameRate: 15,
            frames: this.anims.generateFrameNames('mon_atlas', {
                prefix: 'fly0',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            repeat: -1,
        });

        this.monster.anims.create({
            key: 'attack',
            frameRate: 10,
            frames: this.anims.generateFrameNames('mon_atlas', {
                prefix: 'attack0',
                suffix: '.png',
                start: 2,
                end: 7
            })
        });

        this.monster.anims.create({
            key: 'shoot',
            frameRate: 20,
            frames: this.anims.generateFrameNames('mon_atlas', {
                prefix: 'attack0',
                suffix: '.png',
                start: 2,
                end: 7
            })
        });
    }

    setScale(int) {
        this.monster.setScale(int);
    }

    resetHitbox() {
        this.monster.setSize(30, 30);
    }

    shoot() {
        this.monster.playReverse('shoot', true);
        this.monster.once('animationcomplete', ()=>{
            this.isShooting = false;
            this.bullet.createBullet(this.monster, this.target, this.monster.body.center.x, this.monster.body.center.y);
            this.bullet.shootAtTarget(this.target);

            this.fired = true;
            this.shootTimer = 0;
        });
    }

    bite() {
        this.monster.setVelocity(0,0);

        this.monster.play('attack', true);
        this.monster.once('animationcomplete', ()=>{
            this.isBiting = false;
            this.biteCollision = true;
            if(this.isRight) {
                this.monster.setSize(10, 10);
                this.monster.setOffset(85,76);
            } else {
                this.monster.setSize(10, 10);
                this.monster.setOffset(55,76);
            }
            this.shootTimer = 0;
            this.waiting = true;
        });
        this.biteCollision = false;
    }

    fly() {
        this.monster.play('fly', true);
        this.physics.moveToObject(this.monster, this.target, this.moveSpeed);
    }

    wait() {
        this.resetHitbox();
        this.monster.play('fly', true);
        this.monster.setVelocity(0, 0);

        this.shootTimer = 0;
        ++this.waitTimer;
    }

    checkCollision() {
        this.physics.overlap(this.monster, this.target, () => {
            if(this.biteCollision) {
                console.log('dead');
            } else {
                console.log('safe');
            }
        });

        this.physics.overlap(this.bullet, this.target, () => {
            console.log('dead');
        });
    }

    update() {
        // console.log('isBiting: '+this.isBiting);
        // console.log('isFlying: '+this.isFlying);
        // console.log('isShooting: '+this.isShooting);
        // console.log(this.shootTimer);
        this.checkCollision();

        //Timers
        ++this.shootTimer;
        if(this.shootTimer > this.shootTimerMax) {
            this.shootTimer = 0;
        }
        if(this.waitTimer >= this.waitTimerMax) {
            this.waiting = false;
            this.waitTimer = 0;
        }

        //State Handler
        if(Phaser.Math.Distance.BetweenPoints(this.monster.body.center, this.target.body.center) <= this.minDistance) {
            this.isBiting = true;
            this.isFlying = false;
            this.isShooting = false;
        } else if(Phaser.Math.Distance.BetweenPoints(this.monster.body.center, this.target.body.center) > this.minDistance && this.shootTimer === this.shootTimerMax) {
            this.isBiting = false;
            this.isFlying = false;
            this.isShooting = true;
        } else if(!this.isFlying && (!this.isBiting || this.isShooting)) {
            this.isFlying = true;
        }

        if(this.monster.body.position.x > this.target.body.position.x && !this.isBiting) {
            this.monster.flipX = true;
            this.isRight = false;
        } else if(this.monster.body.position.x < this.target.body.position.x && !this.isBiting) {
            this.monster.flipX = false;
            this.isRight = true;
        }

        //Movement Handler
        if(this.waiting) {
            this.wait();
        } else if(this.isBiting) {
            this.bite();
        } else if(!this.isBiting && this.isShooting && this.shootTimer === this.shootTimerMax) {
            this.shoot();
        } else if(!this.isBiting && !this.isShooting && this.isFlying) {
            this.fly();
        }

    }
}