import Entity from "./Entity.js";

export default class Bullet extends Entity {
    constructor(scene, x, y, target) {
        super(scene.physics, scene.anims, scene.events);
        this.target = target;

        this.bulletLife = 3000;
        this.isReal = true;

        this.bullet = this.physics.add.sprite(x, y, 'bullet_atlas', 'bullet01.png')
        .setSize(10,7)
        .setScale(2.5)
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

    destroy() {
        this.events.emit('bullet-dead');
        this.bullet.destroy();
    }

    bulletBounds(bool) {
        if(bool == false && (this.bullet.body.position.x < 90 || this.bullet.body.position.y < -100 || this.bullet.body.position.x > 3000 || this.bullet.body.position.y > 3000)) {
            this.destroy();
        }
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

    shoot() {
        this.physics.moveToObject(this.bullet, this.target, 400);
    }

    update() {
        this.flipSrite();
        this.shoot();
    }
}