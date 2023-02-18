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
        let minX: number, maxX: number, minY: number, maxY: number

        if (this.motion.x > 0) {
            minX = -Infinity
            maxX = this.x + this.motion.x
        } else if (this.motion.x < 0) {
            minX = this.x + this.motion.x
            maxX = Infinity
        } else {
            minX = -Infinity
            maxX = Infinity
        }

        if (this.motion.y > 0) {
            minY = -Infinity
            maxY = this.y + this.motion.y
        } else if (this.motion.y < 0) {
            minY = this.y + this.motion.y
            maxY = Infinity
        } else {
            minY = -Infinity
            maxY = Infinity
        }

        minX = Number(minX.toPrecision(12))
        minY = Number(minY.toPrecision(12))

        let currentX = this.x
        let currentY = this.y
        let isXBlocked = false
        let isYBlocked = false

        while (minX <= currentX && currentX <= maxX && minY <= currentY && currentY <= maxY) {
            let deltaX = Infinity, deltaY = Infinity

            if (!isXBlocked) {
                if (this.motion.x > 0) {
                    deltaX = 1 - (currentX - Math.floor(currentX))
                } else if (this.motion.x < 0) {
                    deltaX = -(currentX - Math.floor(currentX) + 0.001)
                }
                deltaX = Number(deltaX.toPrecision(12))
            }

            if (!isYBlocked) {
                    if (this.motion.y > 0) {
                    deltaY = 1 - (currentY - Math.floor(currentY))
                } else if (this.motion.y < 0) {
                    deltaY = -(currentY - Math.floor(currentY) + 0.001)
                }
                deltaY = Number(deltaY.toPrecision(12))
            }

            let closest: 'x' | 'y' | 'none'
            if (Math.abs(deltaX) < Math.abs(deltaY)) {
                closest = 'x'
                deltaY = deltaX * this.motion.y / this.motion.x
            } else if (Math.abs(deltaY) < Math.abs(deltaX)) {
                closest = 'y'
                deltaX = deltaY * this.motion.x / this.motion.y
            } else if (deltaX === Infinity && deltaY === Infinity) {
                break
            } else closest = 'none'

            const xBeforeChange = currentX
            const yBeforeChange = currentY
            if (this.world.getBlock(currentX + deltaX, currentY)?.block?.isSolid) {
                if ((closest === 'x' || closest === 'none') && !isXBlocked) {
                    currentX = Math.max(minX, Math.min(maxX, currentX + deltaX))
                    if (this.motion.x > 0) currentX -= 0.001
                    else if (this.motion.x < 0) currentX += 0.001
                    currentX = Number(currentX.toPrecision(12))
                    this.x = currentX
                    isXBlocked = true
                }
            }
            if (this.world.getBlock(currentX, currentY + deltaY)?.block?.isSolid) {
                if ((closest === 'y' || closest === 'none') && !isYBlocked) {
                    currentY = Math.max(minY, Math.min(maxY, currentY + deltaY))
                    if (this.motion.y > 0) currentY -= 0.001
                    else if (this.motion.y < 0) currentY += 0.001
                    currentY = Number(currentY.toPrecision(12))
                    this.y = currentY
                    isYBlocked = true
                }
            }
            if (isXBlocked && isYBlocked) break

            currentX = Number((xBeforeChange + deltaX).toPrecision(12))
            currentY = Number((yBeforeChange + deltaY).toPrecision(12))
        }
        if (!isXBlocked) {
            if (this.motion.x > 0) this.x = maxX
            else if (this.motion.x < 0) this.x = minX
        }

        if (!isYBlocked) {
            if (this.motion.y > 0) this.y = maxY
            else if (this.motion.y < 0) this.y = minY
        }
    }

    /**
     * Runs every tick
     */
    tick(): void {
        this.motion.y = -0.1
        this.move()
    }
}
