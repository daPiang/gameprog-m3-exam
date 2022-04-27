export default class MoveLeftState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        this.player.play('run');
        this.player.flipX = true;

        const speed = 300;
        this.player.setVelocity(-speed, 0)
    }
}