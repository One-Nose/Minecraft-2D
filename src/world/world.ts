import Player from 'player'
import PRNG from 'prng'
import Chunk from './chunk'
import Row from './row'

/**
 * Represents a single world 
 */
export default class World {
    /** The width of a world in chunks */
    static CHUNKS = 16

    /** The width of a world in blocks */
    static WIDTH = this.CHUNKS * Row.WIDTH

    /** Array of chunks */
    chunks: Chunk[]

    /** `true` if the world is loaded */
    loaded: boolean

    /** The main player of the world */
    player: Player

    /** The world's pseudo-random number generator */
    prng: PRNG

    /**
     * @param app The application in which to display the world
     */
    constructor() {
        this.chunks = Array.from(Array(World.CHUNKS), (_, index) => new Chunk(this, index))
        this.loaded = false
        this.player = new Player(World.WIDTH / 2, 64)
        this.prng = new PRNG()
    }

    /**
     * Generates the unloaded chunks in the world 
     */
    load(): void {
        for (const chunk of this.chunks) {
            chunk.load()
        }    
        this.loaded = true
    }    
}
