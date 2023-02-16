import { textures } from "graphics/assets"
import { Texture } from "pixi.js"

export const blockRegistry: {[id: string]: BlockRegistry} = {}

interface BlockRegistryOptions {
    /**
     * Whether the block is visible
     * @default true
     */
    isVisible?: boolean
}

/**
 * Represents a block type
 */
export class BlockRegistry {
    /** The block's texture */
    texture: Texture

    /** Whether the block is visible */
    isVisible: boolean

    /**
     * @param id The block's ID
     * @param options Optional attributes for the block
     */
    constructor(id: string, options: BlockRegistryOptions = {}) {
        this.isVisible = options.isVisible ?? true

        this.texture = this.isVisible ? textures.blocks[id] : Texture.EMPTY
    }
}

/**
 * @param id The block's ID
 * @param options Optional attributes for the block
 */
export function registerBlock(id: string, options: BlockRegistryOptions = {}): void {
    blockRegistry[id] = new BlockRegistry(id, options)
}
