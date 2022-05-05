import { SCENE_KEYS } from "../SceneKeys.js";

export class UiScene extends Phaser.Scene {
    constructor() {
        super({key: SCENE_KEYS.SCENES.UI});

        this.jumpCount = 0;
        this.sceneRef;

        this.collectedGems = 0;
        this.goalGems = 5;

        this.collectedCrystals = 0;
        this.goalCrystals = 5;

        this.collectedGoblet = 0;
        this.goalGoblet = 1;


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

                // this.objectiveList.setText('lol');
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
        let stage1PathFound = false;
        let stage2AllCrystals = false;
        let stage3GobletFound = false;
        let stage3CrystalsFound = false;

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

        this.level.events.on('stage1-path', () => {
            stage1PathFound = true;
        });

        this.level.events.on('collectGem', () => {
            this.collectedGems++;
        });

        this.level.events.on('collectCrystal', () => {
            this.collectedCrystals++;
        });

        this.level.events.on('collectGoblet', () => {
            this.collectedGoblet++;
        });

        this.level.events.on('stage1-goal', () => {
            if(stage1PathFound == true) {
                this.objectiveList.setText('Head deeper through\nthe portal');
            } else {
                this.objectiveList.setText('Find the hidden\npath');
            }
        },
        this);

        this.level.events.on('stage2-goal', () => {
            if(this.collectedGems == this.goalGems) {
                this.objectiveList.setText('Head deeper through\nthe portal');
            } else {
                this.objectiveList.setText('Collect Gems\n' + '(' + this.collectedGems + '/' + this.goalGems + ')');
            }
        },
        this);  

        this.level.events.on('returnChalice', () => {
            stage3GobletFound = true;
        });

        this.level.events.on('stage3-goal', () => {
            if(this.collectedCrystals == this.goalCrystals) {
                this.objectiveList.setText('Head deeper through\nthe giant portal');
            } else {
                this.objectiveList.setText('Collect Crystals\n' + '(' + this.collectedCrystals + '/' + this.goalCrystals + ')');
            }

            if(this.collectedGoblet == this.goalGoblet && stage3GobletFound == false) {
                this.gobletObjective.setText('Return the\nChalice');
            } else if(stage3GobletFound == true) {
                this.gobletObjective.setText('');
            } else {
                this.gobletObjective.setText('Collect Chalice\n' + '(' + this.collectedGoblet + '/' + this.goalGoblet + ')');
            }
        },
        this);
    }

}