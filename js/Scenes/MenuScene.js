import { SCENE_KEYS } from "../SceneKeys.js";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.MENU
        })
    }

    _buttonsArray = [];
    _buttonIndex = 0;
    _keyboardUsed = 0;
    _menu_bg;
    _menu_pointer;
    _start_btn;
    _select_btn;
    _option_btn;

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    //Menu objects are peloaded in the SplashScene

    create() {
        //Menu Stuff

        this._menu_bg = this.add.image(0,0,"menu_bg").setOrigin(0,0);

        let menu_title = this.add.image(340,60,"title").setOrigin(0,0);

        menu_title.setScale(0.6);

        //Menu Buttons

        this._start_btn = this.add.image(
            this.game.renderer.width/1.29,
            this.game.renderer.height/1.43,
            "start")

        this._controls_btn = this.add.image(
            this.game.renderer.width/1.34,
            this.game.renderer.height/1.27,
            "controls")

        this._credits_btn = this.add.image(
            this.game.renderer.width/1.31,
            this.game.renderer.height/1.14,
            "credits")
        
        this._start_btn.setScale(0.5, 0.26);
        this._controls_btn.setScale(1, 0.6);
        this._credits_btn.setScale(1, 0.6);

        //Pointer

        this._menu_pointer_1 = this.add.image(200,200,"pointer").setOrigin(-2.5, 0.5);
        this._menu_pointer_1.setVisible(false);

        this._menu_pointer_2 = this.add.image(200,200,"pointer").setOrigin(-6.9, 0.5);
        this._menu_pointer_2.setVisible(false);
        this._menu_pointer_2.flipX = true;
        
        //Image opetion
        this._image_selection = this.add.image(0,0).setOrigin(0,0);

        //Mouse Interactivity

        //MENU BG
        this._menu_bg.setInteractive();

        this._menu_bg.on("pointerover", ()=>{
            this._menu_pointer_1.setVisible(false);
            this._menu_pointer_2.setVisible(false);
            this._start_btn.setTint('0xffffff');
            this._controls_btn.setTint('0xffffff');
            this._credits_btn.setTint('0xffffff');
        })
        //START
        this._start_btn.setInteractive();

        this._start_btn.on("pointerover", ()=>{
            this.selectButton(0);
            this._keyboardUsed = 1;
        })

        this._start_btn.on("pointerout", ()=>{
            this._menu_pointer_1.setVisible(false);
            this._menu_pointer_2.setVisible(false);
            this._start_btn.setTint('0xffffff');
        })

        this._start_btn.on("pointerup", ()=>{
            this.confirmSelection();
        })
        //SELECT
        this._controls_btn.setInteractive();

        this._controls_btn.on("pointerover", ()=>{
            this.selectButton(1);
            this._keyboardUsed = 1;
        })

        this._controls_btn.on("pointerout", ()=>{
            this._menu_pointer_1.setVisible(false);
            this._menu_pointer_2.setVisible(false);
            this._controls_btn.setTint('0xffffff');
        })

        this._controls_btn.on("pointerup", ()=>{
            this.confirmSelection();
        })
        //OPTION
        this._credits_btn.setInteractive();

        this._credits_btn.on("pointerover", ()=>{
            this.selectButton(2);
            this._keyboardUsed = 1;
        })

        this._credits_btn.on("pointerout", ()=>{
            this._menu_pointer_1.setVisible(false);
            this._menu_pointer_2.setVisible(false);
            this._credits_btn.setTint('0xffffff');
        })

        this._credits_btn.on("pointerup", ()=>{
            this.confirmSelection();
        })

        //Keyboard Interactivity
        //START
        this._start_btn.on('selected', ()=>{
            this.sound.stopAll();
            this.scene.start(SCENE_KEYS.SCENES.LEVEL_1);
        })
        //CONTROLS
        this._controls_btn.on('selected', ()=>{
            this.openImage('controls')
        })
        //CREDITS
        this._credits_btn.on('selected', ()=>{
            this.openImage('credits');
        })
        //Clean Events
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, ()=>{
            this._start_btn.off('selected')
            this._controls_btn.off('selected')
            this._credits_btn.off('selected')
        })

        this._buttonsArray.push(this._start_btn);
        this._buttonsArray.push(this._controls_btn);
        this._buttonsArray.push(this._credits_btn);

        this.sound.play('bg_music', {
            loop: true,
            volume: 0.6
        });
    }

    selectButton(index) {
        const currentButton = this._buttonsArray[this._buttonIndex];

        currentButton.setTint('0xffffff');
    
        const button = this._buttonsArray[index]
    
        button.setTint('0xff2222');
    
        this._buttonIndex = index;
    
        switch(index) {
            case 0:
                this._menu_pointer_1.setVisible(true);
                this._menu_pointer_1.x = this._start_btn.x - (this._start_btn.width - 75);
                this._menu_pointer_1.y = this._start_btn.y;

                this._menu_pointer_2.setVisible(true);
                this._menu_pointer_2.x = this._start_btn.x - (this._start_btn.width - 75);
                this._menu_pointer_2.y = this._start_btn.y;

                this._controls_btn.setTint('0xffffff');
                this._credits_btn.setTint('0xffffff');
                break;
            case 1:
                this._menu_pointer_1.setVisible(true);
                this._menu_pointer_1.x = this._controls_btn.x - (this._start_btn.width - 55);
                this._menu_pointer_1.y = this._controls_btn.y;
                
                this._menu_pointer_2.setVisible(true);
                this._menu_pointer_2.x = this._controls_btn.x - (this._start_btn.width - 105);
                this._menu_pointer_2.y = this._controls_btn.y;

                    
                this._start_btn.setTint('0xffffff');
                this._credits_btn.setTint('0xffffff');
                break;
            case 2:
                this._menu_pointer_1.setVisible(true);
                this._menu_pointer_1.x = this._credits_btn.x - (this._start_btn.width - 75);
                this._menu_pointer_1.y = this._credits_btn.y;
                
                this._menu_pointer_2.setVisible(true);
                this._menu_pointer_2.x = this._credits_btn.x - (this._start_btn.width - 80);
                this._menu_pointer_2.y = this._credits_btn.y;

                this._start_btn.setTint('0xffffff');
                this._controls_btn.setTint('0xffffff');
                break;
        }
    }

    selectNextButton(change) {
        let index = this._buttonIndex + change;

        if(index >= this._buttonsArray.length) {
            index = 0;
        }
        else if(index < 0) {
            index = this._buttonsArray.length - 1;
        }

        this.selectButton(index);
    }

    confirmSelection() {
        const button = this._buttonsArray[this._buttonIndex];
        button.emit('selected');
    }

    openImage(selection){
        
        this._start_btn.disableInteractive();
        this._controls_btn.disableInteractive();
        this._credits_btn.disableInteractive();

        if(selection=='controls'){
            this._image_selection.setTexture('control-image');
        }
        else{this._image_selection.setTexture('credits-image')}
    }

    update() {

        //Keyboard Interactivity

        if(Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            if(this._keyboardUsed==0) {
                this._keyboardUsed = 1;
                this.selectNextButton(0);
            }
            else {
                this.selectNextButton(-1);
            }
        }
        else if(Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            if(this._keyboardUsed==0) {
                this._keyboardUsed = 1;
                this.selectNextButton(0);
            }
            else {
                this.selectNextButton(1);
            }
        }
        else if(Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            if(this._keyboardUsed!=0) {
                this.confirmSelection();
            }
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.ESC)) {
            this._start_btn.setInteractive();
            this._controls_btn.setInteractive();
            this._credits_btn.setInteractive();

            this._image_selection.setTexture();
        }
    }
}