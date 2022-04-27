import { SCENE_KEYS } from "../scene_constants.js";
import PlayerController from "../player_controller.js";

export class DebugLevelScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.DEBGUSTAGE
        })
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jump_count = 0;
    }

    preload() {
        //Player
        this.anims.create({
            key: 'idle',
            frameRate: 10,
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
            frameRate: 12,
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'run0',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            repeat: -1,
        });
    }

    create() {
        this.player = this.physics.add.sprite(200,200, "player_atlas", "idle00.png")
        .setScale(3) //sets render size
        .setSize(20,30); //sets hitbox size

        this.PlayerController = new PlayerController(this.player);

        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1000);
    }

    update() {
        if(this.cursors.left.isDown && this.cursors.up.isDown) {
            this.PlayerController.setState('moveLeftDiag');
        }
        if(this.cursors.left.isDown) {
            this.PlayerController.setState('moveLeft');
        }
        if(this.cursors.right.isDown) {
            this.PlayerController.setState('moveRight');
        }
        if(this.cursors.down.isDown) {
            this.PlayerController.setState('moveDown');
        }

        if(this.cursors.up.isDown && this.player.body.onFloor()) {
            this.PlayerController.setState('moveUp');
            this.jump_count = 1;
        }
        if(this.jump_count == 1) {
            if(this.cursors.up.isUp) {
                if(this.cursors.up.isDown && this.jump_count == 1) {
                    this.PlayerController.setState('moveUp');
                    this.jump_count = 0;
                }
            }
        }
        if(this.player.body.onFloor()) {
            this.jump_count = 0;
        }

        if(
            (this.cursors.left.isUp && this.cursors.right.isUp && this.cursors.up.isUp && this.cursors.down.isUp)
        ) {
            this.PlayerController.setState('idle');
        }
    }
}