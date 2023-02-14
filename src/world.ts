/**
 * Represents a single world
 */
class World {
    chunks: Chunk[]
    rng: PRNG

    constructor() {
        this.chunks = Array.from(Array(16), () => new Chunk())
        this.rng = new PRNG()
    }
}


/**
 * Represents a single chunk consisting of 16x64 blocks
 */
class Chunk {
    loaded: boolean
    blocks: number[][]

    constructor() {
        this.loaded = false
        this.blocks = Array.from(Array(64), () => Array(16))
    }

    /**
     * Generates the blocks in the chunk
     */
    load() {
        for (const row of this.blocks)
            for (const x in row) {
                row[x] = 0
            }
    }
}

/**
 * A pseudo-random number generator for genrating pseudorandom numbers
 */
class PRNG {
    seed: number

    MULTIPLIER = 25214903917
    INCREMENT = 11
    MODULUS = 2 ** 48

    constructor() {
        this.seed = Math.floor(Math.random() * (this.MODULUS - 1))
    }

    /**
     * Generates a new seed
     * @returns The final 28 bits of the generated seed
     */
    next(): number {
        this.seed = (this.MULTIPLIER * this.seed + this.INCREMENT) % this.MODULUS
        return this.seed & (16**7 - 1)
    }

    /**
     * Generates a new seed and a random integer
     * @param min Minimal number to generate
     * @param max Maximal number to generate + 1
     * @returns A random number between `min` and `max + 1`
     */
    randInt(min: number, max: number): number {
        return (this.next() / 16**7) * (max - min) + min
    }
}
