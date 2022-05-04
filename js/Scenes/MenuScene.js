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
    }

    //Menu objects are peloaded in the SplashScene

    create() {
        //Menu Stuff

        this._menu_bg = this.add.image(0,0,"menu_bg").setOrigin(0,0);

        let menu_title = this.add.image(340,60,"title").setOrigin(0,0);

        // this._menu_bg.setScale(0.70);
        menu_title.setScale(0.6);

        //Menu Buttons

        this._start_btn = this.add.image(
            this.game.renderer.width/1.34,
            this.game.renderer.height/1.43,
            "start")

        this._select_btn = this.add.image(
            this.game.renderer.width/1.42,
            this.game.renderer.height/1.27,
            "select")

        this._option_btn = this.add.image(
            this.game.renderer.width/1.5,
            this.game.renderer.height/1.14,
            "option")
        
        this._start_btn.setScale(0.5, 0.26);
        this._select_btn.setScale(0.5, 0.34);
        this._option_btn.setScale(0.5, 0.34);

        //Pointer

        this._menu_pointer_1 = this.add.image(200,200,"pointer").setOrigin(-2.5, 0.5);
        this._menu_pointer_1.setVisible(false);

        this._menu_pointer_2 = this.add.image(200,200,"pointer").setOrigin(-6.9, 0.5);
        this._menu_pointer_2.setVisible(false);
        this._menu_pointer_2.flipX = true;

        //Mouse Interactivity

        //MENU BG
        this._menu_bg.setInteractive();

        this._menu_bg.on("pointerover", ()=>{
            this._menu_pointer_1.setVisible(false);
            this._menu_pointer_2.setVisible(false);
            this._start_btn.setTint('0xffffff');
            this._select_btn.setTint('0xffffff');
            this._option_btn.setTint('0xffffff');
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
        this._select_btn.setInteractive();

        this._select_btn.on("pointerover", ()=>{
            this.selectButton(1);
            this._keyboardUsed = 1;
        })

        this._select_btn.on("pointerout", ()=>{
            this._menu_pointer_1.setVisible(false);
            this._menu_pointer_2.setVisible(false);
            this._select_btn.setTint('0xffffff');
        })

        this._select_btn.on("pointerup", ()=>{
            this.confirmSelection();
        })
        //OPTION
        this._option_btn.setInteractive();

        this._option_btn.on("pointerover", ()=>{
            this.selectButton(2);
            this._keyboardUsed = 1;
        })

        this._option_btn.on("pointerout", ()=>{
            this._menu_pointer_1.setVisible(false);
            this._menu_pointer_2.setVisible(false);
            this._option_btn.setTint('0xffffff');
        })

        this._option_btn.on("pointerup", ()=>{
            this.confirmSelection();
        })

        //Keyboard Interactivity
        //START
        this._start_btn.on('selected', ()=>{
            console.log('start')
            this.sound.stopAll();
            this.scene.start(SCENE_KEYS.SCENES.LEVEL_1);
        })
        //SELECT
        this._select_btn.on('selected', ()=>{
            console.log('select')
        })
        //OPTION
        this._option_btn.on('selected', ()=>{
            console.log('option')
        })
        //Clean Events
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, ()=>{
            this._start_btn.off('selected')
            this._select_btn.off('selected')
            this._option_btn.off('selected')
        })

        this._buttonsArray.push(this._start_btn);
        this._buttonsArray.push(this._select_btn);
        this._buttonsArray.push(this._option_btn);

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

                this._select_btn.setTint('0xffffff');
                this._option_btn.setTint('0xffffff');
                break;
            case 1:
                this._menu_pointer_1.setVisible(true);
                this._menu_pointer_1.x = this._select_btn.x - (this._start_btn.width - 75);
                this._menu_pointer_1.y = this._select_btn.y;
                
                this._menu_pointer_2.setVisible(true);
                this._menu_pointer_2.x = this._select_btn.x - (this._start_btn.width - 75);
                this._menu_pointer_2.y = this._select_btn.y;

                    
                this._start_btn.setTint('0xffffff');
                this._option_btn.setTint('0xffffff');
                break;
            case 2:
                this._menu_pointer_1.setVisible(true);
                this._menu_pointer_1.x = this._option_btn.x - (this._start_btn.width - 75);
                this._menu_pointer_1.y = this._option_btn.y;
                
                this._menu_pointer_2.setVisible(true);
                this._menu_pointer_2.x = this._option_btn.x - (this._start_btn.width - 80);
                this._menu_pointer_2.y = this._option_btn.y;

                this._start_btn.setTint('0xffffff');
                this._select_btn.setTint('0xffffff');
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
            else {
                // console.log('An Error Occured');
            }
        }
    }
}