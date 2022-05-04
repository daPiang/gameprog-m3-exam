import { SCENE_KEYS } from "../SceneKeys.js";

export class UiScene extends Phaser.Scene {
    constructor() {
        super({key: SCENE_KEYS.SCENES.UI});

        this.jumpCount = 0;
        this.sceneRef;
    }

    init(data) {
        // console.log('UI Launched');
        this.sceneRef = data.sceneKey;
        this.player = data.player;
    }

    create() {
        this.level = this.scene.get(this.sceneRef);

        this.scene.bringToTop();
        this.uiEvents();

        this.timerUI = this.add.text(1270, 10, '00:00', {
            font: '48px Arial',
            fill: '#ffffff',
            align: 'right'
        }).setOrigin(1, 0);

        //BARS
        this.hpBar = this.makeBar(111, 28, 0xe74c3c);
        this.stamBar = this.makeBar(111, 70, 0x2ecc71);

        this.hpBar.scaleX = 6/6;
        this.stamBar.scaleX = 1000/1000;

        this.ui = this.add.image(15, 0,'health-ui').setScale(3).setOrigin(0,0);

        let milliseconds = 0;
        let seconds = 0;
        let minutes = 0;
        let hours = 0;

        this.timer = this.time.addEvent({
            delay: 100,
            callback: ()=>{
                milliseconds++;
                if(milliseconds==11) {
                    milliseconds = 0;
                    seconds++;
                }

                if(seconds==61) {
                    seconds = 0;
                    minutes++;
                }

                if(minutes==61) {
                    minutes=0;
                    hours++;
                    this.timerUI.setText(this.pad(hours, 2) + ':' + this.pad(minutes, 2) + ':' + this.pad(seconds, 2) + '.' + this.pad(milliseconds, 2));
                } else {
                    this.timerUI.setText(this.pad(minutes, 2) + ':' + this.pad(seconds, 2) + '.' + this.pad(milliseconds, 2));
                }
            },
            loop: true
        });
    }

    pad(num, size) {
        num = num.toString();
        while (num.length < size) num = '0' + num;
        return num;
    }

    makeBar(x, y, color) {
        let bar = this.add.graphics();

        bar.fillStyle(color, 1);

        bar.fillRect(0, 0, 279, 42);

        bar.x = x;
        bar.y = y;

        return bar;
    }

    uiTimer() {

    }

    uiEvents() {
        //Listen for event from scene


        this.level.events.on('hpLoss', () => {
            --this.player.hp;
            if(this.player.hp < 0) {
                this.player.hp = 0;
            }
            this.hpBar.scaleX = this.player.hp/this.player.hpCap;
        })

        this.level.events.on('sprint', () => {
            this.player.stamina -= this.player.sprintCost;
            if(this.player.stamina <= 0) {
                this.player.stamina = 0;
            }
            this.stamBar.scaleX = this.player.stamina/this.player.staminaCap;
        });

        this.level.events.on('sprintRecovery', () => {
            this.player.stamina += this.player.sprintRecovery;
            this.stamBar.scaleX = this.player.stamina/this.player.staminaCap;
        });

        this.level.events.on('jump', () => {
            this.player.stamina -= this.player.jumpCost;
            if(this.player.stamina <= 0) {
                this.player.stamina = 0;
            }
            this.stamBar.scaleX = this.player.stamina/this.player.staminaCap;
        },
        this
        );
    }

}