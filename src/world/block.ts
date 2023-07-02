import { BlockRegistry, blockRegistry } from 'blockRegistry'
import { Container, Sprite, Texture } from 'pixi.js'
import Row from './row'
import World from './world'

/**
 * Represents a block
 */
export default class Block {
    /** The length of the edge of a block in pixels */
    static SIZE = 64

    /** The block's skew angle */
    static SKEW = Math.PI / 4

    /** The length of the shrinking effect on the top and side of the block */
    static SIZE_3D = Block.SIZE / 2

    /** The actaul length of the top and side of the block */
    static ACTUAL_SIZE_3D = Block.SIZE_3D * Math.cos(Block.SKEW)

    /** The block registry */
    block: BlockRegistry

    /** The block's front sprite */
    front: Sprite

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

        this.front = new Sprite()
        this.top = new Sprite()
        this.side = new Sprite()

        this.front.x = x * Block.SIZE
        this.front.y = (World.HEIGHT - row.y - 1) * Block.SIZE

        this.top.x = this.front.x
        this.top.y = this.front.y
        this.top.anchor.y = 1

        this.side.x = this.front.x + Block.SIZE
        this.side.y = this.front.y

        this.side.skew.y = -Block.SKEW
        this.top.skew.x = Block.SKEW - Math.PI / 2

        this.top.height = Block.SIZE_3D
        this.side.width = Block.SIZE_3D
    }

    /**
     * Loads the block's sprite if not loaded
     */
    load(): void {
        if (!this.isLoaded) {
            this.row.chunk.foreContainer.addChild(this.front)
            this.row.chunk.backContainer.addChild(this.top)
            this.row.chunk.backContainer.addChild(this.side)

            this.isLoaded = true
        }
    }

    /**
     * Updates the block's sprite
     */
    update(): void {
        if (this.block.isSolid) {
            if (this.row.chunk.heights[this.x] === this.row.y) {
                this.isDark = false
            } else {
                this.isDark = true
            }

            this.front.tint = 0xffffff
            this.top.tint = 0xbbbbbb
            this.side.tint = 0xcccccc

            if (this.isDark) {
                this.front.tint -= 0x444444
                this.top.tint -= 0x444444
                this.side.tint -= 0x444444
            }

            this.top.visible =
                !this.row.chunk.rows[this.row.y + 1]?.blocks[this.x]?.block
                    .isSolid
            this.side.visible = !this.row.blocks[this.x + 1]?.block.isSolid
        }
    }

    /**
     * Changes the block to a new one
     * @param id The new block's ID
     */
    setBlock(id: string): void {
        this.block = blockRegistry[id]

        if (this.block.isSolid) {
            this.front.visible = true
            this.top.visible = true
            this.side.visible = true

            this.front.texture = this.block.texture
            this.top.texture = this.block.texture
            this.side.texture = this.block.texture

            if (this.row.y > this.row.chunk.heights[this.x]) {
                this.row.chunk.heights[this.x] = this.row.y
            }
        } else {
            this.front.visible = false
            this.top.visible = false
            this.side.visible = false

            this.front.texture = Texture.EMPTY
            this.top.texture = Texture.EMPTY
            this.side.texture = Texture.EMPTY
        }
    }
}
