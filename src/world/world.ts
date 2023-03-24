import { Application } from 'pixi.js'
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

    /** The world's application */
    app: Application<HTMLCanvasElement>

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
    constructor(app: Application<HTMLCanvasElement>) {
        this.app = app
        this.isLoaded = false
        this.prng = new PRNG()
        
        this.chunks = Array.from(Array(World.CHUNKS), (_, index) => new Chunk(this, index))
        this.player = new Player(this, World.WIDTH / 2 + 0.5, World.HEIGHT)
    }

    /**
     * Locates a block by its coordinates
     * @param x The block's X position
     * @param y The block's Y position
     * @returns The block
     */
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
     * Runs every tick
     */
    tick(): void {
        this.player.tick()
        this.update()
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
