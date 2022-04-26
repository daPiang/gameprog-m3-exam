import { SCENE_KEYS } from "../scene_constants.js";

export class SplashScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.SPLASH
        })
    }

    init() {

    }

    preload() {
        this.load.image("menu_bg", "./assets/images/BG.jpg");
        this.load.image("start", "./assets/images/START.png");
        this.load.image("select", "./assets/images/SELECT.png");
        this.load.image("option", "./assets/images/OPTIONS.png");
        this.load.image("title", "./assets/images/TITLE.png");
        this.load.image("pointer", "./assets/images/POINTER.png");
    }

    create() {
        this.scene.start(SCENE_KEYS.SCENES.MENU, "Hello");
    }
}