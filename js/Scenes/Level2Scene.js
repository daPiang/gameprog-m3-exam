import { SCENE_KEYS } from "../SceneKeys.js";
import Player from "../Prefabs/Player.js";

export class Level2Scene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.LEVEL_2
        })
    }

    init() {

    }

    createMultipleImages(scene, x, y, count, texture, scrollFactor){
        this.x = x

        // Loops creating images to the number of count
        for(let i = 0; i < count; ++i){
            this.images = scene.add.image(this.x, y, texture).setOrigin(0,0).setScrollFactor(scrollFactor).setScale(2);

            this.x += this.images.width
        } 
    }

    collisionExclusion(layer){
        layer.setCollisionByExclusion(-1, true);
    }

    create() {
        this.map = this.make.tilemap({key: 'tilemap-2'});
        this.tileset = this.map.addTilesetImage('tileset', 'otherworld-tiles');

        // this.sky_bg = this.add.image(500, 400, 'sky').setScale(2.75).setScrollFactor(0);
        this.createMultipleImages(this, 0, 100, 8, 'sky', 0.20)
        this.createMultipleImages(this, 1, 130, 8, 'cloud1', 0.25);
        this.createMultipleImages(this, -25, 140, 8, 'cloud2', 0.5);

        this.invisible_wall = this.map.createLayer('invisible wall', this.tileset, 0, 10);
        this.brick_platform = this.map.createLayer('brick platforms', this.tileset, 0, 10);
        this.main_platform = this.map.createLayer('main platform', this.tileset, 0, 10);
        this.main_platform_details_back = this.map.createLayer('main details back', this.tileset, 0, 10);
        this.main_platform_details_front = this.map.createLayer('main details front', this.tileset, 0, 10);

        this.collisionExclusion(this.brick_platform);
        this.collisionExclusion(this.invisible_wall);
        this.collisionExclusion(this.main_platform);

        this.player = new Player(100, 300, this.physics, this.anims, this.input);
        this.player.player.invulnerable = false;
        this.player.setWorldCollider(false);

        this.physics.add.collider(this.player.player, this.main_platform);
        this.physics.add.collider(this.player.player, this.invisible_wall);
        this.physics.add.collider(this.player.player, this.brick_platform);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.player).setZoom(2.52);

        // this.cameras.main.setBackgroundColor('#ffffff')
    }

    update(){
        this.player.update();
    }
}