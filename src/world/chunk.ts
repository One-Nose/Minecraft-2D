import { Container } from 'pixi.js'
import Row from './row'
import World from './world'

/**
 * Represents a single chunk consisting of 16x64 blocks
 */
export default class Chunk {
    /** Array of 64 rows of blocks, from bottom to top */
    blocks: Row[]

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
        this.blocks = Array.from(Array(64), () => new Row(world))
        this.heights = Array(16).fill(0)
        this.loaded = false
        this.world = world
        
        this.container = new Container()
        this.container.visible = false
        world.app.stage.addChild(this.container)
    }

    /**
     * Generates the blocks in the chunk if not loaded
     */
    load(): void {
        if (!this.loaded) {
            for (const row of this.blocks) {
                row.load()
            }
            this.loaded = true
        }
    }
}
