/** @type {import("../typings/phaser")} */

import { CreditScene } from "./scenes/CreditScene.js";
import { DebugLevelScene } from "./scenes/DebugLevelScene.js";
import { Level1Scene } from "./scenes/Level1Scene.js";
import { Level2Scene } from "./scenes/Level2Scene.js";
import { Level3Scene } from "./scenes/Level3Scene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { OptionsScene } from "./scenes/OptionsScene.js";
import { SplashScene } from "./scenes/SplashScene.js";
import { UiScene } from "./scenes/UiScene.js";

let game = new Phaser.Game({
    width: 1280,
    height: 720,
    scene: [
        SplashScene,
        MenuScene,
        CreditScene,
        OptionsScene,
        UiScene,
        Level1Scene,
        Level2Scene,
        Level3Scene,
        DebugLevelScene
    ],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
})