import { Application } from "pixi.js"

const canvas = document.getElementById('game') as HTMLCanvasElement

const app: Application<HTMLCanvasElement> = new Application({
    backgroundColor: 0x78A7FF,
    resizeTo: canvas,
    view: canvas,
})

addEventListener('resize', () => {
    setTimeout(() => {
        app.stage.x = app.screen.width / 2
        app.stage.y = app.screen.height * 0.7
    })
})
dispatchEvent(new Event('resize'))

export default app
