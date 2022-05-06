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
        this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R); //Next Level
        this.F = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); //Prev Level
        this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC); //Skip Video
    }

    // Creates a set number of the selected texture
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
        //Load Sound
        this.bg_music = this.sound.add('level-1-music', {
            loop: true,
            volume: 0.12
        });
        this.bg_music.play();

        this.teleportSound = this.sound.add('tp', {
            volume: 0.17
        });

        // Creates the map
        this.map = this.make.tilemap({key: 'tilemap-1'});

        // Loads Parallax images
        this.moon_bg = this.add.image(500, 400, 'moon').setScrollFactor(0);
        this.createMultipleImages(this, 1, 80, 3, 'tree5', 0.20);
        this.createMultipleImages(this, -25, 90, 3, 'tree4', 0.25);
        this.createMultipleImages(this, 0, 100, 3, 'tree1', 0.5);
        
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

        
        this.exit = this.map.createLayer(
            'next-level', this.tileset_2, 0, 10
        );

        this.add.image(1280, 370, 'portal-active')

        this.obstacles = this.map.createLayer('obstacles', this.tileset_1, 0, 10);

        this.hidden_path_front = this.map.createLayer('hidden-path front', this.tileset_1, 0, 10);
        this.hidden_path_back = this.map.createLayer('hidden-path back', this.tileset_1, 0, 10);
        this.invisible_wall = this.map.createLayer('invisible-wall', this.tileset_3, 0, 10);
        
        this.trigger = this.map.createLayer('trigger', this.tileset_2, 0, 10);

        this.otherworld_platform = this.map.createLayer('other-world-platform', this.tileset_3, 0, 10);
        this.otherworld_details_main = this.map.createLayer('other-world-details', this.tileset_3, 0, 10);
        this.otherworld_details_front = this.map.createLayer('other-world-details front', this.tileset_3, 0, 10);
        this.otherworld_details_back = this.map.createLayer('other world-details back', this.tileset_3, 0, 10);

        //Allows specific layers to be collided
        this.collisionExclusion(this.grass_platform);
        this.collisionExclusion(this.brick_platform);
        this.collisionExclusion(this.obstacles);
        this.collisionExclusion(this.trigger);
        this.collisionExclusion(this.hidden_path_front);
        this.collisionExclusion(this.otherworld_platform);
        this.collisionExclusion(this.invisible_wall);
        this.collisionExclusion(this.exit);
            
        // Player and Monster
        this.player = new Player(this, 100, 375);
        this.player.setWorldCollider(false);

        //Collisions
        this.physics.add.collider(this.player.player, this.grass_platform);
        this.physics.add.collider(this.player.player, this.brick_platform);
        this.physics.add.collider(this.player.player, this.otherworld_platform);
        this.physics.add.collider(this.player.player, this.invisible_wall);
        this.physics.add.collider(this.player.player, this.exit, this.nextStage, null, this);

        //Allows the collision to be selected
        this.specialCollision = this.physics.add.collider(this.player.player, this.hidden_path_front);
        
        // Special collision conditions
        this.physics.add.collider(this.player.player, this.trigger, this.triggerSet, null, this);
        this.physics.add.collider(this.player.player, this.obstacles, this.hitPlayer, null, this);

        
        //Camera to follow player
        
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.player).setZoom(2.5);

        //UI Scene - ALWAYS ADD LAST
        this.scene.launch(SCENE_KEYS.SCENES.UI, {sceneKey: this.scene.key, player: this.player});

        //VIDEO EVENT
        this.video = this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, 'level-1-video');
        this.video.setScale(0.67).setDepth(5).setVolume(0.05);

        this.video.play();

        this.deathEvent();
    }

    update(){
        //VIDEO EVENT
        if(this.video.isPlaying() == false) {

            this.cameras.main.setZoom(2.5);
            this.scene.setVisible(true, SCENE_KEYS.SCENES.UI);
            this.scene.resume(SCENE_KEYS.SCENES.UI);

            // this.bg_music.play();
            // this.bg_music.resume();

            this.video.setVisible(false);
            this.video.destroy();

            //Put anything that needs updating below

            this.player.update();
            this.events.emit('stage1-goal');
            // this.monster.update();
            // this.cameraFunc();
        } else if(this.video.isPlaying() == true) {
            // this.bg_music.pause();

            this.cameras.main.setZoom(1);
            this.scene.setVisible(false, SCENE_KEYS.SCENES.UI);
            this.scene.pause(SCENE_KEYS.SCENES.UI);
        }

        if(Phaser.Input.Keyboard.JustDown(this.ESC)) {
            this.video.stop();
        }

        if(Phaser.Input.Keyboard.JustDown(this.R)) {
            this.nextStage();
        }

        if(Phaser.Input.Keyboard.JustDown(this.F)) {
            this.prevStage();
        }
    }

    deathEvent() {
        this.events.once('game-over', () => {
            this.sound.stopAll();
            this.scene.stop(SCENE_KEYS.SCENES.UI);
            this.scene.start(SCENE_KEYS.SCENES.GAMEOVER,
                {scene: this.scene.key});
        });
    }

    nextStage(player, exit){
        this.sound.stopAll();
        this.scene.start(SCENE_KEYS.SCENES.LEVEL_2);

    }

    prevStage(player, exit){
        this.sound.stopAll();
        this.scene.start(SCENE_KEYS.SCENES.DEBGUSTAGE);

    }

    triggerSet(player, specialCollision){
        this.teleportSound.play();

        this.events.emit('stage1-path');

        this.specialCollision.active = false;
        player.setPosition(670, 340);
        this.hidden_path_back.destroy();
        this.hidden_path_front.destroy();
    }

    hitPlayer(player, obstacle){

        this.events.emit('obstacle-hit');

        player.setVelocityY(-200)
        
        // if (player.invulnerable == false){
        //         player.setTint(0xb025a7);   
        //         player.invulnerable = true;
        // }

    //     this.time.delayedCall(1000, ()=>{
    //         player.invulnerable = false;
    //     })
    }
}