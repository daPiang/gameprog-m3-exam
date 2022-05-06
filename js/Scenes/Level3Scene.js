import { SCENE_KEYS } from "../SceneKeys.js";
import Player from "../Prefabs/Player.js";
import Monster from "../Prefabs/Monster.js";

export class Level3Scene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.LEVEL_3
        })
    }

    init() {
        this.chaliceCollected = 0;
        this.crystalsCollected = 0;

        this.Q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.F = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
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
        //Load Sound
        this.bg_music = this.sound.add('level-1-music', {
            loop: true,
            volume: 0.12
        });
        this.bg_music.play();

        this.map = this.make.tilemap({key: 'tilemap-3'});
        this.tileset_1 = this.map.addTilesetImage('main_lev_build_C', 'cave-tiles');

        this.createMultipleImages(this, 0, 100, 8, 'cave1', 0.20)
        this.createMultipleImages(this, 1, 130, 8, 'cave2', 0.25);
        this.createMultipleImages(this, -25, 80, 8, 'cave3', 0.5);

        this.add.image(1102, 530, 'portal-inactive');        
        
        // creates map
        this.exit = this.map.createLayer('exit', this.tileset_1, 0, 10);
        this.main_details_back = this.map.createLayer('main-details back', this.tileset_1, 0, 10);
        this.main_details_front = this.map.createLayer('main-details front', this.tileset_1, 0, 10);
        this.wood_platform = this.map.createLayer('wood-platforms', this.tileset_1, 0, 10);
        this.spikes = this.map.createLayer('spikes', this.tileset_1, 0, 10);
        this.altar = this.map.createLayer('altar', this.tileset_1, 0, 10);
        this.altar_activation = this.add.image(1215, 534, 'altar-inactive').setScale(1.3);

        this.doors = [
            // doors
            this.map.createLayer('door1', this.tileset_1, 0, 10),
            this.map.createLayer('door2', this.tileset_1, 0, 10),
            this.map.createLayer('door3', this.tileset_1, 0, 10),
            this.map.createLayer('door4', this.tileset_1, 0, 10)
        ]

        this.door_activations=[
            this.add.image(22.4, 144).setScale(1.24, 1.04),
            this.add.image(2840, 350).setScale(1.24, 1.04),
            this.add.image(72.4, 381).setScale(1.24, 1.04),
            this.add.image(1656, 142).setScale(1.24, 1.04),
            this.add.image(1463.6, 382).setScale(2.2, 1.5) 
        ]

        this.chalice = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        this.chaliceObj = this.map.getObjectLayer('chalice-layer').objects;
        for(const chaliceCollect of this.chaliceObj) {
            this.chalice.create(chaliceCollect.x, chaliceCollect.y, 'chalice')
                .setOrigin(0, 0.3);
        }

        this.main_platform = this.map.createLayer('main-platform', this.tileset_1, 0, 10);

        // Collision exclusions
        this.collisionExclusion(this.main_platform);
        this.collisionExclusion(this.spikes);
        this.collisionExclusion(this.wood_platform);
        this.collisionExclusion(this.altar);
        

        // creates crystals
        this.crystals = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        this.crystalObj = this.map.getObjectLayer('crystal').objects;

        for(const crystal of this.crystalObj) {
            this.crystals.create(crystal.x, crystal.y, 'crystal')
                .setOrigin(0).setScale(0.2);
        }
        
        this.anims.create({
            // Animates crystal 
            key: 'rotate',
            frames: this.anims.generateFrameNumbers('crystal', { start: 1, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Player
        this.player = new Player(this, 1110, 540);
        // this.player = new Player(this, 1640, 130);
        this.player.setWorldCollider(false);

        this.monster = new Monster(
            this, //scene
            100, //x
            350, //y
            this.player.player, //target
            170, //move speed
            500); //shoot speed
        this.monster.setScale(2);

        // Hidden area
        this.hidden_area = this.map.createLayer('hidden-area', this.tileset_1, 0, 10).setDepth(1);;
        this.hidden_path = this.map.createLayer('hidden-path', this.tileset_1, 0, 10).setDepth(1);;
        
        // Collisions
        this.platform_collisions = [
            this.physics.add.collider(this.player.player, this.main_platform),
            this.physics.add.collider(this.player.player, this.wood_platform),
            this.physics.add.collider(this.player.player, this.altar, this.altarMechanic, null, this),
            this.physics.add.collider(this.player.player, this.spikes, this.hitPlayer, null, this),
        ]

        this.door_collisions = [
            this.physics.add.collider(this.player.player, this.doors[0], this.toDoor2, null, this),
            this.physics.add.collider(this.player.player, this.doors[1], this.toDoor1, null, this),
            this.physics.add.collider(this.player.player, this.doors[2], this.toDoor4, null, this),
            this.physics.add.collider(this.player.player, this.doors[3], this.toDoor3, null, this),
        ]

        this.physics.add.overlap(this.player.player, this.crystals, this.collectCrystal, null, this);
        this.physics.add.overlap(this.player.player, this.chalice, this.collectChalice, null, this);

        // Camera
        this.playerCam = this.cameras.main;
        this.monsterCam = this.cameras.add();

        this.playerCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.playerCam.startFollow(this.player.player).setZoom(2.52);


        this.monsterCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.monsterCam.startFollow(this.monster.monster).setZoom(2.52);

        this.monsterCam.setVisible(false);

        this.scene.launch(SCENE_KEYS.SCENES.UI, {
            sceneKey: this.scene.key,
            player: this.player
        });

        //VIDEO EVENT
        this.video = this.add.video(this.cameras.main.centerX + 465, this.cameras.main.centerY, 'level-3-video');
        this.video.setScale(0.68).setDepth(5).setVolume(0.05);

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
            
            this.events.emit('stage3-goal');

            // rotates crystals
            for(const crystal of this.crystals.children.entries) {
                crystal.play('rotate', true);
            }

        } else if(this.video.isPlaying() == true) {

            this.playerCam.setZoom(1);
            this.scene.setVisible(false, SCENE_KEYS.SCENES.UI);
            this.scene.pause(SCENE_KEYS.SCENES.UI);

        }

        if(Phaser.Input.Keyboard.JustDown(this.ESC)) {
            this.video.stop();
        }

        // if(Phaser.Input.Keyboard.JustDown(this.R)) {
        //     this.scene.start(SCENE_KEYS.SCENES.CREDITS);
        // }

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

    prevStage(player, exit){
        this.sound.stopAll();
        this.scene.start(SCENE_KEYS.SCENES.LEVEL_2);

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

    // when player hits spikes
    hitPlayer(player, spikes){
        this.events.emit('obstacle-hit');

        player.setVelocityY(-200)
        
        if (player.invulnerable == false){
                player.setTint(0xb025a7);   
                player.invulnerable = true;
        }

        this.time.delayedCall(1000, ()=>{
            player.invulnerable = false;
        })
    }

    removeIFrame(){
        this.player.player.clearTint()
        this.player.player.invulnerable = false;
    }

    collectCrystal(player, crystal){
        this.events.emit("collectCrystal");

        crystal.destroy(crystal.x, crystal.y);
        this.crystalsCollected++;

        if(this.crystalsCollected==5){
            this.door_activations[4].setTexture('opened-purple');
            this.cameras.main.shake(250, 0.002);
        }
    }

    collectChalice(player, chalice){
        this.events.emit("collectGoblet");

        chalice.destroy(chalice.x, chalice.y);
        this.chaliceCollected++;
    }

    altarMechanic(player, altar){
        if(this.chaliceCollected==1){
            this.events.emit('returnChalice');
            
            this.cameras.main.shake(250, 0.002);   

            this.altar_activation.setTexture('altar-active');
            this.hidden_area.destroy();

            this.collisionExclusion(this.doors[0]);
            this.collisionExclusion(this.doors[1]);
            this.collisionExclusion(this.doors[2]);
            this.collisionExclusion(this.doors[3]);

            this.door_activations[0].setTexture('opened-blue');
            this.door_activations[1].setTexture('opened-blue');
            this.door_activations[2].setTexture('opened-red');
            this.door_activations[3].setTexture('opened-red');

            // uses the chalice collected, stops the camera shake
            this.time.delayedCall(100, ()=> {
                this.chaliceCollected--;
            });
        };
    }

    // Door Teleports
    toDoor1(player, door){
        player.setPosition(60, 154)
    }
    toDoor2(player, door){
        player.setPosition(2800, 366)
    }
    toDoor3(player, door){
        player.setPosition(120, 390)
    }
    toDoor4(player, door){
        player.setPosition(1640, 130)
    }
}