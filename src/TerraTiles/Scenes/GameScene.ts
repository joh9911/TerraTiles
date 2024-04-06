import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Tile, DesertTile, FireTile, WaterTile } from "../Tiles/Tile";
import Tilemap from "../../Wolfie2D/Nodes/Tilemap";


export default class GameScene extends Scene {
    protected tilemap: OrthogonalTilemap;
    protected fireTiles: Vec2[] = [];
    protected waterTiles: Vec2[] = [];
    protected roundDelay: number;
    protected roundTimer: number;
    protected a:number;



    spreadWater(){
        let newWaterTiles: Vec2[] = [];

        for (let waterTile of this.waterTiles) {
            const directions = [
                { dx: 0, dy: -1 }, 
                { dx: 1, dy: 0 },  
                { dx: 0, dy: 1 },  
                { dx: -1, dy: 0 }  
            ];
        
            for (let {dx, dy} of directions) {
                let newPos = new Vec2(waterTile.x + dx, waterTile.y + dy);
                let colRow = this.tilemap.getColRowAt(newPos); 
                    let tileId = this.tilemap.getTileAtWorldPosition(colRow)
                    if (tileId === 1) {
                        let colRow = this.tilemap.getColRowAt(newPos); 
                        this.tilemap.setTileAtRowCol(colRow, 120);
                        newWaterTiles.push(newPos);
                    }
            }
        }
        
    }
    spreadFire() {
        let newFireTiles: Vec2[] = [];

        for (let fireTile of this.fireTiles) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 1 && j === 1) continue;
                    if (i == -1 && j == -1) continue;
                    if (i == 1 && j == -1) continue;
                    if (i == -1 && j == 1) continue;
                    let newPos = new Vec2(fireTile.x + 16*i, fireTile.y + 16*j);
                    
                    let colRow = this.tilemap.getColRowAt(newPos); 
                    let tileId = this.tilemap.getTileAtWorldPosition(colRow)
                    console.log(tileId , colRow);
                    if (tileId === 22) {
                        console.log("spread fire");
                        let colRow = this.tilemap.getColRowAt(newPos); 
                        this.tilemap.setTileAtRowCol(colRow, 120);
                        newFireTiles.push(newPos);
                    }
                }
            }
        }

        this.fireTiles = this.fireTiles.concat(newFireTiles);
    }
    
    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
        this.roundTimer += deltaT;

    if (this.roundTimer >= this.roundDelay) {
        this.roundTimer = 0;
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
}