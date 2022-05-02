import { SCENE_KEYS } from "../SceneKeys.js";
import Monster from "../Prefabs/Monster.js";
import Player from "../Prefabs/Player.js";

export class DebugLevelScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.DEBGUSTAGE
        })
    }

    init() {
    
    }

    preload() {

    }

    create() {
        this.player = new Player(100, 100, this.physics, this.anims, this.input);
        this.monster = new Monster(this.physics, this.anims, this.player.player, this.time);
    }

    update() {
        //Overlap Collision
        this.physics.overlap(this.monster, this.player, () => {
            // console.log('dead');
        });

        this.player.update();
        this.monster.update();
    }
}