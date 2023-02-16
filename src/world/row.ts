import PRNG from 'prng'
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
    isLoaded: boolean

    /** The row's PRNG */
    prng: PRNG

    /** The row's index within the chunk */
    y: number

    /**
     * @param chunk The row's chunk
     */
    constructor(chunk: Chunk, y: number) {
        this.chunk = chunk
        this.isLoaded = false
        this.y = y

        this.prng = chunk.prng.child({
            type: 'row',
            y: y,
        })

        this.blocks = Array.from(Array(Row.LENGTH), (_, index) => new Block(this, index, 'air'))
    }

    /**
     * Generates the blocks in the row if not loaded
     */
    load(): void {
        if (!this.isLoaded) {
            for (const block of this.blocks) {
                block.setBlock(this.prng.getBool({
                    request: 'loadBlock',
                    block: block.x,
                }) ? 'air' : 'stone')
                block.load()
            }
            this.isLoaded = true
        }
    }

    /**
     * Updates the rendering of the row
     */
    update(): void {
        for (const block of this.blocks) {
            block.update()
        }
    }
}
