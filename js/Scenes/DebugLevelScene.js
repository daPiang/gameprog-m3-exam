import { SCENE_KEYS } from "../SceneKeys.js";
import Monster from "../Prefabs/Monster.js";
import Player from "../Prefabs/Player.js";

export class DebugLevelScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.DEBGUSTAGE
        });
    }

    init() {
        this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    preload() {

    }

    create() {
        // console.log(this.scene.key);
        this.player = new Player(this, 100, 700);
        // this.player.setScale(3);

        this.monster = new Monster(
            this, //scene
            400, //x
            690, //y
            this.player.player, //target
            100, //move speed
            1000); //shoot speed
        this.monster.setScale(2);

        //Bullets
        // this.bullet1 = new Bullet(this, -3000, -3000, this.monster.monster, this.player.player);

        this.cameras.main.setBounds(0, 0, this.scene.widthInPixels, this.scene.heightInPixels);
        this.cameras.main.startFollow(this.player.player).setZoom(1);

        // this.bullet = new MonsterBullet(this, 200, 200);
        // this.bullet.bullet.setScale(10);

        // this.events.once('shoot', ()=>{
        //     this.bullet1.update();
        // });
        // this.bullets = this.physics.add.group();
        // this.bullets.

        this.scene.launch(SCENE_KEYS.SCENES.UI, {
            sceneKey: this.scene.key,
            player: this.player
        });

        
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.R)) {
            this.scene.start(SCENE_KEYS.SCENES.LEVEL_1);
        }
        // console.log(this.bullet1.bullet.body.position);
        // Overlap Collision
        // this.physics.overlap(this.bullet, this.player.player, () => {
        //     // console.log('dead');
        // });
        // for() {

        // }

        this.player.update();
        this.monster.update();
    }
}