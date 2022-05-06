export default class Entity{
    constructor(physics, anims, events, sound, input, time) {
        this.physics = physics;
        this.anims = anims;
        this.input = input;
        this.events = events;
        this.sound = sound;
        this.time = time;
    }
}