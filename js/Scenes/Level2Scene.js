import { SCENE_KEYS } from "../SceneKeys.js";
import Player from "../Prefabs/Player.js";

export class Level2Scene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.LEVEL_2
        })
    }

    init() {
        this.diamondsCollected = 0
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
        this.player = new Player(this, 100, 300)
        // this.player = new Player(this,800, 170)
        this.player.player.invulnerable = false;
        this.player.setWorldCollider(false);

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
            this.physics.add.collider(this.player.player, this.tp[7], this.hiddenTp, null, this)
        ]

        this.teleporter_collisions[7].active = false

        this.physics.add.overlap(this.player.player, this.diamonds, this.collectDiamonds, null, this);

        // this.hidden_portal =

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.player).setZoom(2.52);

        // this.cameras.main.setBackgroundColor('#ffffff')
    }

    update(){
        this.player.update();

        // animation for diamonds
        for(const diamond of this.diamonds.children.entries) {
            diamond.play('shine', true);
        }
    }

    //Collect diamonds
    collectDiamonds(player, diamond){
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

    //teleporters
    hiddenTp(player, portal){
        player.setPosition(800, 170)
    }

    teleportTo1(player, teleporter){
        player.setPosition(2760, 470)
    }

    teleportTo2(player, teleporter){
        player.setPosition(2530, 430)
    }

    teleportTo3(player, teleporter){
        player.setPosition(2260, 520)
    }

    teleportToIsland(player, teleporter){
        player.setPosition(2000, 74)
    }
    
    teleportTo5(player, teleporter){
        player.setPosition(570, 510)
    }

    teleportTo6(player, teleporter){
        player.setPosition(600, 410)
    }

    teleportTo7(player, teleporter){
        player.setPosition(110, 480)
    }

}