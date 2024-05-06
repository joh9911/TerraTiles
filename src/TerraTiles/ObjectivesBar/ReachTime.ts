import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import GameScene from "../Scenes/GameScene";
import { Layers_enum } from "../Utils/Layers_enum";
import { Objective_Event } from "../Utils/Objective_Event";
import ObjectivesConstructor from "./ObjectivesConstructor";

export default class ReachTime extends ObjectivesConstructor{
    private timer: Timer
    private end: boolean
    private totaltime: number
    
    constructor(game_scene: GameScene, pos: Vec2, num: number){
        super(game_scene, pos);
        this.end = false;
        this.totaltime = num;
        this.timer = new Timer(num*1000, ()=>{
        this.end = true},
         false);
        this.timer.start();
        this.text = this.createLabel("Time Left: " + Math.floor(this.timer.timeinSeconds()) + " / " + this.totaltime, new Vec2(pos.x + 140, pos.y));
    }

    update(){
        if (this.end){
            this.setCheck();
        }
        this.text.text = ("Time Left: " + Math.floor(this.timer.timeinSeconds()) + " / " + this.totaltime);
    }
}