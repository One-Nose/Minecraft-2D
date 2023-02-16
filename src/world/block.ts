import { BlockRegistry, blockRegistry } from "blockRegistry"
import { Sprite, Texture } from "pixi.js"
import Chunk from "./chunk"
import Row from "./row"

/**
 * Represents a block
 */
export default class Block {
    /** The length of the edge of a block in pixels */
    static SIZE = 64

    /** The block registry */
    block: BlockRegistry

    /** The block's location within the row */
    column: number

    /** `true` if the block is shadowed */
    isDark: boolean

    /** `true` if the block's sprite is loaded */
    isLoaded: boolean

    /** The block's row */
    row: Row

    /** The block's sprite */
    sprite: Sprite

    /**
     * @param row The block's row
     * @param column The block's location within the row
     * @param id The block's ID
     */
    constructor(row: Row, column: number, id: string) {
        this.block = blockRegistry[id]
        this.column = column
        this.isDark = false
        this.isLoaded = false
        this.row = row

        this.sprite = new Sprite()
        this.sprite.x = column * Block.SIZE
        this.sprite.y = (Chunk.HEIGHT - row.y - 1) * Block.SIZE
    }

    /**
     * Loads the block's sprite if not loaded
     */
    load(): void {
        if (!this.isLoaded) {
            if (this.block.isVisible) {
                this.row.chunk.container.addChild(this.sprite)
            }
            this.isLoaded = true
        }
    }

    /**
     * Updates the block's sprite
     */
    update(): void {
        if (this.block.isVisible) {
            this.sprite.visible = true
            this.sprite.texture = this.block.texture
            this.sprite.tint = this.isDark ? 0xBBBBBB : 0xFFFFFF
        } else {
            this.sprite.texture = Texture.EMPTY
            this.sprite.visible = false
        }
    }

    /**
     * Changes the block to a new one
     * @param id The new block's ID
     */
    setBlock(id: string): void {
        this.block = blockRegistry[id]
    }
}
