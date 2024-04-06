import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

export abstract class Tile {
    protected _type: string;
    protected _position: Vec2;

    constructor(type: string, position: Vec2) {
        this._type = type;
        this._position = position;
    }

    get type(): string {
        return this._type;
    }

    get position(): Vec2 {
        return this._position;
    }

    abstract update(deltaT: number): void;
}

export class DesertTile extends Tile {
    constructor(position: Vec2) {
        super("desert", position);
    }

    update(deltaT: number): void {
    }
}

export class FireTile extends Tile {
    private _spreadDelay: number;
    private _spreadTimer: number;

    constructor(position: Vec2) {
        super("fire", position);
        this._spreadDelay = 5; 
        this._spreadTimer = 0;
    }

    update(deltaT: number): void {
        this._spreadTimer += deltaT;

    if (this._spreadTimer >= this._spreadDelay) {
        this._spreadTimer = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;

                let newPos = new Vec2(this._position.x + i, this._position.y + j);
                // let tileId = tilemap.getTileAtRowCol(newPos);

                // if (tileId === 1) {
                //     let colRow = tilemap.getColRowAt(newPos); 
                //     tilemap.setTileAtRowCol(colRow, 120);
                // }
            }
        }
    }
        
    }
}

export class WaterTile extends Tile {
    private _spreadDelay: number;
    private _spreadTimer: number;
    constructor(position: Vec2) {
        super("water", position);
        this._spreadDelay = 3000; 
        this._spreadTimer = 0;
    }

    update(deltaT: number): void {
        this._spreadTimer += deltaT;
        console.log("업데이트");

    if (this._spreadTimer >= this._spreadDelay) {
        this._spreadTimer = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;

                let newPos = new Vec2(this._position.x + i, this._position.y + j);
                // let tileId = tilemap.getTileAtRowCol(newPos);

                // if (tileId === 120) {
                //     let colRow = tilemap.getColRowAt(newPos); 
                //     tilemap.setTileAtRowCol(colRow, 1);
                // }
            }
        }
    }

        
    }
}


export class SpaceTile extends Tile {
    private _spreadDelay: number;
    private _spreadTimer: number;
    constructor(position: Vec2) {
        super("SPACE", position);
        this._spreadDelay = 100; 
        this._spreadTimer = 0;
    }

    update(deltaT: number): void {
        this._spreadTimer += deltaT;

    if (this._spreadTimer >= this._spreadDelay) {
        this._spreadTimer = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;

                let newPos = new Vec2(this._position.x + i, this._position.y + j);
                // let tileId = tilemap.getTileAtRowCol(newPos);

                // if (tileId === 120) {
                //     let colRow = tilemap.getColRowAt(newPos); 
                //     tilemap.setTileAtRowCol(colRow, 1);
                // }
            }
        }
    }
        
    }

}