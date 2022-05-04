export default class Entity{
    constructor(physics, anims, events, input, sound, time) {
        this.physics = physics;
        this.anims = anims;
        this.input = input;
        this.events = events;
        this.sound = sound;
        this.time = time;
    }
}