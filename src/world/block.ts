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
    x: number

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
     * @param x The block's location within the row
     * @param id The block's ID
     */
    constructor(row: Row, x: number, id: string) {
        this.block = blockRegistry[id]
        this.x = x
        this.isDark = false
        this.isLoaded = false
        this.row = row

        this.sprite = new Sprite()
        this.sprite.x = x * Block.SIZE
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

            if (this.row.chunk.heights[this.x] === this.row.y) {
                this.isDark = false
            } else {
                this.isDark = true
            }
            this.sprite.tint = this.isDark ? 0x888888 : 0xFFFFFF
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

        if (this.block.isVisible) {
            if (this.row.y > this.row.chunk.heights[this.x]) {
                this.row.chunk.heights[this.x] = this.row.y
            }
        }
    }
}
