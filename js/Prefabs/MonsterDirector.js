export default class MonsterDirector {
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
            10
            );
    }

    directionState() {
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
                    this.monster.body.position.y + 50,
                    1000
                    );
            }
            else if(this.monster.body.position.x < this.player.body.position.x) {
                //dash right
                this.physics.moveTo(
                    this.monster,
                    1100,
                    this.monster.body.position.y - 50,
                    1000
                    );
            }
    }

    stateManager() {
        this.directionState();

        let state = Math.floor(Math.random() * 10);
        // console.log(state);

        switch(state) {
            case 9:
                // console.log('dash');
                // this.dash();
                break;
            default:
                this.defaultState();
        }
    }
}