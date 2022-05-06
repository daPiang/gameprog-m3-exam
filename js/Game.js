/** @type {import("../typings/phaser")} */

import { DebugLevelScene } from "./Scenes/DebugLevelScene.js";
import { GameoverScene } from "./Scenes/GameoverScene.js";
import { Level1Scene } from "./Scenes/Level1Scene.js";
import { Level2Scene } from "./Scenes/Level2Scene.js";
import { Level3Scene } from "./Scenes/Level3Scene.js";
import { MenuScene } from "./Scenes/MenuScene.js";
import { SplashScene } from "./Scenes/SplashScene.js";
import { UiScene } from "./Scenes/UiScene.js";

let gameConfig = new Phaser.Game({
    width: 1280,
    height: 720,
    scene: [
        SplashScene,
        MenuScene,
        UiScene,
        Level1Scene,
        Level2Scene,
        Level3Scene,
        DebugLevelScene,
        GameoverScene
    ],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
})