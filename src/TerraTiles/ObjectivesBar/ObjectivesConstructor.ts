import Graph from "../../Wolfie2D/DataTypes/Graphs/Graph";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import GameScene from "../Scenes/GameScene";
import { Layers_enum } from "../Utils/Layers_enum";

export default class ObjectivesConstructor{
    protected pos: Vec2
    protected game_scene: GameScene
    protected text: Label
    protected checkbox: Graphic
    protected receiver: Receiver

    constructor(game_scene: GameScene, pos: Vec2){
        this.pos = pos;
        this.game_scene = game_scene
        this.checkbox = this.createCheck(pos);
        this.receiver = new Receiver();
    }

    update(){
    }

    private createCheck(pos: Vec2): Graphic {
        let btn = this.game_scene.add.graphic(GraphicType.RECT, Layers_enum.BOXONMANAGER, {
            position: pos,
            size: new Vec2(50, 50),
        });
        btn.color = Color.RED;
        return btn;
    }

    protected setCheck(){
        this.checkbox.color = Color.GREEN;
    }

    protected unsetCheck(){
        this.checkbox.color = Color.RED;
    }

    public get checkBox(): Graphic{
        return this.checkbox
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
}