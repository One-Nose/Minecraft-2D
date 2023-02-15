/**
 * Represents a block
 */
class Block {
    id: string

    constructor(id: string) {
        this.id = id
    }
}

/**
 * Represents a single chunk consisting of 16x64 blocks
 */
class Chunk {
    /** Array of 64 rows of blocks, from bottom to top */
    blocks: Row[]

    /** Array of heights of the highest block in each y-level */
    heights: number[]

    /** `true` if the chunk is loaded */
    loaded: boolean

    /** The chunk's pseudo-random number generator */
    prng: PRNG


    /**
     * @param prng The chunk's pseudo-random number generator
     */
    constructor(prng: PRNG) {
        this.prng = prng

        this.blocks = Array.from(Array(64), () => new Row(this.prng))
        this.heights = Array(16).fill(0)
        this.loaded = false
    }

    /**
     * Generates the blocks in the chunk if not loaded
     */
    load(): void {
        if (!this.loaded) {
            for (const row of this.blocks) {
                row.load()
            }
            this.loaded = true
        }
    }
}

/**
 * A pseudo-random number generator for genrating pseudorandom numbers
 */
class PRNG {
    /** Seed between `0` and `2 ** 48 - 1` */
    seed: bigint

    MULTIPLIER = 0x5DEECE66Dn
    INCREMENT = 11n
    MODULUS = BigInt(2 ** 48)
    MAX_INT = 2 ** 32

    constructor() {
        this.seed = BigInt(Math.floor(Math.random() * (Number(this.MODULUS) - 1)))
    }

    /**
     * Generates a new seed
     * @returns The final 32 bits of the generated seed
     */
    next(): number {
        this.seed = (this.MULTIPLIER * this.seed + this.INCREMENT) % this.MODULUS
        return Number(this.seed % BigInt(this.MAX_INT))
    }

    /**
     * Generates a new seed and returns a random boolean
     * @returns A random boolean
     */
    randBool(): boolean {
        return this.random() < 0.5
    }

    /**
     * Generates a new seed and returns a random integer
     * @param min Minimal number to generate
     * @param max Maximal number to generate
     * @returns A random number between `min` and `max`
     */
    randInt(min: number, max: number): number {
        return this.random() * (max - min + 1) + min
    }

    /**
     * Generates a new seed and returns a random number
     * @returns A random number between 0 and 1 (not including 1)
     */
    random(): number {
        return this.next() / this.MAX_INT
    }
}

/**
 * Represents a single row of 16 blocks
 */
class Row {
    /** An array of 16 blocks */
    blocks: Block[]

    /** `true` if the row is loaded */
    loaded: boolean
    
    /** The row's pseudo-random number generator */
    prng: PRNG

    /**
     * @param prng The row's pseudo-random number generator
     */
    constructor(prng: PRNG) {
        this.prng = prng

        this.blocks = Array.from(Array(16), () => new Block('air'))
        this.loaded = false
    }

    /**
     * Generates the blocks in the row if not loaded
     */
    load(): void {
        if (!this.loaded) {
            for (const block of this.blocks) {
                block.id = this.prng.randBool() ? 'air' : 'stone'
            }
            this.loaded = true
        }
    }
}

/**
 * Represents a single world 
 */
export default class World {
    /** Array of 16 chunks */
    chunks: Chunk[]

    /** `true` if the world is loaded */
    loaded: boolean

    /** The world's pseudo-random number generator */
    prng: PRNG

    constructor() {
        this.prng = new PRNG()

        this.chunks = Array.from(Array(16), () => new Chunk(this.prng))
        this.loaded = false
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
