import Scene from "../Scene";
import Tilemap from "../../Nodes/Tilemap";
import ResourceManager from "../../ResourceManager/ResourceManager";
import OrthogonalTilemap from "../../Nodes/Tilemaps/OrthogonalTilemap";
import Layer from "../Layer";
import Tileset from "../../DataTypes/Tilesets/Tileset";
import Vec2 from "../../DataTypes/Vec2";
import { TiledCollectionTile } from "../../DataTypes/Tilesets/TiledData";
import AnimatedSprite from "../../Nodes/Sprites/AnimatedSprite";
import IsometricTilemap from "../../Nodes/Tilemaps/IsometricTilemap";
import StaggeredIsometricTilemap from "../../Nodes/Tilemaps/StaggeredIsometricTilemap";

// @ignorePage
export enum TilemapOrientation {
    ORTHOGONAL = "orthogonal",
    ISOMETRIC = "isometric",
    STAGGERED_ISOMETRIC = "staggered"
}


/**
 * A factory that abstracts adding @reference[Tilemap]s to the @reference[Scene].
 * Access methods in this factory through Scene.add.[methodName]().
 */
export default class TilemapFactory {
    private scene: Scene;
    private tilemaps: Array<Tilemap>;
    private resourceManager: ResourceManager;
    
    init(scene: Scene, tilemaps: Array<Tilemap>): void {
        this.scene = scene;
        this.tilemaps = tilemaps;
        this.resourceManager = ResourceManager.getInstance();
    }

    // TODO - This is specifically catered to Tiled tilemaps right now. In the future,
    // it would be good to have a "parseTilemap" function that would convert the tilemap
    // data into a standard format. This could allow for support from other programs
    // or the development of an internal level builder tool
    /**
     * Adds a tilemap to the scene
     * @param key The key of the loaded tilemap to load
     * @param constr The constructor of the desired tilemap
     * @param args Additional arguments to send to the tilemap constructor
     * @returns An array of Layers, each of which contains a layer of the tilemap as its own Tilemap instance.
     */
	add = (key: string, scale: Vec2 = new Vec2(1, 1)): Array<Layer> => {
        // Get Tilemap Data
        let tilemapData = this.resourceManager.getTilemap(key);

        // Set the constructor for this tilemap to either be orthographic or isometric
        let constr: new(...args: any) => Tilemap;

        switch(tilemapData.orientation) {
            case TilemapOrientation.ORTHOGONAL: {
                constr = OrthogonalTilemap;
                break;
            }
            case TilemapOrientation.ISOMETRIC: {
                constr = IsometricTilemap;
                break;
            }
            case TilemapOrientation.STAGGERED_ISOMETRIC: {
                constr = StaggeredIsometricTilemap;
                break;
            }
            default: {
                throw new Error(`Unknown Tilemap Orientation "${tilemapData.orientation}"`);
            }
        }

        // Initialize the return value array
        let sceneLayers = new Array<Layer>();

        // Create all of the tilesets for this tilemap
        let tilesets = new Array<Tileset>();

        let collectionTiles = new Array<TiledCollectionTile>();

        for(let tileset of tilemapData.tilesets) {
            if(tileset.image) {
                // If this is a standard tileset and not a collection, create a tileset for it.
                // TODO - We are ignoring collection tilesets for now. This is likely not a great idea in practice,
                // as theoretically someone could want to use one for a standard tilemap. We are assuming for now
                // that we only want to use them for object layers
                tilesets.push(new Tileset(tileset));
            } else {
                tileset.tiles.forEach(tile => tile.id += tileset.firstgid);
                collectionTiles.push(...tileset.tiles);
            }
        }

        // Loop over the layers of the tilemap and create tiledlayers or object layers
        for(let layer of tilemapData.layers) {

            let sceneLayer;
            let isParallaxLayer = false;
            let depth = 0;
            
            if(layer.properties) {
                for(let prop of layer.properties){
                    if(prop.name === "Parallax") {
                        isParallaxLayer = prop.value;
                    } else if(prop.name === "Depth") {
                        depth = prop.value;
                    }
                }
            }

            if(isParallaxLayer) {
                sceneLayer = this.scene.addParallaxLayer(layer.name, new Vec2(1, 1), depth);
            } else {
                sceneLayer = this.scene.addLayer(layer.name, depth);
            }
            
            if(layer.type === "tilelayer") {
                // Create a new tilemap object for the layer
                let tilemap = new constr(tilemapData, layer, tilesets, scale);
                tilemap.id = this.scene.generateId();
                tilemap.setScene(this.scene);
    
                // Add tilemap to scene
                this.tilemaps.push(tilemap);
    
                sceneLayer.addNode(tilemap);

            } else {

                // Layer is an object layer, so add each object as a sprite to a new layer
                for(let obj of layer.objects) {

                    // Check if obj is a tile from a tileset
                    for(let tileset of tilesets) {
                        if(tileset.hasTile(obj.gid)) {

                            // everything added has an animation! even if it's just one frame repeated
                            let tile = this.scene.add.animatedSprite(AnimatedSprite, "tile_animations", "tiles");

                            // position, sizing, scale
                            let size = tileset.getTileSize().clone();
                            tile.position.set((obj.x + size.x/2)*scale.x, (obj.y - size.y/2)*scale.y +32*6);
                                // 40x40 tiles, 40x28 tilemap, so 6 tiles above and below for UI
                            tile.size.copy(size);
                            tile.scale.set(scale.x, scale.y);

                            // assuming that all animations are 8 frames long
                            let animation_num = Math.floor(obj.gid / 8);
                            switch(animation_num) {
                                case(0):
                                    tile.animation.play("SPACE", true);
                                    break;
                                case(1):
                                    tile.animation.play("SPACE_COMET", true);
                                    break;
                                case(2):
                                    tile.animation.play("DESERT_TUMBLE", true);
                                    break;
                                case(3):
                                    tile.animation.play("DIRT_SPROUT", true);
                                    break;
                                case(4):
                                    tile.animation.play("GRASS_FLOWER", true);                        
                                    break;
                                case(5):
                                    tile.animation.play("GRASS_HOUSE", true);
                                    break;
                                case(6):
                                    tile.animation.play("WATER_UP", true);                        
                                    break;
                                case(7):
                                    tile.animation.play("WATER_LEFT", true);
                                    break;
                                case(8):
                                    tile.animation.play("WATER_DOWN", true);
                                    break;
                                case(9):
                                    tile.animation.play("WATER_RIGHT", true);     
                                break;
                                case(10):
                                    tile.animation.play("MUD_WAVE", true);
                                break;
                                case(11):
                                    tile.animation.play("FIRE_WAVE", true);
                                    break;
                                case(12):
                                    if (obj.gid == 96) {
                                        tile.animation.play("ROCK", true);
                                    }
                                    else {
                                        tile.animation.play("DISEASE", true);
                                    }
                                    break;
                                default:
                                    tile.animation.play("SPACE", true);
                            }
                        }
                    }

                }
            }

            // Update the return value
            sceneLayers.push(sceneLayer);
        }

        return sceneLayers;
	}
}