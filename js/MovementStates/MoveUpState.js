export default class MoveUpState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        // this.player.play('run');

        const speed = 500;
        this.player.setVelocityY(-speed)
    }
}