export default class MoveDownState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        // this.player.play('run');

        const speed = 1000;
        this.player.setVelocityY(speed)
        // this.player.setAccelerationY(speed)
    }
}