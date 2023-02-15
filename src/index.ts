import { Application } from 'pixi.js'

import World from './world'

const canvas = document.getElementById('game') as HTMLCanvasElement

const app = new Application({
    backgroundColor: 0x78A7FF,
    resizeTo: canvas,
    view: canvas,
})

const world = new World()
world.load()
console.log(world)
