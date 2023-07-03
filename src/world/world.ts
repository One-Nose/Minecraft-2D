import Player from 'player'
import PRNG from 'prng'
import Block from './block'
import Chunk from './chunk'
import Row from './row'
import { Container } from 'pixi.js'
import { app } from 'graphics/app'
import { Fraction, number } from 'mathjs'

/**
 * Represents a single world
 */
export default class World {
    /** The width of a world in chunks */
    static CHUNKS = 16

    /** The gravity acceleration in (blocks / 3 ticks) */
    static GRAVITY = 0.08

    /** The height of a world in blocks */
    static HEIGHT = 64

    /** The width of a world in blocks */
    static WIDTH = this.CHUNKS * Row.LENGTH

    /** Array of chunks */
    chunks: Chunk[]

    /** Contains everything behind the player */
    backContainer: Container

    /** Contains everything that is in front of the player */
    foreContainer: Container

    /** `true` if the world is loaded */
    isLoaded: boolean

    /** The main player of the world */
    player: Player

    /** Contains the player */
    playerContainer: Container

    /** The world's pseudo-random number generator */
    prng: PRNG

    /** The amount of ticks since the ticker started */
    ticks: number

    /**
     * @param app The application in which to display the world
     */
    constructor() {
        this.isLoaded = false
        this.prng = new PRNG()
        this.ticks = 0

        this.backContainer = new Container()
        this.playerContainer = new Container()
        this.foreContainer = new Container()

        app.stage.addChild(this.backContainer)
        app.stage.addChild(this.playerContainer)
        app.stage.addChild(this.foreContainer)

        this.chunks = Array.from(
            Array(World.CHUNKS),
            (_, index) => new Chunk(this, index)
        )
        this.player = new Player(this, World.WIDTH / 2 + 0.5, World.HEIGHT)
    }

    /**
     * Locates a block by its coordinates
     * @param x The block's X position
     * @param y The block's Y position
     * @returns The block
     */
    getBlock(x: number | Fraction, y: number | Fraction): Block | undefined {
        return this.chunks[Math.floor(number(x) / Row.LENGTH)]?.rows[
            Math.floor(number(y))
        ]?.blocks[Math.floor(number(x) % Row.LENGTH)]
    }

    /**
     * Loads the unloaded chunks in the world
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
        this.ticks++
    }

    /**
     * Updates the rendering of the world
     */
    update(): void {
        this.player.update()
        app.stage.pivot.x = this.player.sprite.x
        app.stage.pivot.y = this.player.sprite.y
        for (const chunk of this.chunks) {
            chunk.update()
        }
    }
}
