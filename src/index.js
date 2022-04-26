/** @type {import("../typings/phaser")} */

import { CreditScene } from "./scenes/CreditScene.js";
import { GenderScene } from "./scenes/GenderScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { SplashScene } from "./scenes/SplashScene.js";

let game = new Phaser.Game({
    width: 1280,
    height: 720,
    scene: [
        SplashScene,
        MenuScene,
        GenderScene,
        CreditScene
    ]
})