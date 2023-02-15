import { Application } from "pixi.js"

const canvas = document.getElementById('game') as HTMLCanvasElement

export default new Application({
    backgroundColor: 0x78A7FF,
    resizeTo: canvas,
    view: canvas,
})
