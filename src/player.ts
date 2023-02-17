import app from "graphics/app"
import { Sprite, Texture } from "pixi.js"
import Block from "world/block"
import World from "world/world"

/**
 * Represents a player
 */
export default class Player {
    /** The player's current motion vector */
    motion: {x: number, y: number}

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

        this.motion = {x: 0, y: 0}
        this.world = world
        this.x = x
        this.y = y

        app.ticker.add(() => {
            this.tick()
        })
    }

    /**
     * Moves the player according to it's `motion`
     */
    move(): void {
        let minX, maxX, minY, maxY

        if (this.motion.x > 0) {
            minX = -Infinity
            maxX = this.x + this.motion.x * Block.SIZE
        } else if (this.motion.x < 0) {
            minX = this.x + this.motion.x * Block.SIZE
            maxX = Infinity
        } else {
            minX = -Infinity
            maxX = Infinity
        }

        if (this.motion.y > 0) {
            minY = this.y - this.motion.y * Block.SIZE
            maxY = Infinity
        } else if (this.motion.y < 0) {
            minY = Infinity
            maxY = this.y - this.motion.y * Block.SIZE
        } else {
            minY = -Infinity
            maxY = Infinity
        }

        let currentX = this.x
        let currentY = this.y

        // console.log(
        //     `currentX: ${currentX}\n` +
        //     `currentY: ${currentY}\n` +
        //     `minX: ${minX}\n` +
        //     `maxX: ${maxX}\n` +
        //     `minY: ${minY}\n` +
        //     `maxY: ${maxY}`
        // )
        // return
        while (minX <= currentX && currentX <= maxX && minY <= currentY && currentY <= maxY) {
            let xDistance, yDistance

            if (this.motion.x > 0) {
                xDistance = Block.SIZE - currentX % Block.SIZE
            } else if (this.motion.x < 0) {
                xDistance = currentX % Block.SIZE + 1
            } else xDistance = Infinity

            if (this.motion.y > 0) {
                yDistance = -(currentY % Block.SIZE + 1)
            } else if (this.motion.y < 0) {
                yDistance = Block.SIZE - currentY % Block.SIZE
            } else yDistance = Infinity

            if (xDistance < yDistance) {
                yDistance = -xDistance * this.motion.y / this.motion.x
            } else if (yDistance < xDistance) {
                xDistance = -yDistance * this.motion.x / this.motion.y
            }

            if (this.world.getBlock(currentX + xDistance, currentY + yDistance)?.block?.isVisible) {
                this.x = currentX + xDistance
                this.y = currentY + yDistance
                break
            }
        }
        if (this.motion.x > 0) this.x = maxX
        else if (this.motion.x < 0) this.x = minX

        if (this.motion.y > 0) this.y = minY
        else if (this.motion.y < 0) this.y = maxY
    }

    /**
     * Runs every tick
     */
    tick(): void {
        this.motion.y = -0.001
        this.move()
    }
}
