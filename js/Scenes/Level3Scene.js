import { SCENE_KEYS } from "../SceneKeys.js";
import Player from "../Prefabs/Player.js";

export class Level3Scene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.LEVEL_3
        })
    }

    init() {

    }

    createMultipleImages(scene, x, y, count, texture, scrollFactor){
        this.x = x

        // Loops creating images to the number of count
        for(let i = 0; i < count; ++i){
            this.images = scene.add.image(this.x, y, texture).setOrigin(0,0).setScrollFactor(scrollFactor).setScale(1.3);

            this.x += this.images.width
        } 
    }

    collisionExclusion(layer){
        layer.setCollisionByExclusion(-1, true);
    }

    create() {
        this.map = this.make.tilemap({key: 'tilemap-3'});
        this.tileset_1 = this.map.addTilesetImage('main_lev_build_C', 'cave-tiles');

        this.createMultipleImages(this, 0, 100, 8, 'cave1', 0.20)
        this.createMultipleImages(this, 1, 130, 8, 'cave2', 0.25);
        this.createMultipleImages(this, -25, 80, 8, 'cave3', 0.5);

        // creates map
        this.main_details_back = this.map.createLayer('main-details back', this.tileset_1, 0, 10);
        this.main_details_front = this.map.createLayer('main-details front', this.tileset_1, 0, 10);
        this.wood_platform = this.map.createLayer('wood-platforms', this.tileset_1, 0, 10);
        this.spikes = this.map.createLayer('spikes', this.tileset_1, 0, 10);

        this.doors = [
            // doors
            this.map.createLayer('door1', this.tileset_1, 0, 10),
            this.map.createLayer('door2', this.tileset_1, 0, 10),
            this.map.createLayer('door3', this.tileset_1, 0, 10),
            this.map.createLayer('door4', this.tileset_1, 0, 10)
        ]

        this.main_platform = this.map.createLayer('main-platform', this.tileset_1, 0, 10);

        // Collision exclusions
        this.collisionExclusion(this.main_platform);
        this.collisionExclusion(this.spikes);
        this.collisionExclusion(this.wood_platform);
        this.collisionExclusion(this.doors[0]);
        this.collisionExclusion(this.doors[1]);
        this.collisionExclusion(this.doors[2]);
        this.collisionExclusion(this.doors[3]);

        // Player
        this.player = new Player(this, 1110, 540);
        this.player.setWorldCollider(false);

        // Collisions
        this.platform_collisions = [
            this.physics.add.collider(this.player.player, this.main_platform),
            this.physics.add.collider(this.player.player, this.wood_platform),
            this.physics.add.collider(this.player.player, this.spikes, this.hitPlayer, null, this),
        ]

        this.door_collisions = [
            this.physics.add.collider(this.player.player, this.doors[0], this.toDoor4, null, this),
            this.physics.add.collider(this.player.player, this.doors[1], this.toDoor3, null, this),
            this.physics.add.collider(this.player.player, this.doors[2], this.toDoor2, null, this),
            this.physics.add.collider(this.player.player, this.doors[3], this.toDoor1, null, this),
        ]

        // Camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.player).setZoom(2.52);
    }

    update(){
        this.player.update()
    }

    // when player hits spikes
    hitPlayer(player, spikes){

        player.setVelocityY(-200)
        
        if (player.invulnerable == false){
                player.setTint(0xb025a7);   
                player.invulnerable = true;
        }

        this.time.delayedCall(1000, this.removeIFrame, [], this);
    }

    removeIFrame(){
        this.player.player.clearTint()
        this.player.player.invulnerable = false;
    }

    // Door Teleports
    toDoor1(){}
    toDoor2(){}
    toDoor3(){}
    toDoor4(){}
}