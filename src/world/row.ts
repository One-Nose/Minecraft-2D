import Block from './block'
import Chunk from './chunk'

/**
 * Represents a single row of 16 blocks
 */
export default class Row {
    /** An array of 16 blocks */
    blocks: Block[]

    /** The row's chunk */
    chunk: Chunk

    /** `true` if the row is loaded */
    loaded: boolean

    /**
     * @param chunk The row's chunk
     */
    constructor(chunk: Chunk) {
        this.blocks = Array.from(Array(16), () => new Block('air'))
        this.chunk = chunk
        this.loaded = false
    }

    /**
     * Generates the blocks in the row if not loaded
     */
    load(): void {
        if (!this.loaded) {
            for (const block of this.blocks) {
                block.id = this.chunk.world.prng.randBool() ? 'air' : 'stone'
            }
            this.loaded = true
        }
    }
}
