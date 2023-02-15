import { Assets, Texture } from 'pixi.js';
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
export async function loadBundle(bundle: string): Promise<void> {
    textures[bundle] = await Assets.loadBundle(bundle)
}

export const textures: {
    [bundle: string]: Bundle
} = {}
