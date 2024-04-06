import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Tile, DesertTile, FireTile, WaterTile } from "../Tiles/Tile";
import Tilemap from "../../Wolfie2D/Nodes/Tilemap";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";


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
                    
                    // let colRow = this._tilemap.getColRowAt(newPos); 
                    // let tileId = this._tilemap.getTileAtWorldPosition(colRow)
                    // // If the adjacent tile is a ground tile, change it to a fire tile
                    // if (tileId === 1) {
                        
                    //     let colRow = this._tilemap.getColRowAt(newPos); 
                    //     console.log("불번져~", `${tileId}, ${colRow}`);
                    //     this._tilemap.setTileAtRowCol(colRow, 120);
                    //     newFireTiles.push(newPos);
                    // }

                    let nodes = this.sceneGraph.getNodesAt(newPos);
                    for (let a = 0; a < nodes.length; a++) {
                        let animated_sprite = <AnimatedSprite>nodes[a];
                        if (animated_sprite.animation.getcurrentAnimation() === "desert") {
                            // console.log("불번져~", `${tileId}, ${colRow}`);
                            console.log("불번져~", `desert --> fire, ${newPos.x}, ${newPos.y}`);
                            animated_sprite.animation.play("FIRE_WAVE", true);
                            newFireTiles.push(newPos);
                        }
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

        // for (let tile of this.tiles.values()) {
        //     tile.update(deltaT);
        // }
        if(Input.isMouseJustPressed()){
			let position = Input.getGlobalMousePosition()

            let tileBelow = new Vec2(position.x, position.y); 
            // let colRow = this.tilemap.getColRowAt(tileBelow); 

            // let currnetBelow = this.tilemap.getTileAtWorldPosition(tileBelow);

            // console.log("tile index", `${position},  ${currnetBelow}`);

            // if (currnetBelow == 1) { 
            //     this.tilemap.setTileAtRowCol(colRow, 22);
                
            // }

            let nodes = this.sceneGraph.getNodesAt(tileBelow);
            for (let a = 0; a < nodes.length; a++) {
                let animated_sprite = <AnimatedSprite>nodes[a];
                if (animated_sprite.animation.getcurrentAnimation().valueOf() == "SPACE") {
                    // console.log("불번져~", `${tileId}, ${colRow}`);
                    console.log("불번져~", `desert --> fire, ${tileBelow.x}, ${tileBelow.y}`);
                    animated_sprite.animation.playIfNotAlready("DESERT_TUMBLE", true);
                }
            }
		}
        
    }
}