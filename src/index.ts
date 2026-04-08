import * as PIXI from 'pixi.js'
import * as math from 'mathjs'
import { registerBlock } from '~/blockRegistry'
import { app, initApp, keyboard, setWorld } from '~/graphics/app'
import { initAssets, loadBundle, textures } from '~/graphics/assets'
import World from '~/world/world'
import Player from '~/player'
import Block from '~/world/block'

declare global {
    var MC: { [name: string]: object }
}

; (async () => {
    await initApp()
    await initAssets()
    await loadBundle('blocks', (textureSource) => {
        textureSource.resize(
            undefined,
            undefined,
            textureSource.width / Block.SIZE
        )
        textureSource.scaleMode = 'nearest'
    })
    await loadBundle('player', (textureSource) => {
        textureSource.resize(
            undefined,
            undefined,
            textureSource.width / (Player.WIDTH * Block.SIZE)
        )
    })

    registerBlock('air', { isSolid: false })
    registerBlock('grass_block')
    registerBlock('stone')

    const world = new World()
    world.load()
    setWorld(world)

    globalThis.MC = { app, textures, PIXI, world, keyboard, math }
})()
