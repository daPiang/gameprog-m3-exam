import Entity from "./Entity.js";

export default class Bullet extends Entity {
    constructor(scene, x, y, shooter, target) {
        super(scene.physics, scene.anims, scene.events);
        this.shooter = shooter;
        this.target = target;

        this.bullet = this.physics.add.sprite(x, y, 'bullet_atlas', 'bullet01.png')
        .setSize(10,7)
        .setScale(2)
        .setDepth(1);
        

        this.bullet.anims.create({
            key: 'bullet',
            frameRate: 60,
            frames: this.anims.generateFrameNames('bullet_atlas', {
                prefix: 'bullet0',
                suffix: '.png',
                start: 1,
                end: 30
            }),
            repeat: -1
        });

        this.bullet.play('bullet', true);
    }
    flipSrite() {
        if(this.bullet.body.position.x > this.target.body.position.x) {
            this.bullet.flipX = true;
            this.bullet.setOffset(1,5);
        } else if(this.bullet.body.position.x < this.target.body.position.x) {
            this.bullet.flipX = false;
            this.bullet.setOffset(5,5);
        }
    }

    tpBullet() {
        this.physics.moveTo(this.bullet, this.shooter.body.center.x, this.shooter.body.center.y, 9999);
    }

    shoot() {
        this.physics.moveToObject(this.bullet, this.target, 200);
    }

    update() {
        this.tpBullet();
        if(this.bullet.body.position == this.shooter.body.center) {
            this.flipSrite();
            this.shoot();
        }
    }
}