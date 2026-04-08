import { Application, Renderer } from 'pixi.js'
import World from '~/world/world'

let world: World | null = null

/**
 * Sets the current world
 * @param chosenWorld The world to set to
 */
export function setWorld(chosenWorld: World): void {
    world = chosenWorld
}

const canvas = document.getElementById('game') as HTMLCanvasElement

/** The main graphics application */
export const app: Application<Renderer<HTMLCanvasElement>> = new Application()

export async function initApp(): Promise<void> {
    await app.init({
        backgroundColor: 0x78a7ff,
        resizeTo: canvas,
        canvas: canvas,
    })

    addEventListener('resize', () => {
        setTimeout(() => {
            app.stage.x = app.screen.width / 2
            app.stage.y = app.screen.height * 0.7
        })
    })
    dispatchEvent(new Event('resize'))

    app.ticker.add(() => {
        if (world !== null) world.tick()
    })
}

/** Contains the key codes of all the currently pressed keys */
export const keyboard: Set<string> = new Set()
addEventListener('keydown', (event) => {
    keyboard.add(event.code)
})
addEventListener('keyup', (event) => {
    keyboard.delete(event.code)
})
