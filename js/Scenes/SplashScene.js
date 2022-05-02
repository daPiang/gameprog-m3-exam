import { SCENE_KEYS } from "../SceneKeys.js";

export class SplashScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.SPLASH
        })
    }

    preload() {
        this.load.image("menu_bg", "./assets/images/MENU-BG.png");
        this.load.image("start", "./assets/images/START.png");
        this.load.image("select", "./assets/images/SELECT.png");
        this.load.image("option", "./assets/images/OPTIONS.png");
        this.load.image("title", "./assets/images/TITLE.png");
        this.load.image("pointer", "./assets/images/POINTER.png");
        this.load.image("logo", "./assets/images/LOGO.png");

        this.load.audio("logo_sound", "./assets/sounds/LOGO.mp3");
        this.load.audio("bg_music", "./assets/music/BG_MUSIC.mp3");

        this.load.atlas('player_atlas', './assets/atlas/player_atlas.png', './assets/atlas/player_atlas.json');
        this.load.atlas('mon_atlas', './assets/atlas/mon_atlas.png', './assets/atlas/mon_atlas.json');

        this.load.image('brick-tiles', './assets/maps/tileset-bricks.png');
        this.load.image('platforming-tiles', './assets/maps/tileset-floors.png');
        this.load.image('otherworld-tiles', './assets/maps/tileset-otherworld.png');
        
        // Level-1
        this.load.image('moon', './assets/images/PARALLAX BG/MOON-BG.png');
        this.load.image('tree1', './assets/images/PARALLAX BG/TREE-LAYER-1.png');
        this.load.image('tree2', './assets/images/PARALLAX BG/TREE-LAYER-2.png');
        this.load.image('tree3', './assets/images/PARALLAX BG/TREE-LAYER-3.png');
        this.load.image('tree4', './assets/images/PARALLAX BG/TREE-LAYER-4.png');
        this.load.image('tree5', './assets/images/PARALLAX BG/TREE-LAYER-5.png');
        
        this.load.tilemapTiledJSON('tilemap-1', './assets/maps/stage-1.tmj');

        // Level-2
        this.load.image('sky', './assets/images/PARALLAX BG/SKY-BG.png');
        this.load.image('cloud1', './assets/images/PARALLAX BG/CLOUD-1.png');
        this.load.image('cloud2', './assets/images/PARALLAX BG/CLOUD-2.png');

        this.load.tilemapTiledJSON('tilemap-2', './assets/maps/stage-2.tmj');      

        //asset load test
        // for(var i = 0; i < 500; i++) {
        //     this.load.image('logo'+i, './assets/images/LOGO.png');
        // }

        let progBar = this.add.graphics();
        let progBox = this.add.graphics();

        // progBar.setDepth(1);

        progBox.fillStyle(0x222222, 0.8);
        progBox.fillRect(
            472.5,
            342.5,
            320,
            50
        );
        
        //Loading
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadText = this.make.text({
            x: width/2,
            y: height/2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadText.setOrigin(0.5,0.5);

        //Percentage
        let percentText = this.make.text({
            x: width/2,
            y: height/2 + 8,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5,0.5);

        //Assets
        let assetText = this.make.text({
            x: width/2,
            y: height/2 + 55,
            text: 's',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5,0.5);

        //Event Listeners
        this.load.on('progress', function(value) {
            console.log(value);

            percentText.setText(parseInt(value * 100) + '%');

            progBar.clear();
            progBar.fillStyle(0xffffff, 1);
            progBar.fillRect(
                482.5,
                352.5,
                300 * value,
                30
            );
        });

        this.load.on('fileprogress', function(file) {
            console.log(file.src);

            assetText.setText('Loading asset: ' + file.src); //change to file.src or file.key
        });
        
        this.load.on('complete', function() {
            console.log('complete');

            progBar.destroy();
            progBox.destroy();
            loadText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }

    create() {
        // this.input.keyboard.once('keydown-SPACE', ()=> {
        //     // this.scene.start(SCENE_KEYS.SCENES.MENU);
        //     this.sound.destroy();
        // }); //Code Skipping Logo Fade

        // let logo = this.add.image(0,0,"logo").setOrigin(0,0);
        // this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, ()=> {
        //     this.time.delayedCall(1500, ()=> {
        //         this.cameras.main.fadeOut(500);
        //     });
        // });

        // this.sound.play("logo_sound", {
        //     volume: 0.04
        // });
        // this.cameras.main.fadeIn(3000);

        // this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, ()=> {
        //     // this.scene.start(SCENE_KEYS.SCENES.MENU);
        // });

        this.scene.start(SCENE_KEYS.SCENES.LEVEL_2);
    }
}