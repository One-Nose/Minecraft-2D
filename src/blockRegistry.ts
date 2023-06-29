import { textures } from 'graphics/assets'
import { Texture } from 'pixi.js'

export const blockRegistry: { [id: string]: BlockRegistry } = {}

interface BlockRegistryOptions {
    /**
     * Whether the block is visible
     * @default true
     */
    isSolid?: boolean
}

/**
 * Represents a block type
 */
export class BlockRegistry {
    /** The block's texture */
    texture: Texture

    /** Whether the block is solid and visible */
    isSolid: boolean

    /**
     * @param id The block's ID
     * @param options Optional attributes for the block
     */
    constructor(id: string, options: BlockRegistryOptions = {}) {
        this.isSolid = options.isSolid ?? true

        this.texture = this.isSolid ? textures.blocks[id] : Texture.EMPTY
    }
}

/**
 * @param id The block's ID
 * @param options Optional attributes for the block
 */
export function registerBlock(
    id: string,
    options: BlockRegistryOptions = {}
): void {
    blockRegistry[id] = new BlockRegistry(id, options)
}
