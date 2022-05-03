import Entity from "./Entity";

export default class MonsterBullet extends Entity {
    constructor(scene, x, y) {
        super(scene.physics, scene.anims);
    }
}