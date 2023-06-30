import app from 'graphics/app'
import { initAssets, loadBundle, textures } from 'graphics/assets'
import * as PIXI from 'pixi.js'
import World from 'world/world'
import { registerBlock } from 'blockRegistry'
import { SCALE_MODES } from 'pixi.js'
import Block from 'world/block'
import Player from 'player'

declare global {
    var MC: { [name: string]: object }
}

;(async () => {
    await initAssets()
    await loadBundle('blocks', (texture) => {
        texture.baseTexture.setSize(Block.SIZE, Block.SIZE)
        texture.baseTexture.scaleMode = SCALE_MODES.NEAREST
    })
    await loadBundle('player', (texture) => {
        texture.baseTexture.setSize(
            Player.WIDTH * Block.SIZE,
            Player.HEIGHT * Block.SIZE
        )
    })

    registerBlock('air', { isSolid: false })
    registerBlock('grass_block')
    registerBlock('stone')

    const world = new World(app)
    world.load()

    app.ticker.add(() => {
        world.tick()
    })

    globalThis.MC = {
        app: app,
        textures: textures,
        PIXI: PIXI,
        world: world,
    }
})()
