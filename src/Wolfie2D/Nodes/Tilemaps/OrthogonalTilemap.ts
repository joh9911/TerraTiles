import Tilemap from "../Tilemap";
import Vec2 from "../../DataTypes/Vec2";
import { TiledTilemapData, TiledLayerData } from "../../DataTypes/Tilesets/TiledData";
import Debug from "../../Debug/Debug";
import Color from "../../Utils/Color";
import AABB from "../../DataTypes/Shapes/AABB";

/**
 * The representation of an orthogonal tilemap - i.e. a top down or platformer tilemap
 */
export default class OrthogonalTilemap extends Tilemap {
    [x: string]: any;
    /** The number of columns in the tilemap */
    numCols: number;
    /** The number of rows in the tilemap */
    numRows: number;

    // @override
    protected parseTilemapData(tilemapData: TiledTilemapData, layer: TiledLayerData): void {
        // The size of the tilemap in local space
        this.numCols = tilemapData.width;
        this.numRows = tilemapData.height;

        // The size of tiles
        this.tileSize.set(tilemapData.tilewidth, tilemapData.tileheight);

        // The size of the tilemap on the canvas
        this.size.set(this.numCols * this.tileSize.x, this.numRows * this.tileSize.y);
        this.position.copy(this.size.scaled(0.5));
        this.data = layer.data;
        this.visible = layer.visible;

        // Whether the tilemap is collidable or not
        this.isCollidable = false;
        if(layer.properties){
            for(let item of layer.properties){
                if(item.name === "Collidable"){
                    this.isCollidable = item.value;

                    // Set all tiles besides "empty: 0" to be collidable
                    for(let i = 1; i < this.collisionMap.length; i++){
                        this.collisionMap[i] = true;
                    }
                }
            }
        }
    }
    
    
    public override getMinColRow(region: AABB): Vec2 {
        return this.getTilemapPosition(region.topLeft.x, region.topLeft.y);
    }
    public override getMaxColRow(region: AABB): Vec2 {
        return this.getTilemapPosition(region.bottomRight.x, region.bottomRight.y);
    }

    public override getTilemapPosition(x: number, y: number): Vec2 {
        let col = Math.floor(x / this.tileSize.x / this.scale.x);
        let row = Math.floor(y / this.tileSize.y / this.scale.y);
        return new Vec2(col, row);
    }

    public override getWorldPosition(col: number, row: number): Vec2 {
        let x = col * this.tileSize.x * this.scale.x;
        let y = row * this.tileSize.y * this.scale.y;
        return new Vec2(x, y);
    }

     /**
     * Gets the data value of the tile at the specified world position
     * @param worldCoords The coordinates in world space
     * @returns The data value of the tile
     */
    getTileAtWorldPosition(worldCoords: Vec2): number {
        let localCoords = this.getColRowAt(worldCoords);
        return this.getTileAtRowCol(localCoords);
    }

    /**
     * Get the tile at the specified row and column
     * @param rowCol The coordinates in tilemap space
     * @returns The data value of the tile
     */
    getTileAtRowCol(rowCol: Vec2): number {
        if(rowCol.x < 0 || rowCol.x >= this.numCols || rowCol.y < 0 || rowCol.y >= this.numRows){
            return -1;
        }

        return this.data[rowCol.y * this.numCols + rowCol.x];
    }
    
    /**
     * Takes in world coordinates and returns the row and column of the tile at that position
     * @param worldCoords The coordinates of the potential tile in world space
     * @returns A Vec2 containing the coordinates of the potential tile in tilemap space
     */
    getColRowAt(worldCoords: Vec2): Vec2 {
        let col = Math.floor(worldCoords.x / this.tileSize.x / this.scale.x);
        let row = Math.floor(worldCoords.y / this.tileSize.y / this.scale.y);

        return new Vec2(col, row);
    }

    /**
     * Sets the tile at the specified row and column
     * @param rowCol The position of the tile in tilemap space
     * @param type The new data value of the tile
     */
    setTileAtRowCol(rowCol: Vec2, type: number): void {
        let index = rowCol.y * this.numCols + rowCol.x;
        this.setTile(index, type);
    }

    // @override
    setTile(index: number, type: number): void {
        this.data[index] = type;
    }

    

    

    public override getTileCollider(col: number, row: number): AABB {
        let tileSize = this.getScaledTileSize();

        let centerX = col * tileSize.x + tileSize.x / 2;
        let centerY = row * tileSize.y + tileSize.y / 2;

        let center = new Vec2(centerX, centerY);
        let halfSize = tileSize.scaled(0.5);

        return new AABB(center, halfSize);
    }

    
    // @override
    update(deltaT: number): void {}

    // @override
    public override debugRender(){
        for (let i = 0; i < this.data.length; i++) {
            let cr = this.getTileColRow(i);
            if (this.isCollidable && this.isTileCollidable(cr.x, cr.y)) {
                let box = this.getTileCollider(cr.x, cr.y);
                Debug.drawBox(this.inRelativeCoordinates(box.center), box.halfSize.scale(this.scene.getViewScale()), false, Color.BLUE);
            }
        }
    }
}