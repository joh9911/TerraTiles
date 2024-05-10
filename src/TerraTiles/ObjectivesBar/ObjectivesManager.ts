import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import { Layers_enum } from "../Utils/Layers_enum";
import GameScene from "../Scenes/GameScene";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import CreateLand from "./CreateLand";
import HaveFire from "./HaveFire";
import NoMud from "./NoMud";
import ObjectivesConstructor from "./ObjectivesConstructor";
import Emitter from "../../Wolfie2D/Events/Emitter";
import { Objective_Event } from "../Utils/Objective_Event";
import HaveWater from "./HaveWater";
import HaveHouse from "./HaveHouse";
import ReachTime from "./ReachTime";
import NoFire from "./NoFire";
import NoDisease from "./NoDisease";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import NoDesert from "./NoDesert";

export default class ObjectivesManager{
    
    private game_scene: GameScene;
    private position: Vec2
    private up_left: Vec2
    private list_objectives: ObjectivesConstructor[]
    private num_objectives: number
    private emitter: Emitter
    protected nextLevel: Button
    protected madeNextLevel: boolean
    
    constructor(gameScene: GameScene){
        this.game_scene = gameScene
        this.emitter = new Emitter()
        this.position = new Vec2(640, 96)
        let obj_box = this.game_scene.add.graphic(GraphicType.RECT, Layers_enum.TILEMANAGER, {
            position: this.position,
            size: new Vec2(1280, 192),
        });
        this.up_left = new Vec2(this.position.x - obj_box.size.x/2, this.position.y - obj_box.size.y/2)
        obj_box.color = new Color(139, 69, 19, 1);
        this.createLabel("Objectives", new Vec2(this.up_left.x + 120, this.up_left.y + 25));
        this.list_objectives = []
        this.num_objectives = 0
        this.nextLevel = <Button>this.game_scene.add.uiElement(UIElementType.BUTTON, Layers_enum.BOXONMANAGER, {position: new Vec2(1100, 55), text: "Go to next world?"});
        this.nextLevel.size.set(300, 50);
        this.nextLevel.backgroundColor = Color.GRAY;
        this.nextLevel.visible = false;
        this.nextLevel.onClick = () => {
            this.emitter.fireEvent(Objective_Event.NEXTLEVEL);
        }
        this.madeNextLevel = false;
    }

    public createLand(num: number){
        this.list_objectives[this.num_objectives] = new CreateLand(this.game_scene, this.setObjectivePos(), num);
        this.num_objectives++;
    }

    public haveFire(num: number){
        this.list_objectives[this.num_objectives] = new HaveFire(this.game_scene, this.setObjectivePos(), num);
        this.num_objectives++;
    }

    public haveWater(num: number){
        this.list_objectives[this.num_objectives] = new HaveWater(this.game_scene, this.setObjectivePos(), num);
        this.num_objectives++;
    }

    public NoMud(num: number){
        this.list_objectives[this.num_objectives] = new NoMud(this.game_scene, this.setObjectivePos(), num);
        this.num_objectives++;
    }

    public NoFire(num: number){
        this.list_objectives[this.num_objectives] = new NoFire(this.game_scene, this.setObjectivePos(), num);
        this.num_objectives++;
    }

    public NoDisease(num: number){
        this.list_objectives[this.num_objectives] = new NoDisease(this.game_scene, this.setObjectivePos(), num);
        this.num_objectives++;
    }

    public NoDesert(num: number){
        this.list_objectives[this.num_objectives] = new NoDesert(this.game_scene, this.setObjectivePos(), num);
        this.num_objectives++;
    }

    public haveHouse(num: number){
        this.list_objectives[this.num_objectives] = new HaveHouse(this.game_scene, this.setObjectivePos(), num);
        this.num_objectives++;
    }

    public reachTime(num: number, secret: boolean){//num is in seconds, automatically converts to milliseconds for timer
        this.list_objectives[this.num_objectives] = new ReachTime(this.game_scene, this.setObjectivePos(), num, secret);
        this.num_objectives++;
    }

    private setObjectivePos(){
        return new Vec2(this.up_left.x + 45 + 500 * (Math.floor(this.num_objectives/2)), this.up_left.y + 75 + 50 * (this.num_objectives%2))
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

    private allComplete(){
        for (let obj of this.list_objectives){
            if (obj.checkBox.color.toString() === Color.RED.toString()){
                return false
            }
        }
        return true
    }

    update(){
        for (let obj of this.list_objectives){
            obj.update()
        }
        if (this.madeNextLevel == false && this.allComplete()){
            this.madeNextLevel = true;
            this.nextLevel.visible = true;
            this.emitter.fireEvent(GameEventType.PLAY_SFX, {key: "progress", loop: false});
        }
    }
}