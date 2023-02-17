import app from "graphics/app"
import { Sprite, Texture } from "pixi.js"
import Block from "world/block"
import World from "world/world"

/**
 * Represents a player
 */
export default class Player {
    /** The player's sprite */
    sprite: Sprite

    /** The player's world */
    world: World

    /** The X position of the player in blocks */
    x: number

    /** The Y position of the player in blocks */
    y: number

    /**
     * @param world The player's world
     * @param x The X position of the player in blocks
     * @param y The Y position of the player in blocks
     */
    constructor(world: World, x: number, y: number) {
        this.sprite = new Sprite(Texture.WHITE)
        this.sprite.anchor.x = 0.5
        this.sprite.anchor.y = 1
        this.sprite.x = Block.SIZE_3D * Math.cos(Block.SKEW) / 2
        this.sprite.y = Block.SIZE - this.sprite.x
        app.stage.addChild(this.sprite)

        this.world = world
        this.x = x
        this.y = y

        app.ticker.add(() => {
            this.tick()
        })
    }

    /**
     * Moves the player towards a location
     * @param x The relative X of the new location
     * @param y The relative Y of the new location
     */
    move(x: number, y: number): void {
        let currentX = this.x
        let currentY = this.y
        while (currentX <= this.x + x && currentY <= this.y + y) {
            // TODO
            break
        }
    }

    /**
     * Runs every tick
     */
    tick(): void {
        this.move(0, -1)
    }
}
