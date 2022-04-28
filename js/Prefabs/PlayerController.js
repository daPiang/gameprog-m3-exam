import DashLeftState from "../MovementStates/DashLeftState.js"
import DashRightState from "../MovementStates/DashRightState.js"
import IdleState from "../MovementStates/IdleState.js"
import MoveDownState from "../MovementStates/MoveDownState.js"
import MoveLeftState from "../MovementStates/MoveLeftState.js"
import MoveRightState from "../MovementStates/MoveRightState.js"
import MoveUpState from "../MovementStates/MoveUpState.js"


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