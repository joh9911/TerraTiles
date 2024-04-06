import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Layers_enum } from "../Utils/Layers_enum";
import { Tile, DesertTile, FireTile, WaterTile } from "../Tiles/Tile";
import Tilemap from "../../Wolfie2D/Nodes/Tilemap";


export default class GameScene extends Scene {
    private _tilemap: OrthogonalTilemap;
    private _fireTiles: Vec2[] = [];
    private _fireTimer: Timer;
    private _tiles: Map<string, Tile>;

    addTile(tile: Tile): void {
        this._tiles.set(tile.position.toString(), tile);
    }

    removeTile(position: Vec2): void {
        this._tiles.delete(position.toString());
    }

    spreadFire() {
        let newFireTiles: Vec2[] = [];
        console.log("불번져~ 실행");

        for (let fireTile of this._fireTiles) {
            // Check the adjacent tiles
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 1 && j === 1) continue;
                    if (i == -1 && j == -1) continue;
                    if (i == 1 && j == -1) continue;
                    if (i == -1 && j == 1) continue;
                    let newPos = new Vec2(fireTile.x + 16*i, fireTile.y + 16*j);
                    
                    let colRow = this._tilemap.getColRowAt(newPos); 
                    let tileId = this._tilemap.getTileAtWorldPosition(colRow)
                    // If the adjacent tile is a ground tile, change it to a fire tile
                    if (tileId === 1) {
                        
                        let colRow = this._tilemap.getColRowAt(newPos); 
                        console.log("불번져~", `${tileId}, ${colRow}`);
                        this._tilemap.setTileAtRowCol(colRow, 120);
                        newFireTiles.push(newPos);
                    }
                }
            }
        }

        // Add the new fire tiles to the array for the next spread
        this._fireTiles = this._fireTiles.concat(newFireTiles);
        this._fireTimer.start();
    }
    
    updateScene(deltaT: number): void {
        super.updateScene(deltaT);

        for (let tile of this.tiles.values()) {
            tile.update(deltaT, this.tilemap);
        }
        if(Input.isMouseJustPressed()){
			let position = Input.getGlobalMousePosition()

            let tileBelow = new Vec2(position.x, position.y); 
            let colRow = this.tilemap.getColRowAt(tileBelow); 

            let currnetBelow = this.tilemap.getTileAtWorldPosition(tileBelow)

            console.log("tile index", `${position},  ${currnetBelow}`);

            if (currnetBelow == 1) { 
                this.tilemap.setTileAtRowCol(colRow, 22);
                
            }
            
		}
        

        
    }

    get tilemap(): OrthogonalTilemap {
        return this._tilemap;
    }

    set tilemap(map: OrthogonalTilemap) {
        this._tilemap = map;
    }

    get fireTiles(): Vec2[] {
        return this._fireTiles;
    }

    set fireTiles(tiles: Vec2[]) {
        this._fireTiles = tiles;
    }

    get fireTimer(): Timer{
        return this._fireTimer;
    }

    set fireTimer(timer: Timer) {
        this._fireTimer = timer;
    }

    get tiles(): Map<string, Tile> {
        return this._tiles;
    }

    set tiles(tiles: Map<string, Tile>) {
        this._tiles = tiles;
    }
}