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

        this.timeCount = 0;

        //Monster States
        this.isBiting = false;
        this.hasBitten = false;
        this.isFlying = true;
        this.isShooting = false;

        // this.bulletGroup = new MonsterBulletGroup(this.scene);
        this.bullet = new MonsterBullet(this.scene);

        this.monster = this.physics.add.sprite(x, y, "mon_atlas", "fly00.png")
        .setSize(0.1, 0.1);

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
        this.monster.setSize(0.1, 0.1);
    }

    update() {
        // console.log(this.timeCount);

        //Behavior Manager

        
        console.log(this.isShooting);

        //Behavior - relies on states
        if(this.isBiting) {
            this.isShooting = false;
            this.isFlying = false;

            this.monster.setVelocity(0,0);
            this.resetHitbox();

            this.monster.play('attack', true);
            this.monster.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                // console.log('something');
                this.monster.setSize(40, 15);
                this.hasBitten = true;
            });

            if(this.hasBitten) {
                this.physics.overlap(this.monster, this.target, () => {
                    console.log('dead');
                    this.isBiting = false;
                    this.hasBitten = false;
                });
            }
            // this.timeCount = 0;
        } else if(this.isShooting) {
            this.isBiting = false;
            this.hasBitten = false;
            this.isFlying = false;

            this.resetHitbox();

            this.monster.playReverse('shoot', true);
            this.monster.on('animationcomplete', () => {
                // this.bullet.createBullet(this.monster, this.target, this.monster.body.center.x, this.monster.body.center.y);
                // this.bullet.setScale(3);
                // this.bullet.shootAtTarget(this.target);

                this.isShooting = false;

                this.timeCount = 0;
            });
        } else if(this.isFlying) {
            this.isShooting = false;
            this.hasBitten = false;
            this.isBiting = false;

            this.resetHitbox();
            
            this.monster.play('fly', true);
            this.physics.moveToObject(this.monster, this.target, this.moveSpeed);
        }

        ++this.timeCount;
        if(Phaser.Math.Distance.BetweenPoints(this.monster.body.center, this.target.body.center) < 50) {
            this.isBiting = true;
        } else if(this.timeCount > 1000 && !this.isBiting) {
            this.isShooting = true;
        } else if(this.timeCount != 1000 && !this.isBiting) {
            this.isFlying = true;
        }


        //Sprite Direction
        if(this.monster.body.position.x > this.target.body.position.x) {
            this.monster.flipX = true;
        } else if(this.monster.body.position.x < this.target.body.position.x) {
            this.monster.flipX = false;
        }
    }
}