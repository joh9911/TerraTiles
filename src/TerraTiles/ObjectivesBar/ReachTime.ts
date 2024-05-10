import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import GameScene from "../Scenes/GameScene";
import { Layers_enum } from "../Utils/Layers_enum";
import { Objective_Event, Send_Objective_Event } from "../Utils/Objective_Event";
import { Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import ObjectivesConstructor from "./ObjectivesConstructor";

export default class ReachTime extends ObjectivesConstructor{
    private timer: Timer
    private end: boolean
    private totaltime: number
    private secret: boolean
    
    constructor(game_scene: GameScene, pos: Vec2, num: number, secret: boolean){
        super(game_scene, pos);
        this.end = false;
        this.totaltime = num;
        this.timer = new Timer(num*1000, ()=>{
        this.end = true},
         false);
        this.timer.start();
        this.secret = secret;
        if (secret){
            this.text = this.createLabel("Have Fun!", new Vec2(pos.x + 140, pos.y));
        }
        else{
            this.text = this.createLabel("Reach: " + (this.totaltime - Math.floor(this.timer.timeinSeconds())) + " / " + this.totaltime + " secs", new Vec2(pos.x + 140, pos.y));
        }
        Send_Objective_Event[15] = 1;
        this.receiver.subscribe(Objective_Event.TIMER);
    }

    update(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            let pause = event.data.get("pause");
            if (pause){
                this.timer.pause();
            }
            else {
                this.timer.continue(); 
            }
            console.log(event);
        }
        if (this.end){
            this.setCheck();
        }
        if (!this.secret){
            this.text.text = ("Reach: " + (this.totaltime - Math.floor(this.timer.timeinSeconds())) + " / " + this.totaltime + " secs");
        }
    }
}