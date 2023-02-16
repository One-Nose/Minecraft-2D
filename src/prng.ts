interface PRNGObject {
    /** The branch's type */
    type: string

    [key: string]: any
}

interface PRNGRequest {
    /** The request type */
    request: string

    [key: string]: any
}

/**
 * A pseudo-random number generator for genrating pseudorandom numbers
 */
export default class PRNG {
    /** The amount of unique hashes */
    static HASHES = 2 ** 53

    /** The amount of unique seeds */
    static SEEDS = 2 ** 32

    /** The object that defines the branch */
    object: object

    /** The PRNG's parent */
    parent?: PRNG

    /** Signed seed */
    seed: number

    /**
     * @param parent The PRNG parent of this PRNG
     * @param object The object that defines the PRNG
     */
    constructor(parent?: PRNG, object: object = {}) {
        this.object = object
        this.parent = parent
        this.seed = Math.floor(Math.random() * PRNG.SEEDS)
    }

    /**
     * Creates a new child of this PRNG
     * @param object The object that defines the child
     * @returns The newly created PRNG
     */
    child(object: PRNGObject): PRNG {
        return new PRNG(this, object)
    }

    /**
     * Hashes an object using the seed into a pseudorandom number
     * @param hash The object to hash
     * @returns The resulting pseudorandom number
     */
    hash(hash: object): number {
        const string = JSON.stringify(hash)

        let hash1 = 0xDEADBEEF ^ this.seed
        let hash2 = 0x41C6CE57 ^ this.seed

        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i)
            hash1 = Math.imul(hash1 ^ char, 2654435761)
            hash2 = Math.imul(hash2 ^ char, 1597334677)
        }

        hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507)
              ^ Math.imul(hash2 ^ (hash2 >>> 13), 3266489909)

        hash2 = Math.imul(hash2 ^ (hash2 >>> 16), 2246822507)
              ^ Math.imul(hash1 ^ (hash1 >>> 13), 3266489909)

        return 4294967296 * (2097151 & hash2) + (hash1 >>> 0)
    }

    /**
     * Generates a pseudorandom boolean
     * @param request The request object
     * @returns A pseudorandom boolean
     */
    getBool(request: PRNGRequest): boolean {
        return this.getNumber(request) < 0.5
    }

    /**
     * Generates a pseudorandom integer in the specified range
     * @param request The request object
     * @param min Smallest possible integer
     * @param max Largest possible integer
     * @returns A pseudorandom integer between `min` and `max`
     */
    getInt(request: PRNGRequest, min: number, max: number): number {
        return this.getNumber(request) * (max - min + 1) + min
    }

    /**
     * Generates a pseudorandom number between 0 and 1
     * @param request The request object
     * @returns A random number between 0 and 1 (not including 1)
     */
    getNumber(request: PRNGRequest): number {
        const object = {...this.object, $: request}
        let number
        if (this.parent !== undefined) {
            number = this.parent.hash(object)
        } else {
            number = this.hash(object)
        }
        return number / PRNG.HASHES
    }
}