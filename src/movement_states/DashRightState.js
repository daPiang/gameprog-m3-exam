export default class DashRightState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        this.player.setVelocityX(1000);
    }
}