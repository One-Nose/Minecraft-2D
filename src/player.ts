import { keyboard } from 'graphics/app'
import { textures } from 'graphics/assets'
import { Sprite } from 'pixi.js'
import {
    chain,
    Fraction,
    floor,
    fraction,
    add,
    subtract,
    abs,
    divide,
    multiply,
    equal,
    larger,
    unaryMinus,
    number,
    unequal,
} from 'mathjs'
import Block from 'world/block'
import World from 'world/world'

/**
 * Represents a player
 */
export default class Player {
    /** A player's height */
    static HEIGHT = 1.8

    /** The player's initial velocity when jumping */
    static JUMP_SPEED = 0.418

    /** A player's width */
    static WIDTH = 0.6

    /** The amount of blocks the player walks in ~1/20 seconds */
    static SPEED = 4.317 / 20

    /** The player's current motion vector in (blocks / 3 ticks) */
    motion: { x: Fraction; y: Fraction }

    /** The player's sprite */
    sprite: Sprite

    /** The player's world */
    world: World

    /** The horizontal position of the player's center in blocks */
    x: Fraction

    /** The vertical position of the player's feet in blocks */
    y: Fraction

    /**
     * @param world The player's world
     * @param x The X position of the player in blocks
     * @param y The Y position of the player in blocks
     */
    constructor(world: World, x: number, y: number) {
        this.sprite = new Sprite(textures.player.steve)
        this.sprite.anchor.x = 0.5
        this.sprite.anchor.y = 1
        this.sprite.pivot.x = -Block.ACTUAL_SIZE_3D / 2
        this.sprite.pivot.y = -this.sprite.pivot.x
        world.playerContainer.addChild(this.sprite)

        this.motion = { x: fraction(0), y: fraction(0) }
        this.world = world
        this.x = fraction(x)
        this.y = fraction(y)
    }

    /**
     * Gets the Y value of the most bottom part of the player
     * @returns The Y value of that part
     */
    bottom(): Fraction {
        return this.y
    }

    /**
     * Gets the farthest Y value to the player's bottom
     * that is within the same block as the player
     * @returns The Y value of the bottom block edge
     */
    bottomBlockEdge(): Fraction {
        return floor(this.bottom())
    }

    /**
     * Gets the X value of the farthest point the player can reach horizontally
     * and the Y value of the farthest point the player can reach vertically
     * in the direction of their motion, while remaining in the same block
     *
     * @returns The X and Y values of the two points
     */
    farthestInSameBlock(): { x: Fraction | null; y: Fraction | null } {
        return {
            x: equal(this.motion.x, 0)
                ? null
                : larger(this.motion.x, 0)
                ? chain(this.rightBlockEdge())
                      .subtract(fraction(Player.WIDTH / 2))
                      .add(fraction(0.001))
                      .done()
                : add(this.leftBlockEdge(), fraction(Player.WIDTH / 2)),
            y: equal(this.motion.y, 0)
                ? null
                : larger(this.motion.y, 0)
                ? chain(this.topBlockEdge())
                      .subtract(fraction(Player.HEIGHT))
                      .add(fraction(0.001))
                      .done()
                : this.bottomBlockEdge(),
        }
    }

    /**
     * Checks if there is a solid block right to the player's bottom
     * @returns Whether there is a solid block there
     */
    isBottomSolid(): boolean {
        const rightX = this.right()
        const blockY = subtract(this.bottom(), fraction(0.001))

        let blockX = floor(this.left())
        while (blockX <= rightX) {
            if (this.world.getBlock(blockX, blockY)?.block.isSolid) return true
            blockX = add(blockX, fraction(1))
        }
        return false
    }

    /**
     * Checks if there is a solid block right to the player's left
     * @returns Whether there is a solid block there
     */
    isLeftSolid(): boolean {
        const topY = this.top()
        const blockX = subtract(this.left(), fraction(0.001))

        let blockY = floor(this.bottom())
        while (blockY <= topY) {
            if (this.world.getBlock(blockX, blockY)?.block.isSolid) return true
            blockY = add(blockY, fraction(1))
        }
        return false
    }

    /**
     * Checks if there is a solid block right to the player's right
     * @returns Whether there is a solid block there
     */
    isRightSolid(): boolean {
        const topY = this.top()
        const blockX = add(this.right(), fraction(0.001))

        let blockY = floor(this.bottom())
        while (blockY <= topY) {
            if (this.world.getBlock(blockX, blockY)?.block.isSolid) return true
            blockY = add(blockY, fraction(1))
        }
        return false
    }

    /**
     * Checks if there is a solid block right to the player's top
     * @returns Whether there is a solid block there
     */
    isTopSolid(): boolean {
        const rightX = this.right()
        const blockY = add(this.top(), fraction(0.001))

        let blockX = floor(this.left())
        while (blockX <= rightX) {
            if (this.world.getBlock(blockX, blockY)?.block.isSolid) return true
            blockX = add(blockX, fraction(1))
        }
        return false
    }

    /**
     * Gets the X value of the left part of the player
     * @returns The X value of that part
     */
    left(): Fraction {
        return subtract(this.x, fraction(Player.WIDTH / 2))
    }

    /**
     * Gets the farthest X value to the player's left
     * that is within the same block as the player
     * @returns The X value of the left block edge
     */
    leftBlockEdge(): Fraction {
        return floor(this.left())
    }

    /**
     * Moves the player according to it's `motion` vector
     */
    move(): void {
        const originalX = this.x
        const originalY = this.y
        const originalMotion = {
            x: divide(this.motion.x, 3) as Fraction,
            y: divide(this.motion.y, 3) as Fraction,
        }

        while (
            chain(this.x)
                .subtract(originalX)
                .abs()
                .smallerEq(abs(originalMotion.x))
                .done() &&
            chain(this.y)
                .subtract(originalY)
                .abs()
                .smallerEq(abs(originalMotion.y))
                .done()
        ) {
            const isXSolid = equal(this.motion.x, 0)
                ? false
                : larger(this.motion.x, 0)
                ? this.isRightSolid()
                : this.isLeftSolid()

            const isYSolid = equal(this.motion.y, 0)
                ? false
                : larger(this.motion.y, 0)
                ? this.isTopSolid()
                : this.isBottomSolid()

            if (isXSolid) this.motion.x = fraction(0)
            else if (unequal(this.motion.x, 0))
                this.x = add(
                    this.x,
                    chain(this.motion.x)
                        .sign()
                        .multiply(0.001)
                        .done() as Fraction
                )

            if (isYSolid) this.motion.y = fraction(0)
            else if (unequal(this.motion.y, 0))
                this.y = add(
                    this.y,
                    chain(this.motion.y)
                        .sign()
                        .multiply(0.001)
                        .done() as Fraction
                )

            if (equal(this.motion.x, 0) && equal(this.motion.y, 0)) return
            ;({ x: this.x, y: this.y } = this.nextBlockEdge())
        }

        this.x = equal(this.motion.x, 0)
            ? this.x
            : add(originalX, originalMotion.x)
        this.y = equal(this.motion.y, 0)
            ? this.y
            : add(originalY, originalMotion.y)
    }

    /**
     * Gets the farthest point the player would move to,
     * that is still within the same block, according to their motion
     *
     * @returns The X and Y values of that point
     */
    nextBlockEdge(): { x: Fraction; y: Fraction } {
        const { x: nextX, y: nextY } = this.farthestInSameBlock()

        if (nextX === null && nextY === null) return { x: this.x, y: this.y }

        if (nextX === null && nextY !== null) return { x: this.x, y: nextY }

        if (nextY === null && nextX !== null) return { x: nextX, y: this.y }

        if (nextX !== null && nextY !== null) {
            const xyRatio = chain(this.motion.x)
                .divide(this.motion.y)
                .abs()
                .done() as Fraction
            const distanceX = subtract(nextX, this.x)
            const distanceY = subtract(nextY, this.y)

            return abs(distanceX) <
                chain(distanceY).abs().multiply(xyRatio).done()
                ? {
                      x: nextX,
                      y: add(this.y, divide(distanceX, xyRatio) as Fraction),
                  }
                : {
                      x: add(this.x, multiply(distanceY, xyRatio) as Fraction),
                      y: nextY,
                  }
        }

        throw 'Unreachable code'
    }

    /**
     * Gets the X value of the right part of the player
     * @returns The X value of that part
     */
    right(): Fraction {
        return chain(this.x)
            .add(fraction(Player.WIDTH / 2))
            .subtract(fraction(0.001))
            .done()
    }

    /**
     * Gets the farthest X value to the player's right
     * that is within the same block as the player
     * @returns The X value of the right block edge
     */
    rightBlockEdge(): Fraction {
        return chain(this.right()).floor().add(fraction(0.999)).done()
    }

    /**
     * Runs every tick
     */
    tick(): void {
        if (this.world.ticks % 3 === 0)
            this.motion.y = chain(this.motion.y)
                .subtract(fraction(World.GRAVITY))
                .multiply(0.98)
                .done() as Fraction

        this.motion.x =
            keyboard.has('KeyA') && !keyboard.has('KeyD')
                ? unaryMinus(fraction(Player.SPEED))
                : !keyboard.has('KeyA') && keyboard.has('KeyD')
                ? fraction(Player.SPEED)
                : fraction(0)

        if (keyboard.has('KeyW') && this.isBottomSolid())
            this.motion.y = fraction(Player.JUMP_SPEED)

        this.move()
    }

    /**
     * Gets the Y value of the top part of the player
     * @returns The Y value of that part
     */
    top(): Fraction {
        return chain(this.y)
            .add(fraction(Player.HEIGHT))
            .subtract(fraction(0.001))
            .done()
    }

    /**
     * Gets the farthest Y value to the player's top
     * that is within the same block as the player
     * @returns The Y value of the top block edge
     */
    topBlockEdge(): Fraction {
        return chain(this.top()).floor().add(fraction(0.999)).done()
    }

    /**
     * Updates the player's display
     */
    update(): void {
        this.sprite.x = number(this.x) * Block.SIZE
        this.sprite.y = (World.HEIGHT - number(this.y)) * Block.SIZE
    }
}
