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
        this.TAB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    }

    // Creates a set number of the selected texture
    createMultipleImages(scene, x, y, count, texture, scrollFactor){
        this.x = x

        // Loops creating images to the number of count
        for(let i = 0; i < count; ++i){
            this.images = scene.add.image(this.x, y, texture).setOrigin(0,0).setScrollFactor(scrollFactor);

            this.x += this.images.width
        } 
    }

    create() {
        // Creates the map
        this.map = this.make.tilemap({key: 'tilemap-1'});

        // Loads Parallax images
        this.moon_bg = this.add.image(500, 400, 'moon').setScrollFactor(0);
        this.createMultipleImages(this, 1, 100, 3, 'tree5', 0.20);
        this.createMultipleImages(this, -25, 130, 3, 'tree4', 0.25);
        this.createMultipleImages(this, 0, 160, 3, 'tree1', 0.5);
        
        // this.tree_5 = this.add.image(1,100, 'tree5').setOrigin(0,0).setScrollFactor(0.25);
        // this.tree_4 = this.add.image(-40,120, 'tree4').setOrigin(0,0).setScrollFactor(0.5);
        // this.tree_3 = this.add.image(-25,130, 'tree3').setOrigin(0,0).setScrollFactor(0.1) - Not Included;
        // this.tree_2 = this.add.image(0,140, 'tree2').setOrigin(0,0); - Not Included
        // this.tree_1 = this.add.image(0,180, 'tree1').setOrigin(0,0).setScrollFactor(0.1 );

        //Adds tilesets, uses tileset name from Tiled
        this.tileset_1 = this.map.addTilesetImage('main_lev_buildA', 'platforming-tiles');
        this.tileset_2 = this.map.addTilesetImage('main_lev_buildB', 'brick-tiles');
        this.tileset_3 = this.map.addTilesetImage('tileset', 'otherworld-tiles');

        //Adds layer, layer name is based on Tiled Layer

        this.hidden_background = this.map.createLayer('background-hidden', this.tileset_2, 0, 10);

        this.brick_platform = this.map.createLayer('platforms', this.tileset_2, 0, 10);
        this.grass_platform = this.map.createLayer('grass-platform', this.tileset_1, 0, 10);
        this.additionals_back = this.map.createLayer(
            'additional-details back', this.tileset_1, 0, 10
        );
        this.additionals_front = this.map.createLayer(
            'additional-details front', this.tileset_1, 0, 10
        );
        this.obstacles = this.map.createLayer('obstacles', this.tileset_1, 0, 10);

        this.hidden_path_front = this.map.createLayer('hidden-path front', this.tileset_1, 0, 10);
        this.hidden_path_back = this.map.createLayer('hidden-path back', this.tileset_1, 0, 10);
        
        this.trigger = this.map.createLayer('trigger', this.tileset_2, 0, 10);

        this.otherworld_platform = this.map.createLayer('other-world-platform', this.tileset_3, 0, 10);
        this.otherworld_details_main = this.map.createLayer('other-world-details', this.tileset_3, 0, 10);
        this.otherworld_details_front = this.map.createLayer('other-world-details front', this.tileset_3, 0, 10);
        this.otherworld_details_back = this.map.createLayer('other world-details back', this.tileset_3, 0, 10);

        //Allows specific layers to be collided
        this.grass_platform.setCollisionByExclusion(-1, true);
        this.brick_platform.setCollisionByExclusion(-1, true);
        this.obstacles.setCollisionByExclusion(-1, true);
        this.trigger.setCollisionByExclusion(-1, true);
        this.hidden_path_front.setCollisionByExclusion(-1, true);
        this.otherworld_platform.setCollisionByExclusion(-1, true); 
            
        //Camera to follow player
        
        this.playerCam = this.cameras.main;   
        this.playerCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.monsterCam = this.cameras.add();
        this.monsterCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Player and Monster
        this.player = new Player(100, 300, this.physics, this.anims, this.input);
        this.player.player.invulnerable = false;
        this.player.setWorldCollider(false);

        this.monster = new Monster(2000, 300, this.physics, this.anims, this.player.player, this.input); 
        this.monster.setScale(2);

        //Collisions
        this.physics.add.collider(this.player.player, this.grass_platform);
        this.physics.add.collider(this.player.player, this.brick_platform);
        this.physics.add.collider(this.player.player, this.otherworld_platform);

        //Allows the collision to be selected
        this.specialCollision = this.physics.add.collider(this.player.player, this.hidden_path_front);
        
        // Special collision conditions
        this.physics.add.collider(this.player.player, this.trigger, this.triggerSet, null, this);
        this.physics.add.collider(this.player.player, this.obstacles, this.hitPlayer, null, this);

        this.playerCam.startFollow(this.player.player).setZoom(2.5);
        this.monsterCam.startFollow(this.monster.monster).setZoom(2.5);
        // this.cameras.main.setBackgroundColor('#ffffff')

        this.monsterCam.setVisible(false);
    }

    update(){
        this.player.update();
        this.monster.update();

        if(this.TAB.isDown) {
            this.player.enableControls(false);
            this.monsterCam.setVisible(true);
        } else {
            this.player.enableControls(true);
            this.monsterCam.setVisible(false);
        }
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