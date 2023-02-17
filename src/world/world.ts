import app from 'graphics/app'
import Player from 'player'
import PRNG from 'prng'
import Block from './block'
import Chunk from './chunk'
import Row from './row'

/**
 * Represents a single world 
 */
export default class World {
    /** The width of a world in chunks */
    static CHUNKS = 16

    /** The height of a world in blocks */
    static HEIGHT = 64

    /** The width of a world in blocks */
    static WIDTH = this.CHUNKS * Row.LENGTH

    /** Array of chunks */
    chunks: Chunk[]

    /** `true` if the world is loaded */
    isLoaded: boolean

    /** The main player of the world */
    player: Player

    /** The world's pseudo-random number generator */
    prng: PRNG

    /**
     * @param app The application in which to display the world
     */
    constructor() {
        this.isLoaded = false
        this.prng = new PRNG()
        
        this.chunks = Array.from(Array(World.CHUNKS), (_, index) => new Chunk(this, index))
        this.player = new Player(this, World.WIDTH / 2 + 0.5, World.HEIGHT)

        this.fix()
        addEventListener('resize', () => {
            setTimeout(() => this.fix())
        })
    }

    /**
     * Fixes the world's location on the screen
     */
    fix(): void {
        app.stage.x = app.screen.width / 2
        app.stage.y = app.screen.height * 0.7
    }

    getBlock(x: number, y: number): Block | undefined {
        return this.chunks[Math.floor(x / Row.LENGTH)]
            ?.rows?.[Math.floor(y)]
            ?.blocks?.[Math.floor(x % Row.LENGTH)]
    }

    /**
     * Generates the unloaded chunks in the world 
     */
    load(): void {
        for (const chunk of this.chunks) {
            chunk.load()
        }    
        this.isLoaded = true
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
