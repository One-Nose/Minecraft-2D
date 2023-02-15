import Block from './block'
import World from './world'

/**
 * Represents a single row of 16 blocks
 */
export default class Row {
    /** An array of 16 blocks */
    blocks: Block[]

    /** `true` if the row is loaded */
    loaded: boolean
    
    /** The row's world */
    world: World

    /**
     * @param world The row's world
     */
    constructor(world: World) {
        this.blocks = Array.from(Array(16), () => new Block('air'))
        this.loaded = false
        this.world = world
    }

    /**
     * Generates the blocks in the row if not loaded
     */
    load(): void {
        if (!this.loaded) {
            for (const block of this.blocks) {
                block.id = this.world.prng.randBool() ? 'air' : 'stone'
            }
            this.loaded = true
        }
    }
}
