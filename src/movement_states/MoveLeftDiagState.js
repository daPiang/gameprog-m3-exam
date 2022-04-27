export default class MoveLeftDiagState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        this.player.flipX = false;

        const speed = 300;
        const speed2 = 700;
        this.player.setVelocity(-speed, -speed2)
    }
}