import { Assets, Texture } from 'pixi.js';
import GrassBlock from 'assets/grass_block.png'
import Stone from 'assets/stone.png'

/**
 * Loads all assets asynchronously
 * @returns The blocks bundle
 */
export async function initAssets(): Promise<void> {
    await Assets.init({
        manifest: {
            bundles: [
                {
                    name: 'blocks',
                    assets: [
                        {
                            name: 'stone',
                            srcs: Stone,
                        },
                        {
                            name: 'grass_block',
                            srcs: GrassBlock,
                        },
                    ],
                },
            ],
        },
    })
}

interface Bundle {
    [asset: string]: Texture
}

/**
 * Loads a bundle into `textures`
 * @param bundle The name of the bundle
 */
export async function loadBundle(bundle: string, transform?: (texture: Texture) => void): Promise<void> {
    const loadedBundle: Bundle = await Assets.loadBundle(bundle)
    if (transform !== undefined) {
        for (const texture in loadedBundle) {
            transform(loadedBundle[texture])
        }
    }
    textures[bundle] = loadedBundle
}

export const textures: {
    [bundle: string]: Bundle
} = {}
