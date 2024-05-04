import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import ShaderRegistry from "../../Wolfie2D/Registry/Registries/ShaderRegistry";
import Color from "../../Wolfie2D/Utils/Color";
import GameScene from "../Scenes/GameScene";
import { Keyboard_enum } from "../Utils/Keyboard_enum";
import { Layers_enum } from "../Utils/Layers_enum";

export default class TileConstructor{
    private type:AnimatedSprite;
    private game_scene: GameScene
    private box: Button
    private outline: Graphic
    private prevColor: Color
    private position: Vec2
    private index:number
    private emitter: Emitter;
    
    constructor(game_scene:GameScene, type:string, position:Vec2, index:number, selected:Boolean){
        this.game_scene = game_scene
        this.index = index
        this.emitter = new Emitter()
        if (selected){
            this.position = new Vec2(100 + this.index * 200, position.y - 32)
        }
        else{
            this.position = new Vec2(100 + this.index * 200, position.y)
        }
        this.box = <Button>this.game_scene.add.uiElement(UIElementType.BUTTON, Layers_enum.BOXONMANAGER, {position: this.position, text: ""});
        this.game_scene.add.uiElement(UIElementType.LABEL, Layers_enum.TILEONMANAGER, {position: new Vec2(this.position.x, this.position.y + 40), text: Keyboard_enum[index]});
        this.box.backgroundColor = Color.GRAY;
        if (selected){
            this.box.backgroundColor = this.box.backgroundColor.lighten()
        }
        this.box.size = new Vec2(100, 128)
        this.box.onClick = () =>{
            this.emitter.fireEvent(type)
        }
        this.type = this.game_scene.add.animatedSprite(AnimatedSprite, "tile_animations", Layers_enum.TILEONMANAGER)
        this.type.animation.play(type, true);
        this.type.position = new Vec2(this.position.x, this.position.y - 20);
        this.type.size.copy(new Vec2(32, 32));
        this.type.scale.set(2, 2);

        this.outline = this.game_scene.add.graphic(GraphicType.RECT, Layers_enum.TILEONMANAGER, {
            position: new Vec2(24 + this.index * 47, this.position.y+83),
            size: new Vec2(17, 9),
        });
        this.outline.color = Color.BLACK;
        this.outline.useCustomShader(ShaderRegistry.TILEOUTLINE_SHADER);
    }

    pause() {
        if (this.outline.color.toString() !== Color.BROWN.toString()) {
            this.prevColor = this.outline.color;
            this.outline.color = Color.BROWN;
        }
        else {
            this.outline.color = this.prevColor;
        }
    }

    update(selected:Boolean){
        if (selected){
            this.box.backgroundColor = this.box.backgroundColor.lighten();
            this.outline.color = Color.WHITE;
        }
        else{
            this.box.backgroundColor = this.box.backgroundColor.darken()
            this.outline.color = Color.BLACK;
        }
    }

    changeanimation(mode: string){
        this.type.animation.playIfNotAlready(mode, true);
    }
}