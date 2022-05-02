import { SCENE_KEYS } from "../SceneKeys.js";
import Player from "../Prefabs/Player.js";
import Monster from "../Prefabs/Monster.js";

export class Level1Scene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.LEVEL_1
        })
    }

    init() {

    }

    create() {
        this.map = this.make.tilemap({key: 'tilemap-1'});
        
        //Adds tilesets, uses tileset name from Tiled
        this.tileset_1 = this.map.addTilesetImage('main_lev_buildA', 'platforming-tiles');
        this.tileset_2 = this.map.addTilesetImage('main_lev_buildB', 'brick-tiles');
        this.tileset_3 = this.map.addTilesetImage('tileset', 'otherworld-tiles');

        //Adds layer, layer name is based on Tiled Layer

        this.hidden_background = this.map.createLayer('background-hidden', this.tileset_2, 0, 40);

        this.brick_platform = this.map.createLayer('platforms', this.tileset_2, 0, 40);
        this.grass_platform = this.map.createLayer('grass-platform', this.tileset_1, 0, 40);
        this.additionals_back = this.map.createLayer(
            'additional-details back', this.tileset_1, 0, 40
        );
        this.additionals_front = this.map.createLayer(
            'additional-details front', this.tileset_1, 0, 40
        );
        this.obstacles = this.map.createLayer('obstacles', this.tileset_1, 0, 40);

        
        this.hidden_path_front = this.map.createLayer('hidden-path front', this.tileset_1, 0, 40);
        this.hidden_path_back = this.map.createLayer('hidden-path back', this.tileset_1, 0, 40);
        
        this.trigger = this.map.createLayer('trigger', this.tileset_2, 0, 40);

        this.otherworld_platform = this.map.createLayer('other-world-platform', this.tileset_3, 0, 40);
        this.otherworld_details_main = this.map.createLayer('other-world-details', this.tileset_3, 0, 40);
        this.otherworld_details_front = this.map.createLayer('other-world-details front', this.tileset_3, 0, 40);
        this.otherworld_details_back = this.map.createLayer('other world-details back', this.tileset_3, 0, 40);

        //Allows specific layers to be collided
        this.grass_platform.setCollisionByExclusion(-1, true);
        this.brick_platform.setCollisionByExclusion(-1, true);
        this.obstacles.setCollisionByExclusion(-1, true);
        this.trigger.setCollisionByExclusion(-1, true);
        this.hidden_path_front.setCollisionByExclusion(-1, true);
        this.otherworld_platform.setCollisionByExclusion(-1, true); 

        // Player and Monster
        this.player = new Player(100, 300, this.physics, this.anims, this.input);
        this.player.player.invulnerable = false;
        this.player.setWorldCollider(false);
        // this.monster = new Monster(this.physics, this.anims, this.player.player, this.input); 
            
        //Collisions
        this.physics.add.collider(this.player.player, this.grass_platform);
        this.physics.add.collider(this.player.player, this.brick_platform);
        this.physics.add.collider(this.player.player, this.otherworld_platform);

        //Allows the collision to be selected
        this.specialCollision = this.physics.add.collider(this.player.player, this.hidden_path_front);
        
        // Special collision conditions
        this.physics.add.collider(this.player.player, this.trigger, this.triggerSet, null, this);
        this.physics.add.collider(this.player.player, this.obstacles, this.hitPlayer, null, this);
        
        //Camera to follow player
        this.cameras.main
        .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        .startFollow(this.player.player);

        this.cameras.main.setZoom(2.5);
        this.cameras.main.setBackgroundColor('#ffffff')
    }

    update(){
        this.player.update();
        // this.monster.update();
    }

    triggerSet(player, specialCollision){
        this.specialCollision.active = false;
        player.setPosition(670, 340);
        this.hidden_path_back.destroy();
        this.hidden_path_front.destroy();
    }

    hitPlayer(player, obstacle){

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
}