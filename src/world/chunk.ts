import { Container } from 'pixi.js'
import app from 'graphics/app'
import Row from './row'
import World from './world'
import Block from './block'
import PRNG from 'prng'

/**
 * Represents a single chunk consisting of 16x64 blocks
 */
export default class Chunk {
    /** The height of a chunk in blocks */
    static HEIGHT = 64

    /** Array of rows of blocks, from bottom to top */
    rows: Row[]

    /** The container of the chunk's graphics */
    container: Container

    /** Array of heights of the highest block in each y-level */
    heights: number[]

    /** `true` if the chunk is loaded */
    isLoaded: boolean

    /** The chunk's PRNG */
    prng: PRNG

    /** The chunk's world */
    world: World

    /** The index of the chunk within the world */
    x: number

    /**
     * @param world The chunk's world
     * @param x The index of the chunk within the world
     */
    constructor(world: World, x: number) {
        this.heights = Array(Row.LENGTH).fill(0)
        this.isLoaded = false
        this.world = world
        this.x = x

        this.prng = world.prng.child({
            type: 'chunk',
            x: x,
        })

        this.container = new Container()
        this.fix()
        app.stage.addChild(this.container)

        this.rows = Array.from(Array(Chunk.HEIGHT), (_, index) => new Row(this, index))
    }

    /**
     * Fixes the chunk's position according to the screen size
     */
    fix(): void {
        this.container.x = app.screen.width / 2 + this.x * Row.WIDTH
        this.container.y = app.screen.height * 2/3
    }

    /**
     * Generates the blocks in the chunk if not loaded
     */
    load(): void {
        if (!this.isLoaded) {
            for (const row of this.rows) {
                row.load()
            }
            this.isLoaded = true
        }
    }

    /**
     * Updates the location and visiblity of the chunk
     */
    update(): void {
        this.container.pivot.x = this.world.player.x * Block.SIZE
        this.container.pivot.y = (63 - this.world.player.y) * Block.SIZE

        const x = this.container.x - this.container.pivot.x
        if (-Row.WIDTH < x && x < app.screen.width) {
            this.container.visible = true
        } else {
            this.container.visible = false
        }
    }
}
