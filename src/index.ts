import { Application } from 'pixi.js'


const canvas = document.getElementById('game') as HTMLCanvasElement

const app = new Application({
    resizeTo: canvas,
    view: canvas,
})
