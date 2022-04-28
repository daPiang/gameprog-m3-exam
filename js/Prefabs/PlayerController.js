import DashLeftState from "./movement_states/DashLeftState.js.js"
import DashRightState from "./movement_states/DashRightState.js.js"
import IdleState from "./movement_states/IdleState.js.js"
import MoveDownState from "./movement_states/MoveDownState.js.js"
import MoveLeftState from "./movement_states/MoveLeftState.js.js"
import MoveRightState from "./movement_states/MoveRightState.js.js"
import MoveUpState from "./movement_states/MoveUpState.js.js"


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
            dashRight: new DashRightState(player),
            dashLeft: new DashLeftState(player)
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