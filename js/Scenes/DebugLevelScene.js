import { SCENE_KEYS } from "../SceneKeys.js";
import Monster from "../Prefabs/Monster.js";
import Player from "../Prefabs/Player.js";
import MonsterBullet from "../Prefabs/MonsterBullet.js";

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
        this.player = new Player(this, 100, 700);
        // this.player.setScale(3);

        this.monster = new Monster(this, 400, 690, this.player.player);
        this.monster.monster.setScale(2);

        this.cameras.main.setBounds(0, 0, this.scene.widthInPixels, this.scene.heightInPixels);
        this.cameras.main.startFollow(this.player.player).setZoom(2.52);

        // this.bullet = new MonsterBullet(this, 200, 200);
        // this.bullet.bullet.setScale(10);
    }

    update() {
        //Overlap Collision
        // this.physics.overlap(this.monster, this.player, () => {
        //     // console.log('dead');
        // });

        this.player.update();
        this.monster.update();
    }
}