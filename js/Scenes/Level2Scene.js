import { SCENE_KEYS } from "../SceneKeys.js";
import Player from "../Prefabs/Player.js";
import Monster from "../Prefabs/Monster.js";

export class Level2Scene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.LEVEL_2
        })
    }

    init() {
        this.diamondsCollected = 0;

        this.Q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.F = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
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
        //Load Sound
        this.bg_music = this.sound.add('level-1-music', {
            loop: true,
            volume: 0.12
        });
        this.bg_music.play();

        this.teleportSound = this.sound.add('tp', {
            volume: 0.17
        });

        this.map = this.make.tilemap({key: 'tilemap-2'});
        this.tileset_1 = this.map.addTilesetImage('tileset', 'otherworld-tiles');
        this.tileset_2 = this.map.addTilesetImage('portal', 'teleporter-tiles');

        // this.sky_bg = this.add.image(500, 400, 'sky').setScale(2.75).setScrollFactor(0);
        this.createMultipleImages(this, 0, 100, 8, 'sky', 0.20)
        this.createMultipleImages(this, 1, 130, 8, 'cloud1', 0.25);
        this.createMultipleImages(this, -25, 140, 8, 'cloud2', 0.5);

        // diamonds
        this.diamonds = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });
        const diamondObj = this.map.getObjectLayer('diamonds').objects;

        for(const diamond of diamondObj) {
            this.diamonds.create(diamond.x, diamond.y, 'diamond_atlas')
                .setOrigin(0).setScale(2);
        }

        this.anims.create({
            key: 'shine',
            frames: this.anims.generateFrameNames('diamond_atlas', {
            prefix: 'diamond',
            start: 5,
            end: 1,
            }),
            frameRate: 10,
        })

        // Teleporters
        this.tp = [
            this.map.createLayer('tp 1', this.tileset_2, 0, 10),
            this.map.createLayer('tp 2', this.tileset_2, 0, 10),
            this.map.createLayer('tp 3', this.tileset_2, 0, 10),
            this.map.createLayer('tp 4', this.tileset_2, 0, 10),
            this.map.createLayer('tp 5', this.tileset_2, 0, 10),
            this.map.createLayer('tp 6', this.tileset_2, 0, 10),
            this.map.createLayer('tp 7', this.tileset_2, 0, 10),
            this.map.createLayer('tp 8', this.tileset_2, 0, 10)
        ]
        
        // Teleporter images
        this.add.image(2773,480, 'portal-red').setScale(1.5);
        this.add.image(2274, 514, 'portal-purple').setScale(1.5);
        this.add.image(612, 410, 'portal-green').setScale(1.5);
        this.add.image(1634, 480, 'portal-orange').setScale(1.5);

        this.portal = this.add.image(1056, 400, 'portal-inactive');
        
        this.add.image(552, 510, 'portal-green').setScale(1.5).flipX = true;
        this.add.image(2509, 416, 'portal-purple').setScale(1.5).flipX = true;
        this.add.image(92,480, 'portal-red').setScale(1.5).flipX=true;
        
        // Map
        this.invisible_wall = this.map.createLayer('invisible wall', this.tileset, 0, 10);
        this.brick_platform = this.map.createLayer('brick platforms', this.tileset_1, 0, 10);
        this.main_platform = this.map.createLayer('main platform', this.tileset_1, 0, 10);
        this.main_platform_details_back = this.map.createLayer('main details back', this.tileset_1, 0, 10);
        this.main_platform_details_front = this.map.createLayer('main details front', this.tileset_1, 0, 10);
        this.hidden_path = this.map.createLayer('hidden-path', this.tileset_1, 0 , 10);
        this.hidden_path_details = this.map.createLayer('hidden-path details', this.tileset_1, 0 , 10);

        // Collision exclusion
        this.collisionExclusion(this.brick_platform);
        this.collisionExclusion(this.invisible_wall);
        this.collisionExclusion(this.main_platform);
        this.collisionExclusion(this.hidden_path);
        this.collisionExclusion(this.tp[0]);
        this.collisionExclusion(this.tp[1]);
        this.collisionExclusion(this.tp[2]);
        this.collisionExclusion(this.tp[3]);
        this.collisionExclusion(this.tp[4]);
        this.collisionExclusion(this.tp[5]);
        this.collisionExclusion(this.tp[6]);

        // Player and Monster
        this.player = new Player(this, 800, 170)
        // this.player = new Player(this,800, 170)
        this.player.player.invulnerable = false;
        this.player.setWorldCollider(false);

        this.monster = new Monster(
            this, //scene
            1000, //x
            320, //y
            this.player.player, //target
            150, //move speed
            1000); //shoot speed
        this.monster.setScale(2);

        // Colliders
        this.platform_collisions = [
            this.physics.add.collider(this.player.player, this.main_platform),
            this.physics.add.collider(this.player.player, this.invisible_wall),
            this.physics.add.collider(this.player.player, this.brick_platform),
            this.physics.add.collider(this.player.player, this.hidden_path)
        ]
        
        this.teleporter_collisions = [
            this.physics.add.collider(this.player.player, this.tp[0], this.teleportTo7, null, this),
            this.physics.add.collider(this.player.player, this.tp[1], this.teleportTo3, null, this),
            this.physics.add.collider(this.player.player, this.tp[2], this.teleportTo2, null, this),
            this.physics.add.collider(this.player.player, this.tp[3], this.teleportToIsland, null, this),
            this.physics.add.collider(this.player.player, this.tp[4], this.teleportTo6, null, this),
            this.physics.add.collider(this.player.player, this.tp[5], this.teleportTo5, null, this),
            this.physics.add.collider(this.player.player, this.tp[6], this.teleportTo1, null, this),
            this.physics.add.collider(this.player.player, this.tp[7], this.nextStage, null, this)
        ]

        this.teleporter_collisions[7].active = false

        this.physics.add.overlap(this.player.player, this.diamonds, this.collectDiamonds, null, this);

        // this.hidden_portal =

        this.playerCam = this.cameras.main;
        this.monsterCam = this.cameras.add();

        this.playerCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.playerCam.startFollow(this.player.player).setZoom(2.52);

        this.monsterCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.monsterCam.startFollow(this.monster.monster).setZoom(2.52);

        this.monsterCam.setVisible(false);

        // this.cameras.main.setBackgroundColor('#ffffff')
        this.scene.launch(SCENE_KEYS.SCENES.UI, {sceneKey: this.scene.key, player: this.player});

        //VIDEO EVENT
        this.video = this.add.video(this.cameras.main.centerX + 160, this.cameras.main.centerY, 'level-2-video');
        this.video.setScale(0.67).setDepth(5).setVolume(0.05);

        this.video.play();

        this.deathEvent();
    }

    update(){
        if(this.video.isPlaying() == false) {
            this.playerCam.setZoom(2.52);
            this.scene.setVisible(true, SCENE_KEYS.SCENES.UI);
            this.scene.resume(SCENE_KEYS.SCENES.UI);

            // this.bg_music.play();

            this.video.setVisible(false);
            this.video.destroy();

            this.player.update();
            this.monster.update();
    
            this.cameraFunc();

            this.events.emit('stage2-goal');

            // animation for diamonds
            for(const diamond of this.diamonds.children.entries) {
                diamond.play('shine', true);
            }

        } else if(this.video.isPlaying() == true) {

            this.playerCam.setZoom(1);
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
                {
                    scene: this.scene.key,
                    obj1: this.diamondsCollected,
                    obj2: null
                
                });
        });
    }

    //Collect diamonds
    collectDiamonds(player, diamond){
        this.events.emit('collectGem');

        diamond.destroy(diamond.x, diamond.y);
        this.diamondsCollected++

        if (this.diamondsCollected==4){
            this.cameras.main.shake(250, 0.002);
            this.platform_collisions[3].active = false;
            this.hidden_path.destroy();
            this.hidden_path_details.destroy();
        }

        if (this.diamondsCollected==5){
            // changes portal texture
            this.portal.setTexture('portal-active');
            
            // activates portal
            this.collisionExclusion(this.tp[7]);
            this.teleporter_collisions[7].active = true
        }
    }

    cameraFunc() {
        if(this.Q.isDown) {
            this.player.enableControls(false);
            this.player.resetControls();
            this.monsterCam.setVisible(true);
        } else {
            this.player.enableControls(true);
            this.monsterCam.setVisible(false);
        }
    }

    //teleporters
    nextStage(){
        this.sound.stopAll();
        this.scene.start(SCENE_KEYS.SCENES.LEVEL_3)
    }

    prevStage(player, exit){
        this.sound.stopAll();
        this.scene.start(SCENE_KEYS.SCENES.LEVEL_1);

    }

    teleportTo1(player, teleporter){
        if(!this.teleportSound.isPlaying) {
            this.teleportSound.play();
        } else {
            this.teleportSound.stop();
            this.teleportSound.play();
        }
        player.setPosition(2760, 470)
    }

    teleportTo2(player, teleporter){
        if(!this.teleportSound.isPlaying) {
            this.teleportSound.play();
        } else {
            this.teleportSound.stop();
            this.teleportSound.play();
        }
        player.setPosition(2530, 430)
    }

    teleportTo3(player, teleporter){
        if(!this.teleportSound.isPlaying) {
            this.teleportSound.play();
        } else {
            this.teleportSound.stop();
            this.teleportSound.play();
        }
        player.setPosition(2260, 520)
    }

    teleportToIsland(player, teleporter){
        if(!this.teleportSound.isPlaying) {
            this.teleportSound.play();
        } else {
            this.teleportSound.stop();
            this.teleportSound.play();
        }
        player.setPosition(2000, 74)
    }
    
    teleportTo5(player, teleporter){
        if(!this.teleportSound.isPlaying) {
            this.teleportSound.play();
        } else {
            this.teleportSound.stop();
            this.teleportSound.play();
        }
        player.setPosition(570, 510)
    }

    teleportTo6(player, teleporter){
        if(!this.teleportSound.isPlaying) {
            this.teleportSound.play();
        } else {
            this.teleportSound.stop();
            this.teleportSound.play();
        }
        player.setPosition(600, 410)
    }

    teleportTo7(player, teleporter){
        if(!this.teleportSound.isPlaying) {
            this.teleportSound.play();
        } else {
            this.teleportSound.stop();
            this.teleportSound.play();
        }
        player.setPosition(110, 480)
    }

}