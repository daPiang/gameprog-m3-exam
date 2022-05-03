import Entity from "./Entity.js";

export default class MonsterBullet extends Entity {
    constructor(scene) {
        super(scene.physics, scene.anims);

        this.speed = 180;
        this.life = 101;
        this.lifeMax = 100;
    }

    setScale(int) {
        this.bullet.setScale(int);
    }

    destroy() {
        this.bullet.destroy();
    }

    // selfDestruct(object) {
    //     if(this.bullet.body.position.x == object.body.position.x) {
    //         this.life = 0;
    //     }

    //     if(this.life == this.lifeMax) {
    //         this.destroy();
    //     }
    // }

    spriteDirection(object) {
        if(this.bullet.body.position.x > object.body.position.x) {
            this.bullet.flipX = true;
            this.bullet.setOffset(1,5);
        } else if(this.bullet.body.position.x < object.body.position.x) {
            this.bullet.flipX = false;
            this.bullet.setOffset(5,5);
        }
    }

    spriteRotation(object1, object2) {
        this.bullet.setRotation(Phaser.Math.Angle.BetweenPoints(object1.body.position, object2.body.position));
        console.log(Phaser.Math.Angle.BetweenPoints(object1.body.position, object2.body.position));
    }

    shootAtTarget(object) {
        this.physics.moveToObject(
            this.bullet,
            object,
            this.speed
            );
    }

    createBullet(object1, object2, x, y) {
        this.bullet = this.physics.add.sprite(x, y, 'bullet_atlas', 'bullet01.png');
        // this.bullet.setOrigin(0.5, 0.5);
        this.bullet.setSize(10,7);
        this.bullet.setScale(2);
        
        this.spriteDirection(object2);
        // this.spriteRotation(object1, object2);

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

    // update(object) {
    //     this.selfDestruct(object);
    // }
}