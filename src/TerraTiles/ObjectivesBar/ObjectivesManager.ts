import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import { Layers_enum } from "../Utils/Layers_enum";
import GameScene from "../Scenes/GameScene";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import CreateLand from "./CreateLand";
import ObjectivesConstructor from "./ObjectivesConstructor";

export default class ObjectivesManager{
    
    private game_scene: GameScene;
    private position: Vec2
    private up_left: Vec2
    private list_objectives: ObjectivesConstructor[]
    
    constructor(gameScene: GameScene){
        this.game_scene = gameScene
        this.position = new Vec2(640, 96)
        let obj_box = this.game_scene.add.graphic(GraphicType.RECT, Layers_enum.TILEMANAGER, {
            position: this.position,
            size: new Vec2(1280, 192),
        });
        this.up_left = new Vec2(this.position.x - obj_box.size.x/2, this.position.y - obj_box.size.y/2)
        obj_box.color = new Color(139, 69, 19, 1);
        this.createLabel("Objectives", new Vec2(this.up_left.x + 120, this.up_left.y + 25));
        this.list_objectives = []
        this.list_objectives[0] = new CreateLand(this.game_scene, new Vec2(this.up_left.x + 45, this.up_left.y + 75), 10);
    }

    protected createLabel(text: String, pos: Vec2): Button {
        let btn = <Button>this.game_scene.add.uiElement(UIElementType.LABEL, Layers_enum.BOXONMANAGER, {position: pos, text: text});
        btn.size.set(200, 50);
        btn.borderColor = Color.TRANSPARENT;
        btn.backgroundColor = Color.TRANSPARENT;
        btn.setHAlign("left");
        btn.onClick = () => {
        };
        return btn;
    }

    update(){
        this.list_objectives[0].update()
    }
}