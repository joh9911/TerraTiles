import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import GameScene from "../Scenes/GameScene";
import { Layers_enum } from "../Utils/Layers_enum";
import { Tile_manage, Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import TileConstructor from "./TileConstructor";

export default class TileManager{
    private tile_bar: Graphic;
    private game_scene: GameScene;
    private currentMode: string;
    private Tiles: TileConstructor[];
    private position: Vec2;

    constructor(gameScene: GameScene, currentMode: string, locked_tiles: Boolean[]) {
        this.game_scene = gameScene;
        this.currentMode = currentMode
        this.position = new Vec2(640, 1184)
        this.tile_bar = this.game_scene.add.graphic(GraphicType.RECT, Layers_enum.TILEMANAGER, {
            position: this.position,
            size: new Vec2(1280, 192),
        });
        this.tile_bar.color = Color.BROWN;
        this.Tiles = []
        let i = 0;
        for (const [key, value] of Object.entries(Tile_manage)){
            if (locked_tiles[i]){
                this.Tiles[value] = new TileConstructor(gameScene, key, this.position, value, false);
            }
            i++;
        }
        this.Tiles[Tile_manage[Tiles_string.DESERT]].update(true)
    }

    update(mode: string){
        if (mode != this.currentMode){
            console.log(mode)
            this.Tiles[Tile_manage[this.currentMode]].update(false)
            this.currentMode = mode
            this.Tiles[Tile_manage[this.currentMode]].update(true)
        }
    }

    pause() {
        for (const type of this.Tiles) {
            type.pause();
        }
    }

    changeanimation(mode: string){
        this.Tiles[Tile_manage[Tiles_string.W_UP]].changeanimation(mode);
    }
}