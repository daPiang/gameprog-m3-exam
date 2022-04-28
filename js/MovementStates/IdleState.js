export default class IdleState {
    player

    constructor(player) {
        this.player = player;
    }

    enter() {
        this.player.setVelocityX(0);
        
        this.player.play('idle');
    }
}