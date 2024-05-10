import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import GameScene from "../Scenes/GameScene";
import { Layers_enum } from "../Utils/Layers_enum";
import { Objective_Event, Send_Objective_Event } from "../Utils/Objective_Event";
import { Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import ObjectivesConstructor from "./ObjectivesConstructor";

export default class HaveHouse extends ObjectivesConstructor{
    private maxnum: number
    private currentnum: number
    
    constructor(game_scene: GameScene, pos: Vec2, num: number){
        super(game_scene, pos);
        this.maxnum = num
        this.currentnum = 0;
        this.text = this.createLabel("Protect " + this.currentnum + "/" + this.maxnum + " Houses", new Vec2(pos.x + 140, pos.y))
        this.receiver.subscribe(Objective_Event.HOUSESIZE);
        Send_Objective_Event[Tiles_index[Tiles_string.HOUSE]] = 1;

    }

    update(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            this.currentnum = event.data.get("size");
            console.log(event)
            if (this.currentnum >= this.maxnum){
                this.setCheck();
            }
            else{
                this.unsetCheck();
            }
            this.text.text = ("Protect " + this.currentnum + "/" + this.maxnum + " Houses");
        }
    }
}