import { SCENE_KEYS } from "../SceneKeys.js";

export class UiScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.UI
        });
        this.jumpCount = 0;
        this.sceneRef;
    }

    init(data) {
        // console.log('UI Launched');
        this.sceneRef = data.sceneKey;
    }

    create() {
        this.scene.bringToTop();
        //Simple UI Sample
        //Init Ui Element
        this.textUI = this.add.text(this.cameras.main.centerX, 100, 'Jump Count: 0', {
            font: '48px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
        
        //Reference Scene
        this.level = this.scene.get(this.sceneRef);

        //Listen for event from scene
        this.level.events.on('jump', () => {
            console.log('lol');
            ++this.jumpCount;
            this.textUI.setText('Jump Count: '+ this.jumpCount);
        },
        this
        );
    }

    update() {

    }
}