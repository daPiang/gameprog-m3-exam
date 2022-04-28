export default class MonsterDirector {

    cnt = 0;

    constructor(monster, player, physics, time) {
        this.monster = monster;
        this.player = player;
        this.physics = physics;
        this.time = time;
    }

    defaultState() {
        this.physics.moveToObject(
            this.monster,
            this.player,
            200
            );
    }

    directSprite() {
        if(this.monster.body.velocity.x > 0) {
            this.monster.flipX = false;
        }
        if(this.monster.body.velocity.x < 0) {
            this.monster.flipX = true;
        }
    }

    dash() {
            if(this.monster.body.position.x > this.player.body.position.x) {
                //dash left
                this.physics.moveTo(
                    this.monster,
                    25,
                    this.monster.body.position.y,
                    2000
                    );
            }
            else if(this.monster.body.position.x < this.player.body.position.x) {
                //dash right
                this.physics.moveTo(
                    this.monster,
                    1100,
                    this.monster.body.position.y,
                    2000
                    );
            }
    }

    stateManager() {
        this.directSprite();

        let asd = Math.floor(Math.random() * 10);
        // console.log(asd);

        switch(asd) {
            case 8:
                break;
            case 9:
                break;
            case 10:
                console.log('dash');
                // this.dash();
                break;
            default:
                this.defaultState();
        }
    }
}