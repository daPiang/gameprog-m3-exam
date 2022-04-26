/** @type {import("../typings/phaser")} */

import { CreditScene } from "./scenes/CreditScene.js";
import { LoadScene } from "./scenes/LoadScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { SplashScene } from "./scenes/SplashScene.js";

let game = new Phaser.Game({
    width: 1280,
    height: 720,
    scene: [
        SplashScene,
        MenuScene,
        LoadScene,
        CreditScene
    ]
})