import { keyboard } from 'graphics/app'
import { textures } from 'graphics/assets'
import { Sprite } from 'pixi.js'
import Block from 'world/block'
import World from 'world/world'

/**
 * Represents a player
 */
export default class Player {
    /** A player's width */
    static WIDTH = 0.6

    /** A player's height */
    static HEIGHT = 1.8

    /** The player's current motion vector in blocks/tick */
    motion: { x: number; y: number }

    /** The player's sprite */
    sprite: Sprite

    /** The player's world */
    world: World

    /** The horizontal position of the player's center in blocks */
    x: number

    /** The vertical position of the player's feet in blocks */
    y: number

    /**
     * @param world The player's world
     * @param x The X position of the player in blocks
     * @param y The Y position of the player in blocks
     */
    constructor(world: World, x: number, y: number) {
        this.sprite = new Sprite(textures.player.steve)
        this.sprite.anchor.x = 0.5
        this.sprite.anchor.y = 1
        this.sprite.pivot.x = (-Block.SIZE_3D * Math.cos(Block.SKEW)) / 2
        this.sprite.pivot.y = -this.sprite.pivot.x
        world.playerContainer.addChild(this.sprite)

        this.motion = { x: 0, y: 0 }
        this.world = world
        this.x = x
        this.y = y
    }

    /**
     * Gets the Y value of the most bottom part of the player
     * @returns The Y value of that part
     */
    bottom(): number {
        return this.y
    }

    /**
     * Gets the farthest Y value to the player's bottom
     * that is within the same block as the player
     * @returns The Y value of the bottom block edge
     */
    bottomBlockEdge(): number {
        return Math.floor(this.bottom())
    }

    /**
     * Checks if there is a solid block right to the player's bottom
     * @returns Whether there is a solid block there
     */
    isBottomSolid(): boolean {
        const rightX = this.right()
        const blockY = this.bottom() - 0.001

        let blockX = Math.floor(this.left())
        while (blockX <= rightX) {
            if (this.world.getBlock(blockX, blockY)?.block.isSolid) return true
            blockX++
        }
        return false
    }

    /**
     * Checks if there is a solid block right to the player's left
     * @returns Whether there is a solid block there
     */
    isLeftSolid(): boolean {
        const topY = this.top()
        const blockX = this.left() - 0.001

        let blockY = Math.floor(this.bottom())
        while (blockY <= topY) {
            if (this.world.getBlock(blockX, blockY)?.block.isSolid) return true
            blockY++
        }
        return false
    }

    /**
     * Checks if there is a solid block right to the player's right
     * @returns Whether there is a solid block there
     */
    isRightSolid(): boolean {
        const topY = this.top()
        const blockX = this.right() + 0.001

        let blockY = Math.floor(this.bottom())
        while (blockY <= topY) {
            if (this.world.getBlock(blockX, blockY)?.block.isSolid) return true
            blockY++
        }
        return false
    }

    /**
     * Checks if there is a solid block right to the player's top
     * @returns Whether there is a solid block there
     */
    isTopSolid(): boolean {
        const rightX = this.right()
        const blockY = this.top() + 0.001

        let blockX = Math.floor(this.left())
        while (blockX <= rightX) {
            if (this.world.getBlock(blockX, blockY)?.block.isSolid) return true
            blockX++
        }
        return false
    }

    /**
     * Gets the X value of the left part of the player
     * @returns The X value of that part
     */
    left(): number {
        return this.x - Player.WIDTH / 2
    }

    /**
     * Gets the farthest X value to the player's left
     * that is within the same block as the player
     * @returns The X value of the left block edge
     */
    leftBlockEdge(): number {
        return Math.floor(this.left())
    }

    /**
     * Moves the player according to it's `motion` vector
     */
    move(): void {
        const originalX = this.x
        const originalY = this.y
        const originalMotion = this.motion

        while (
            Math.abs(this.x - originalX) <= Math.abs(originalMotion.x) &&
            Math.abs(this.y - originalY) <= Math.abs(originalMotion.y)
        ) {
            const isXSolid =
                this.motion.x === 0
                    ? false
                    : this.motion.x > 0
                    ? this.isRightSolid()
                    : this.isLeftSolid()

            const isYSolid =
                this.motion.y === 0
                    ? false
                    : this.motion.y > 0
                    ? this.isTopSolid()
                    : this.isBottomSolid()

            if (isXSolid) this.motion.x = 0
            else this.x += Math.sign(this.motion.x) * 0.001

            if (isYSolid) this.motion.y = 0
            else this.y += Math.sign(this.motion.y) * 0.001

            if (this.motion.x === 0 && this.motion.y === 0) return
            ;({ x: this.x, y: this.y } = this.nextBlockEdge())
        }

        this.x = this.motion.x === 0 ? this.x : originalX + originalMotion.x
        this.y = this.motion.y === 0 ? this.y : originalY + originalMotion.y
    }

    /**
     * Gets the farthest point the player would move to,
     * that is still within the same block, according to their motion
     *
     * @returns The X and Y values of that point
     */
    nextBlockEdge(): { x: number; y: number } {
        const { x: nextX, y: nextY } = this.farthestInSameBlock()

        if (nextX === null && nextY === null) return { x: this.x, y: this.y }

        if (nextX === null && nextY !== null) return { x: this.x, y: nextY }

        if (nextY === null && nextX !== null) return { x: nextX, y: this.y }

        if (nextX !== null && nextY !== null) {
            const xyRatio = Math.abs(this.motion.x / this.motion.y)
            const distanceX = nextX - this.x
            const distanceY = nextY - this.y

            return Math.abs(distanceX) < Math.abs(distanceY) * xyRatio
                ? { x: nextX, y: this.y + distanceX / xyRatio }
                : { x: this.x + distanceY * xyRatio, y: nextY }
        }

        throw 'Unreachable code'
    }

    /**
     * Gets the X value of the farthest point the player can reach horizontally
     * and the Y value of the farthest point the player can reach vertically
     * in the direction of their motion, while remaining in the same block
     *
     * @returns The X and Y values of the two points
     */
    farthestInSameBlock(): { x: number | null; y: number | null } {
        return {
            x:
                this.motion.x === 0
                    ? null
                    : this.motion.x > 0
                    ? this.rightBlockEdge() - Player.WIDTH / 2 + 0.001
                    : this.leftBlockEdge() + Player.WIDTH / 2,
            y:
                this.motion.y === 0
                    ? null
                    : this.motion.y > 0
                    ? this.topBlockEdge() - Player.HEIGHT + 0.001
                    : this.bottomBlockEdge(),
        }
    }

    /**
     * Gets the X value of the right part of the player
     * @returns The X value of that part
     */
    right(): number {
        return this.x + Player.WIDTH / 2 - 0.001
    }

    /**
     * Gets the farthest X value to the player's right
     * that is within the same block as the player
     * @returns The X value of the right block edge
     */
    rightBlockEdge(): number {
        return Math.floor(this.right()) + 0.999
    }

    /**
     * Runs every tick
     */
    tick(): void {
        this.motion.x =
            keyboard.has('KeyA') && !keyboard.has('KeyD')
                ? -0.1
                : !keyboard.has('KeyA') && keyboard.has('KeyD')
                ? 0.1
                : 0
        this.motion.y = -0.1
        this.move()
    }

    /**
     * Gets the Y value of the top part of the player
     * @returns The Y value of that part
     */
    top(): number {
        return this.y + Player.HEIGHT - 0.001
    }

    /**
     * Gets the farthest Y value to the player's top
     * that is within the same block as the player
     * @returns The Y value of the top block edge
     */
    topBlockEdge(): number {
        return Math.floor(this.top()) + 0.999
    }

    /**
     * Updates the player's display
     */
    update(): void {
        this.sprite.x = this.x * Block.SIZE
        this.sprite.y = (World.HEIGHT - this.y) * Block.SIZE
    }
}
