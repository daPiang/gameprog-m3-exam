import Entity from "./Entity.js";
import MonsterBulletGroup from "./MonsterBulletGroup.js";

export default class Monster extends Entity{
    constructor(scene, x, y, target) {
        super(scene.physics, scene.anims);
        this.target = target;

        this.moveSpeed = 75;

        this.scaleMulti = 1;

        this.timeCount = 0;

        // this.bulletGroup = new MonsterBulletGroup(this.scene);

        this.monster = this.physics.add.sprite(x, y, "mon_atlas", "fly00.png")
        .setSize(25, 25);

        this.anims.create({
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

        this.anims.create({
            key: 'attack',
            frameRate: 10,
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

    update() {
        // console.log(this.timeCount);

        //Behavior Manager

        ++this.timeCount;
        switch(this.timeCount) {
            case 1000:
                console.log('bullet');
                // this.timeCount = 0;
                break;
            default:
                this.monster.play('fly', true);
                this.physics.moveToObject(this.monster, this.target, this.moveSpeed);
        }


        //Sprite Direction
        if(this.monster.body.position.x > this.target.body.position.x) {
            this.monster.flipX = true;
        } else if(this.monster.body.position.x < this.target.body.position.x) {
            this.monster.flipX = false;
        }
    }
}