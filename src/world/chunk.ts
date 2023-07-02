import { Container } from 'pixi.js'
import Row from './row'
import World from './world'
import PRNG from 'prng'
import { app } from 'graphics/app'
import Block from './block'

/**
 * Represents a single chunk consisting of 16x64 blocks
 */
export default class Chunk {
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
        this.container.x = this.x * Row.WIDTH
        world.container.addChild(this.container)

        this.rows = Array.from(
            Array(World.HEIGHT),
            (_, index) => new Row(this, index)
        )
    }

    /**
     * Generates the blocks in the chunk if it's not loaded
     */
    load(): void {
        if (!this.isLoaded) {
            for (const row of this.rows) {
                row.load()
            }
            for (const x in this.heights) {
                if (
                    this.prng.getBool(
                        {
                            request: 'load_grass',
                            x: x,
                        },
                        this.heights[x] / (World.HEIGHT - 1)
                    )
                ) {
                    this.rows[this.heights[x]].blocks[x].setBlock('grass_block')
                }
            }
            this.isLoaded = true
        }
    }

    /**
     * Updates the rendering of the chunk
     */
    update(): void {
        const thisX = this.container.x
        const worldX = this.world.container.pivot.x - app.screen.width / 2
        if (
            worldX - Row.LENGTH * Block.SIZE <= thisX &&
            thisX <= worldX + app.screen.width
        ) {
            this.container.visible = true
            for (const row of this.rows) {
                row.update()
            }
        } else {
            this.container.visible = false
        }
    }
}
