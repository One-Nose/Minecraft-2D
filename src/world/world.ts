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
    static WIDTH = this.CHUNKS * Row.LENGTH

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
        this.loaded = false
        this.player = new Player(World.WIDTH / 2 + 0.5, Chunk.HEIGHT - 1)
        this.prng = new PRNG()

        this.chunks = Array.from(Array(World.CHUNKS), (_, index) => new Chunk(this, index))

        addEventListener('resize', () => {
            setTimeout(() => {
                for (const chunk of this.chunks) {
                    chunk.fix()
                }
            })
        })
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

    /**
     * Updates the rendering of the world
     */
    update(): void {
        for (const chunk of this.chunks) {
            chunk.update()
        }
    }
}
