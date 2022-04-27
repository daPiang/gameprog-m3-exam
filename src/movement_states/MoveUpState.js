export default class MoveUpState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        // this.player.play('run');

        const speed = 700;
        this.player.setVelocity(0, -speed)
    }
}