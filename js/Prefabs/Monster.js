import Entity from "./Entity.js";
import MonsterDirector from "./MonsterDirector.js";

export default class Monster extends Entity{
    constructor(physics, anims, player) {
        super(physics, anims);
        this.player = player;

        this.monster = this.physics.add.sprite(700,300, "mon_atlas", "fly00.png")
        .setScale(4)
        .setSize(25, 25);

        this.director = new MonsterDirector(this.monster, this.player, this.physics);

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
            }),
            repeat: -1,
        });

        this.monster.play('fly');
    }

    update() {
        this.director.stateManager();
    }
}