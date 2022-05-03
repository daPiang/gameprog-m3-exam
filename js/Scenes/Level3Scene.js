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

    collisionExclusion(layer){
        layer.setCollisionByExclusion(-1, true);
    }

    create() {
        this.map = this.make.tilemap({key: 'tilemap-3'});
        this.tileset_1 = this.map.addTilesetImage('main_lev_build_C', 'cave-tiles');

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
    hitPlayer(){}

    // Door Teleports
    toDoor1(){}
    toDoor2(){}
    toDoor3(){}
    toDoor4(){}
}