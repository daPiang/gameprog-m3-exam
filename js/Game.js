/** @type {import("../typings/phaser")} */

import { CreditScene } from "./Scenes/CreditScene.js";
import { DebugLevelScene } from "./Scenes/DebugLevelScene.js";
import { Level1Scene } from "./Scenes/Level1Scene.js";
import { Level2Scene } from "./Scenes/Level2Scene.js";
import { Level3Scene } from "./Scenes/Level3Scene.js";
import { MenuScene } from "./Scenes/MenuScene.js";
import { OptionsScene } from "./Scenes/OptionsScene.js";
import { SplashScene } from "./Scenes/SplashScene.js";
import { UiScene } from "./Scenes/UiScene.js";

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