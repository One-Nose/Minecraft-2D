import { BlockRegistry, blockRegistry } from "blockRegistry"
import { Sprite } from "pixi.js"
import Row from "./row"

/**
 * Represents a block
 */
export default class Block {
    /** The block registry */
    block: BlockRegistry

    /** `true` if the block's sprite is loaded */
    loaded: boolean

    /** The block's row */
    row: Row

    /** The block's sprite */
    sprite?: Sprite

    /**
     * @param row The block's row
     * @param id The block's ID
     */
    constructor(row: Row, id: string) {
        this.block = blockRegistry[id]
        this.loaded = false
        this.row = row
    }

    /**
     * Loads the block's sprite if not loaded
     */
    load(): void {
        if (!this.loaded && this.block.visible) {
            this.sprite = new Sprite(this.block.texture)
            this.row.chunk.container.addChild(this.sprite)
            this.loaded = true
        }
    }

    /**
     * Changes the block to a new one, if not loaded
     * @param id The new block's ID
     */
    setBlock(id: string): void {
        if (!this.loaded) {
            this.block = blockRegistry[id]
        }
    }
}
