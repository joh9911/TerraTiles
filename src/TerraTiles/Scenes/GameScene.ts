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
    private _waterTiles: Vec2[] = [];
    private _roundDelay: number;
    private _roundTimer: number;



    spreadWater(){
        let newWaterTiles: Vec2[] = [];

        for (let waterTile of this._waterTiles) {
            const directions = [
                { dx: 0, dy: -1 }, 
                { dx: 1, dy: 0 },  
                { dx: 0, dy: 1 },  
                { dx: -1, dy: 0 }  
            ];
        
            for (let {dx, dy} of directions) {
                let newPos = new Vec2(waterTile.x + dx, waterTile.y + dy);
                let colRow = this._tilemap.getColRowAt(newPos); 
                    let tileId = this._tilemap.getTileAtWorldPosition(colRow)
                    if (tileId === 1) {
                        let colRow = this._tilemap.getColRowAt(newPos); 
                        this._tilemap.setTileAtRowCol(colRow, 120);
                        newWaterTiles.push(newPos);
                    }
            }
        }
        
    }
    spreadFire() {
        let newFireTiles: Vec2[] = [];

        for (let fireTile of this._fireTiles) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 1 && j === 1) continue;
                    if (i == -1 && j == -1) continue;
                    if (i == 1 && j == -1) continue;
                    if (i == -1 && j == 1) continue;
                    let newPos = new Vec2(fireTile.x + 16*i, fireTile.y + 16*j);
                    
                    let colRow = this._tilemap.getColRowAt(newPos); 
                    let tileId = this._tilemap.getTileAtWorldPosition(colRow)
                    if (tileId === 1) {
                        let colRow = this._tilemap.getColRowAt(newPos); 
                        this._tilemap.setTileAtRowCol(colRow, 120);
                        newFireTiles.push(newPos);
                    }
                }
            }
        }

        this._fireTiles = this._fireTiles.concat(newFireTiles);
    }
    
    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
        this._roundTimer += deltaT;

    if (this._roundTimer >= this._roundDelay) {
        this._roundTimer = 0;
        this.spreadFire();
        this.spreadWater();
    }

        if(Input.isMouseJustPressed()){
			let position = Input.getGlobalMousePosition()

            let tileBelow = new Vec2(position.x, position.y); 
            let colRow = this.tilemap.getColRowAt(tileBelow); 

            let currnetBelow = this.tilemap.getTileAtWorldPosition(tileBelow)

            if (currnetBelow == 22) { 

                this.tilemap.setTileAtRowCol(colRow, 120);
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

    get waterTiles(): Vec2[]{
        return this._waterTiles
    }

    set waterTiles(tiles: Vec2[]){
        this._waterTiles = tiles;
    }

    get roundDelay(): number{
        return this._roundDelay;
    }
    set roundDelay(num: number){
        this._roundDelay = num;
    }

    get roundTimer(): number{
        return this._roundTimer;
    }
    set roundTimer(num: number) {
        this._roundTimer = num;
    }


}