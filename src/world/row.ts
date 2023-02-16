import Block from './block'
import Chunk from './chunk'

/**
 * Represents a single row of 16 blocks
 */
export default class Row {
    /** The length of a row in blocks */
    static LENGTH = 16

    /** The width of a row in pixels */
    static WIDTH = Row.LENGTH * Block.SIZE

    /** An array of blocks */
    blocks: Block[]

    /** The row's chunk */
    chunk: Chunk

    /** `true` if the row is loaded */
    loaded: boolean

    /** The row's index within the chunk */
    y: number

    /**
     * @param chunk The row's chunk
     */
    constructor(chunk: Chunk, y: number) {
        this.chunk = chunk
        this.loaded = false
        this.y = y

        this.blocks = Array.from(Array(Row.LENGTH), (_, index) => new Block(this, index, 'air'))
    }

    /**
     * Generates the blocks in the row if not loaded
     */
    load(): void {
        if (!this.loaded) {
            for (const block of this.blocks) {
                block.setBlock(this.chunk.world.prng.randBool() ? 'air' : 'stone')
                block.load()
            }
            this.loaded = true
        }
    }
}
