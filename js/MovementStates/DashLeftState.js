export default class DashLeftState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        const speed = 1000;
        this.player.setVelocityX(-speed);
    }
}