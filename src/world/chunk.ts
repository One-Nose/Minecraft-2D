import { Container } from 'pixi.js'
import app from 'graphics/app'
import Row from './row'
import World from './world'
import Block from './block'

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
    loaded: boolean

    /** The chunk's world */
    world: World

    /**
     * @param world The chunk's world
     */
    constructor(world: World) {
        this.heights = Array(Row.WIDTH).fill(0)
        this.loaded = false
        this.world = world

        this.container = new Container()
        this.container.pivot.x = (Block.SIZE * Row.WIDTH) / 2
        this.container.pivot.y = (Block.SIZE * Chunk.HEIGHT) / 2
        // this.container.visible = false
        app.stage.addChild(this.container)

        this.rows = Array.from(Array(Chunk.HEIGHT), (_, index) => new Row(this, index))
    }

    /**
     * Generates the blocks in the chunk if not loaded
     */
    load(): void {
        if (!this.loaded) {
            for (const row of this.rows) {
                row.load()
            }
            this.loaded = true
        }
    }
}
