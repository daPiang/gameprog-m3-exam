import IdleState from "./movement_states/IdleState.js"
import MoveDownState from "./movement_states/MoveDownState.js"
import MoveLeftDiagState from "./movement_states/MoveLeftDiagState.js"
import MoveLeftState from "./movement_states/MoveLeftState.js"
import MoveRightDiagState from "./movement_states/MoveRightDiagState.js"
import MoveRightState from "./movement_states/MoveRightState.js"
import MoveUpState from "./movement_states/MoveUpState.js"


export default class PlayerController {
    states

    currentState

    constructor(player) {
        this.states = {
            idle: new IdleState(player),
            moveLeft: new MoveLeftState(player),
            moveRight: new MoveRightState(player),
            moveDown: new MoveDownState(player),
            moveUp: new MoveUpState(player),
            moveLeftDiag: new MoveLeftDiagState(player),
            moveRightDiag: new MoveRightDiagState(player)
        }
    }

    setState(name) {
        if(this.currentState === this.states[name]) {
            return
        }

        this.currentState = this.states[name];
        this.currentState.enter();
    }
}