import { BlockRegistry, blockRegistry } from "blockRegistry"
import { Container, Sprite, Texture } from "pixi.js"
import Chunk from "./chunk"
import Row from "./row"
import World from "./world"

/**
 * Represents a block
 */
export default class Block {
    /** The length of the edge of a block in pixels */
    static SIZE = 64

    /** The block registry */
    block: BlockRegistry

    /** The block's front sprite */
    front: Sprite

    /** A container for the block's sprites */
    container: Container

    /** `true` if the block is shadowed */
    isDark: boolean
    
    /** `true` if the block's sprite is loaded */
    isLoaded: boolean
    
    /** The block's row */
    row: Row

    /** The block's right sprite */
    side: Sprite

    /** The block's top sprite */
    top: Sprite

    /** The block's location within the row */
    x: number

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

        this.container = new Container()
        this.container.x = x * Block.SIZE
        this.container.y = (World.HEIGHT - row.y - 1) * Block.SIZE

        this.front = new Sprite()
        this.container.addChild(this.front)

        this.top = new Sprite()
        this.side = new Sprite()

        this.top.anchor.y = 1
        this.side.x = Block.SIZE

        this.side.skew.y = -Math.PI / 4
        this.top.skew.x = -(Math.PI / 2 + this.side.skew.y)

        this.top.height = Block.SIZE / 2
        this.side.width = this.top.height

        this.container.addChild(this.top)
        this.container.addChild(this.side)
    }

    /**
     * Loads the block's sprite if not loaded
     */
    load(): void {
        if (!this.isLoaded) {
            if (this.block.isVisible) {
                this.row.chunk.container.addChild(this.container)
            }
            this.isLoaded = true
        }
    }

    /**
     * Updates the block's sprite
     */
    update(): void {
        if (this.block.isVisible) {
            if (this.row.chunk.heights[this.x] === this.row.y) {
                this.isDark = false
            } else {
                this.isDark = true
            }

            this.front.tint = 0xFFFFFF
            this.top.tint = 0xBBBBBB
            this.side.tint = 0xCCCCCC

            if (this.isDark) {
                this.front.tint -= 0x444444
                this.top.tint -= 0x444444
                this.side.tint -= 0x444444
            }

            this.top.visible = !this.row.chunk.rows[this.row.y + 1]?.blocks[this.x]?.block?.isVisible
            this.side.visible = !this.row.blocks[this.x + 1]?.block?.isVisible
        }
    }

    /**
     * Changes the block to a new one
     * @param id The new block's ID
     */
    setBlock(id: string): void {
        this.block = blockRegistry[id]

        if (this.block.isVisible) {
            this.container.visible = true

            this.front.texture = this.block.texture
            this.top.texture = this.block.texture
            this.side.texture = this.block.texture

            if (this.row.y > this.row.chunk.heights[this.x]) {
                this.row.chunk.heights[this.x] = this.row.y
            }
        } else {
            this.container.visible = false

            this.front.texture = Texture.EMPTY
            this.top.texture = Texture.EMPTY
            this.side.texture = Texture.EMPTY
        }
    }
}
