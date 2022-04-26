import { SCENE_KEYS } from "../scene_constants.js";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.SCENES.MENU
        })
    }

    _buttonsArray = [];
    _buttonIndex = 0;

    init(data) {
        console.log(data);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    //Menu objects are peloaded in the SplashScene

    create() {
        //Menu Stuff

        let menu_bg = this.add.image(0,0,"menu_bg").setOrigin(0,0);

        let menu_title = this.add.image(20,20,"title").setOrigin(0,0);

        menu_bg.setScale(0.65);
        menu_title.setScale(1.3, 1.7);

        //Menu Buttons

        let start_btn = this.add.image(
            this.game.renderer.width/2,
            this.game.renderer.height/1.315,
            "start")

        let select_btn = this.add.image(
            this.game.renderer.width/2,
            this.game.renderer.height/1.2,
            "select")

        let option_btn = this.add.image(
            this.game.renderer.width/2,
            this.game.renderer.height/1.1,
            "option")

        select_btn.setScale(0.83, 1);
        option_btn.setScale(0.76, 1);

        //Pointer

        let menu_pointer = this.add.image(200,200,"pointer");

        menu_pointer.setVisible(false);

        //Mouse Interactivity

        //START
        start_btn.setInteractive();

        start_btn.on("pointerover", ()=>{

            menu_pointer.setVisible(true);
            menu_pointer.x = start_btn.x - (start_btn.width - 75);
            menu_pointer.y = start_btn.y;
        })

        start_btn.on("pointerout", ()=>{
            menu_pointer.setVisible(false);
        })

        start_btn.on("pointerup", ()=>{
        })
        //SELECT
        select_btn.setInteractive();

        select_btn.on("pointerover", ()=>{

            menu_pointer.setVisible(true);
            menu_pointer.x = start_btn.x - (start_btn.width - 75);
            menu_pointer.y = select_btn.y;
        })

        select_btn.on("pointerout", ()=>{
            menu_pointer.setVisible(false);
        })

        select_btn.on("pointerup", ()=>{
        })
        //OPTION
        option_btn.setInteractive();

        option_btn.on("pointerover", ()=>{

            menu_pointer.setVisible(true);
            menu_pointer.x = start_btn.x - (start_btn.width - 75);
            menu_pointer.y = option_btn.y;
        })

        option_btn.on("pointerout", ()=>{
            menu_pointer.setVisible(false);
        })

        option_btn.on("pointerup", ()=>{
        })

        //Keyboard Interactivity
        //START
        start_btn.on('selected', ()=>{
            console.log('start')
        })
        //SELECT
        select_btn.on('selected', ()=>{
            console.log('select')
        })
        //OPTION
        option_btn.on('selected', ()=>{
            console.log('option')
        })
        //Clean Events
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, ()=>{
            start_btn.off('selected')
            select_btn.off('selected')
            option_btn.off('selected')
        })

        this._buttonsArray.push(start_btn);
        this._buttonsArray.push(select_btn);
        this._buttonsArray.push(option_btn);

        this.selectButton(0);
    }

    selectButton(index) {
        const currentButton = this._buttonsArray[this._buttonIndex];

        currentButton.setTint('0xffffff');

        const button = this._buttonsArray[index]

        button.setTint('0xff2222');

        this._buttonIndex = index;
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
            this.selectNextButton(-1);
        }
        else if(Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.selectNextButton(1);
        }
        else if(Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.confirmSelection();
        }
    }
}