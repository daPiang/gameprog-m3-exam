export default class MoveDownState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        const speed = 500;
        this.player.setVelocityY(speed)
    }
}