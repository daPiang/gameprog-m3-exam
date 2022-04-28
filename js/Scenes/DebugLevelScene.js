import { SCENE_KEYS } from "../SceneKeys.js";
import MonsterDirector from "../Prefabs/MonsterDirector.js";

export class DebugLevelScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.DEBGUSTAGE
        })
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
        // this.jump_count = 0;
        this.isLeft = false;
        this.isRight = true;
    }

    preload() {
        //Player
        this.anims.create({
            key: 'idle',
            frameRate: 6,
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'idle0',
                suffix: '.png',
                start: 0,
                end: 4
            }),
            repeat: -1,
        });

        this.anims.create({
            key: 'run',
            frameRate: 8,
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'run0',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            repeat: -1,
        });

        //Monster
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
    }

    create() {
        //Player
        this.player = this.physics.add.sprite(200,200, "player_atlas", "idle00.png")
        .setScale(2.3) //sets render size
        .setSize(20,30); //sets hitbox size

        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1000);

        //Monster
        this.monster = this.physics.add.sprite(700,500, "mon_atlas", "fly00.png")
        .setScale(4)
        .setSize(25, 25);

        this.monster.play('fly');
        this.monster.setImmovable(true);

        //Non-Overlap Collision
        // this.physics.add.collider(this.player, this.monster, () => {
        //     console.log('Dead');
        // });

        this.monster.setDepth(-1);

        this.monDirector = new MonsterDirector(this.monster, this.player, this.physics, this.time);
    }

    update() {
        //Overlap Collision
        this.physics.overlap(this.monster, this.player, () => {
            // console.log('dead');
        });

        //Player Controls

        //Monster
        this.monDirector.stateManager();
    }
}