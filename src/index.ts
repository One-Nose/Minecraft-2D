import app from 'graphics/app'
import { initAssets, loadBundle, textures } from 'graphics/assets'
import * as PIXI from 'pixi.js'
import World from 'world/world'
import { registerBlock } from 'blockRegistry'

declare global {
    var MC: any
}

(async () => {
    await initAssets()
    await loadBundle('blocks')

    registerBlock('air', { visible: false })
    registerBlock('stone')

    const world = new World()
    world.load()

    app.ticker.add(() => {
        world.update()
    })

    globalThis.MC = {
        app: app,
        textures: textures,
        PIXI: PIXI,
        world: world,
    }
})()
