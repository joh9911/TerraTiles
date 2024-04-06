import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Layers_enum } from "./Utils/Layers_enum";
import { Tile, DesertTile, FireTile, WaterTile } from "../Tiles/Tile";


export default class Level1 extends Scene {
    private tilemap: OrthogonalTilemap;
    private fireTiles: Vec2[] = [];
    private fireTimer: Timer;
    private tiles: Map<string, Tile>;



    loadScene(): void {
        this.load.tilemap("level1", "Game_Resources/tilemaps/level_1.json");
    }

    unloadScene() {}

    startScene(): void {
        let tilemapLayers = this.add.tilemap("level1");
        this.tilemap = <OrthogonalTilemap>tilemapLayers[1].getItems()[0]

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.tilemap.size;
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setZoomLevel(2.5);

        this.tiles = new Map<string, Tile>();




        
        for (let col = 0; col < this.tilemap.numCols; col++) {
            for (let row = 0; row < this.tilemap.numRows; row++) {
                let tileId = this.tilemap.getTileAtRowCol(new Vec2(row, col));


                if (tileId === 120) {
                    let b = this.tilemap.getWorldPosition(row,col);
                    console.log("불 저장", `${b},`);
                    this.fireTiles.push(b);
                }
            }
        }

        this.fireTimer = new Timer(5000, () => this.spreadFire());
        this.fireTimer.start();

        
    }
    addTile(tile: Tile): void {
        this.tiles.set(tile.position.toString(), tile);
    }

    removeTile(position: Vec2): void {
        this.tiles.delete(position.toString());
    }

    spreadFire() {
        let newFireTiles: Vec2[] = [];
        console.log("불번져~ 실행");

        for (let fireTile of this.fireTiles) {
            // Check the adjacent tiles
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 1 && j === 1) continue;
                    if (i == -1 && j == -1) continue;
                    if (i == 1 && j == -1) continue;
                    if (i == -1 && j == 1) continue;
                    let newPos = new Vec2(fireTile.x + 16*i, fireTile.y + 16*j);
                    
                    let colRow = this.tilemap.getColRowAt(newPos); 
                    let tileId = this.tilemap.getTileAtWorldPosition(colRow)
                    // If the adjacent tile is a ground tile, change it to a fire tile
                    if (tileId === 1) {
                        
                        let colRow = this.tilemap.getColRowAt(newPos); 
                        console.log("불번져~", `${tileId}, ${colRow}`);
                        this.tilemap.setTileAtRowCol(colRow, 120);
                        newFireTiles.push(newPos);
                    }
                }
            }
        }

        // Add the new fire tiles to the array for the next spread
        this.fireTiles = this.fireTiles.concat(newFireTiles);
        this.fireTimer.start();
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
}