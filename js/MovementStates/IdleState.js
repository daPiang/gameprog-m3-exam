export default class IdleState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        this.player.setVelocity(0, 0);
        this.player.setAcceleration(0, 0);
        
        this.player.play('idle');
    }
}