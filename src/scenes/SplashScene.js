import { SCENE_KEYS } from "../scene_constants.js";

export class SplashScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.SPLASH
        })
    }

    init() {

    }

    preload() {
        this.load.image("menu_bg", "./assets/images/BG.jpg");
        this.load.image("start", "./assets/images/START.png");
        this.load.image("select", "./assets/images/SELECT.png");
        this.load.image("option", "./assets/images/OPTIONS.png");
        this.load.image("title", "./assets/images/TITLE.png");
        this.load.image("pointer", "./assets/images/POINTER.png");

        this.load.image("logo", "./assets/images/LOGO.png");

        //asset load test
        for(var i = 0; i < 500; i++) {
            this.load.image('logo'+i, './assets/images/LOGO.png');
        }

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

            assetText.setText('Loading asset: ' + file.key); //change to file.src later
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
        this.input.keyboard.once('keydown-SPACE', ()=> {
            this.scene.start(SCENE_KEYS.SCENES.MENU, "Hello");
        }); //Code Skipping Logo Fade

        let logo = this.add.image(0,0,"logo").setOrigin(0,0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, ()=> {
            this.time.delayedCall(1500, ()=> {
                this.cameras.main.fadeOut(500);
            });
        });

        this.cameras.main.fadeIn(2000);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, ()=> {
            this.scene.start(SCENE_KEYS.SCENES.MENU, "Hello");
        });
    }
}