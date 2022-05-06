import { SCENE_KEYS } from "../SceneKeys.js";

export class GameoverScene extends Phaser.Scene {
    constructor() {
        super({key: SCENE_KEYS.SCENES.GAMEOVER});
        this.prevScene;
    }

    init(data) {
        this.prevScene = data.scene;
        this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    create() {
        this.gameover_bg = this.sound.add('game-over', {
            volume: 0.5,
            loop: true
        })
        this.gameover_bg.play();

        this.scene.bringToTop();

        this.text = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            'GAME OVER',
            {
                font: '120px Arial',
                fill: '#900000',
                align: 'center'
            }).setOrigin(0.5, 0.5);

        this.text2 = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'You fall deeper and deeper...',
            {
                font: '42px Arial',
                fill: '#900000',
                align: 'center'
            }).setOrigin(0.5, 0.5);
        
        this.text3 = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 200,
            'PRESS R TO RESTART',
            {
                font: '18px Arial',
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5, 0.5);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.R)) {
            this.sound.stopAll();
            this.scene.start(this.prevScene);
        }
    }
}