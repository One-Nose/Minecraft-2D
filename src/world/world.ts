import { Application } from 'pixi.js'
import PRNG from 'prng'
import Chunk from './chunk'

/**
 * Represents a single world 
 */
export default class World {
    /** The application in which to display the world */
    app: Application

    /** Array of 16 chunks */
    chunks: Chunk[]

    /** `true` if the world is loaded */
    loaded: boolean

    /** The world's pseudo-random number generator */
    prng: PRNG

    /**
     * @param app The application in which to display the world
     */
    constructor(app: Application) {
        this.app = app
        this.chunks = Array.from(Array(16), () => new Chunk(this))
        this.loaded = false
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