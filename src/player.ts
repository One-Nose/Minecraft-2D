/**
 * Represents a player
 */
export default class Player {
    /** The X position of the player in blocks */
    x: number

    /** The Y position of the player in blocks */
    y: number

    /**
     * @param x The X position of the player in blocks
     * @param y The Y position of the player in blocks
     */
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}
