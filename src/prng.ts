/**
 * A pseudo-random number generator for genrating pseudorandom numbers
 */
export default class PRNG {
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
