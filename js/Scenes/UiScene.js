import { SCENE_KEYS } from "../SceneKeys.js";

export class UiScene extends Phaser.Scene {
    constructor() {
        super({key: SCENE_KEYS.SCENES.UI});
    }

    init(data) {
        this.sceneRef = data.sceneKey;
        this.player = data.player;

        //Level-1
        this.stage1PathFound = false;
    }

    create() {
        this.level = this.scene.get(this.sceneRef);

        this.scene.bringToTop();
        this.uiEvents();

        this.timerUI = this.add.text(this.cameras.main.centerX, 20, '00:00', {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0);

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

        this.objectives = this.add.text(100, 250, 'OBJECTIVES', {
            font: '20px Arial',
            fill: '#dbba00',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.objectiveList = this.add.text(100, 290, '', {
            font: '18px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.gobletObjective = this.add.text(100, 340, '', {
            font: '18px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.timer = this.time.addEvent({
            delay: 100,
            callback: ()=>{
                milliseconds++;
                if(milliseconds==10) {
                    milliseconds = 0;
                    seconds++;
                }

                if(seconds==60) {
                    seconds = 0;
                    minutes++;
                }

                if(minutes==60) {
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

    uiEvents() {
        //Listen for event from scene

        //Player Events
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
        });

        //Level-1 Events

        this.level.events.once('stage1-path', () => {
            this.stage1PathFound = true;
        });
        
        this.level.events.once('stage1-goal', () => {
            if(this.stage1PathFound == true) {
                this.objectiveList.setText('Head deeper through\nthe portal');
            } else {
                this.objectiveList.setText('Find the hidden\npath');
            }
        });

        //Level-2 Events

        this.level.events.once('0DIA', () => {
            this.objectiveList.setText('Collect Gems\n' + '(0/5)');
        });
        this.level.events.once('1DIA', () => {
            this.objectiveList.setText('Collect Gems\n' + '(1/5)');
        });
        this.level.events.once('2DIA', () => {
            this.objectiveList.setText('Collect Gems\n' + '(2/5)');
        });
        this.level.events.once('3DIA', () => {
            this.objectiveList.setText('Collect Gems\n' + '(3/5)');
        });
        this.level.events.once('4DIA', () => {
            this.objectiveList.setText('Collect Gems\n' + '(4/5)');
        });
        this.level.events.once('5DIA', () => {
            this.objectiveList.setText('Head deeper through\nthe portal');
        });

        //Level-3 Events

        this.level.events.once('0CRY', () => {
            this.objectiveList.setText('Collect Crystals\n' + '(0/5)');
        });
        this.level.events.once('1CRY', () => {
            this.objectiveList.setText('Collect Crystals\n' + '(1/5)');
        });
        this.level.events.once('2CRY', () => {
            this.objectiveList.setText('Collect Crystals\n' + '(2/5)');
        });
        this.level.events.once('3CRY', () => {
            this.objectiveList.setText('Collect Crystals\n' + '(3/5)');
        });
        this.level.events.once('4CRY', () => {
            this.objectiveList.setText('Collect Crystals\n' + '(4/5)');
        });
        this.level.events.once('5CRY', () => {
            this.objectiveList.setText('Collect Crystals\n' + '(5/5)');
        });

        this.level.events.once('0CHA', () => {
            this.gobletObjective.setText('Collect Chalice\n' + '(0/1)');
        });
        this.level.events.once('1CHA', () => {
            this.gobletObjective.setText('Return to the\nAltar');
        });
        this.level.events.once('2CHA', () => {
            this.gobletObjective.setText('');
        });      

        this.level.events.once('3DOOR', () => {
            this.objectiveList.setText('Head deeper through\nthe portal');
        });
    }

}