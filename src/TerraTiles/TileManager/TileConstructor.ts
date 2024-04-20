import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Color from "../../Wolfie2D/Utils/Color";
import GameScene from "../Scenes/GameScene";
import { Layers_enum } from "../Utils/Layers_enum";

export default class TileConstructor{
    private type:string;
    private game_scene: GameScene
    private box: Graphic
    
    constructor(game_scene:GameScene, type:string){
        this.type = type
        this.game_scene = game_scene
        this.box = this.game_scene.add.graphic(GraphicType.RECT, Layers_enum.TILEONMANAGER, {
            position: new Vec2(100, 1216),
            size: new Vec2(100, 64),
        });
        this.box.color = Color.WHITE;
    }
}