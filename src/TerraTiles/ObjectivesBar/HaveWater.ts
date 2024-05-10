import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import GameScene from "../Scenes/GameScene";
import { Layers_enum } from "../Utils/Layers_enum";
import { Objective_Event, Send_Objective_Event } from "../Utils/Objective_Event";
import { Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import ObjectivesConstructor from "./ObjectivesConstructor";

export default class HaveFire extends ObjectivesConstructor{
    private maxnum: number
    private currentnum: number
    private up:number
    private left:number
    private right:number
    private down:number
    
    constructor(game_scene: GameScene, pos: Vec2, num: number){
        super(game_scene, pos);
        this.maxnum = num
        this.currentnum = 0;
        this.up = 0;
        this.right = 0;
        this.down = 0;
        this.left = 0;
        this.text = this.createLabel("Have " + this.currentnum + "/" + this.maxnum + " Water", new Vec2(pos.x + 140, pos.y))
        this.receiver.subscribe(Objective_Event.WUPSIZE);
        this.receiver.subscribe(Objective_Event.WLEFTSIZE);
        this.receiver.subscribe(Objective_Event.WDOWNSIZE);
        this.receiver.subscribe(Objective_Event.WRIGHTSIZE);
        Send_Objective_Event[Tiles_index[Tiles_string.W_DOWN]] = 1;
        Send_Objective_Event[Tiles_index[Tiles_string.W_UP]] = 1;
        Send_Objective_Event[Tiles_index[Tiles_string.W_LEFT]] = 1;
        Send_Objective_Event[Tiles_index[Tiles_string.W_RIGHT]] = 1;
    }

    update(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            if (event.type == Objective_Event.WUPSIZE){
                this.up = event.data.get("size");
            }
            else if (event.type == Objective_Event.WDOWNSIZE){
                this.down = event.data.get("size");
            }
            else if (event.type == Objective_Event.WLEFTSIZE){
                this.left = event.data.get("size");
            }
            else if (event.type == Objective_Event.WRIGHTSIZE){
                this.right = event.data.get("size");
            }
            this.currentnum = this.up + this.down + this.left + this.right;
            if (this.currentnum >= this.maxnum){
                this.setCheck();
            }
            else{
                this.unsetCheck();
            }
            this.text.text = ("Have " + this.currentnum + "/" + this.maxnum + " Water");
        }
    }
}