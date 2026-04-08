import { Assets, Texture, TextureSource } from 'pixi.js'
import GrassBlock from '~/assets/grass_block.png'
import Steve from '~/assets/steve.png'
import Stone from '~/assets/stone.png'

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
                        { alias: 'stone', src: Stone },
                        { alias: 'grass_block', src: GrassBlock },
                    ],
                },
                { name: 'player', assets: [{ alias: 'steve', src: Steve }] },
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
 * @param transform Function to apply to the texture
 */
export async function loadBundle(
    bundle: string,
    transform?: (textureSource: TextureSource) => void
): Promise<void> {
    const loadedBundle: Bundle = await Assets.loadBundle(bundle)
    if (transform !== undefined) {
        for (const texture in loadedBundle) {
            transform(loadedBundle[texture].source)
            loadedBundle[texture].source.update()
        }
    }
    textures[bundle] = loadedBundle
}

/** Contains all asset bundles */
export const textures: { [bundle: string]: Bundle } = {}
