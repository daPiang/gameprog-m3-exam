export default class MoveRightState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        this.player.play('run');
        this.player.flipX = false;

        const speed = 300;
        this.player.setVelocityX(speed)
    }
}