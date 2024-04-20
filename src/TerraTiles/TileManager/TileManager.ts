import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import GameScene from "../Scenes/GameScene";
import { Layers_enum } from "../Utils/Layers_enum";
import { Tiles_string } from "../Utils/Tiles_enum";
import TileConstructor from "./TileConstructor";

export default class TileManager{
    private tile_bar: Graphic;
    private game_scene: GameScene;
    private currentMode: string;
    private Tiles: TileConstructor;

    constructor(gameScene: GameScene, currentMode: string) {
        this.game_scene = gameScene;
        this.currentMode = currentMode
        this.tile_bar = this.game_scene.add.graphic(GraphicType.RECT, Layers_enum.TILEMANAGER, {
            position: new Vec2(640, 1216),
            size: new Vec2(1280, 128),
        });
        this.tile_bar.color = Color.BROWN;
        this.Tiles = new TileConstructor(gameScene, Tiles_string.FIRE);
    }

    
}