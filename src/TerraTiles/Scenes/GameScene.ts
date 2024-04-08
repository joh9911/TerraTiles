import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Tile, DesertTile, FireTile, WaterTile } from "../Tiles/Tile";
import Tilemap from "../../Wolfie2D/Nodes/Tilemap";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";


export default class GameScene extends Scene {
    protected tilemap: OrthogonalTilemap;
    // changed Vec2 to String, because It can't campare between Vec2 objects when deleting tiles.
    protected desertTiles: Set<String> = new Set<String>();
    protected grassTiles: Set<String> = new Set<String>();
    protected fireTiles: Set<String> = new Set<String>();
    protected waterTiles: Set<String> = new Set<String>();
    protected rockTiles: Set<String> = new Set<String>();
    protected roundDelay: number;
    protected roundTimer: number;
    protected currentMode: string = "DESERT"; // temporarily set the tile mode, default mode is DESERT


    growGrassFromDesert() {

        for (let desertTile of this.desertTiles) {

            // Convert newPos to a string representation. Due to issues with equality comparison of Vec2 objects
            let pos = this.stringToVec2(desertTile);
            let vec2ToString = this.vec2ToString(pos);

            let nodes = this.sceneGraph.getNodesAt(pos);
            
            for (let node of nodes) {
                let animatedSprite = node as AnimatedSprite;
                animatedSprite.animation.playIfNotAlready("GRASS_FLOWER", true);
                this.grassTiles.add(vec2ToString);
                this.desertTiles.delete(vec2ToString);
                break;
            }
        }
        

    }

    spreadWater(){
        const newWaterTiles: Set<String> = new Set<String>();

        for (let waterTile of this.waterTiles) {
            const directions = [
                { dx: 0, dy: -1 }, 
                { dx: 1, dy: 0 },  
                { dx: 0, dy: 1 },  
                { dx: -1, dy: 0 }  
            ];
        
            for (let {dx, dy} of directions) {

                // Convert newPos to a string representation. Due to issues with equality comparison of Vec2 objects
                let originPos = this.stringToVec2(waterTile);
                let newPos = new Vec2(originPos.x + dx * 32, originPos.y + dy * 32);
                let vec2ToString = this.vec2ToString(newPos);
                
                let nodes = this.sceneGraph.getNodesAt(newPos);
                for (let a = 0; a < nodes.length; a++) {
                    let animated_sprite = <AnimatedSprite>nodes[a];

                    if (animated_sprite.animation.getcurrentAnimation().valueOf() == "DESERT_TUMBLE") {
                        animated_sprite.animation.playIfNotAlready("WATER_UP", true);
                        newWaterTiles.add(vec2ToString);
                        this.desertTiles.delete(vec2ToString);
                        break;
                    }
                    if (animated_sprite.animation.getcurrentAnimation().valueOf() == "FIRE_WAVE"){
                        animated_sprite.animation.playIfNotAlready("WATER_UP", true);
                        newWaterTiles.add(vec2ToString);
                        this.fireTiles.delete(vec2ToString);
                        break;
                    }
                
                    if (animated_sprite.animation.getcurrentAnimation().valueOf() == "GRASS_FLOWER"){
                        animated_sprite.animation.playIfNotAlready("WATER_UP", true);
                        newWaterTiles.add(vec2ToString);
                        this.desertTiles.delete(vec2ToString);
                        this.grassTiles.delete(vec2ToString);
                        break;
                    }
                }
            }
            this.waterTiles = new Set<String>([...this.waterTiles, ...newWaterTiles]);
        }
        
    }
    spreadFire() {
        const newFireTiles: Set<String> = new Set<String>();
    
        for (let fireTile of this.fireTiles) {
            const directions = [
                { dx: 0, dy: -1 },
                { dx: 1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: -1, dy: 0 }
            ];
    
            for (let {dx, dy} of directions) {

                // Convert newPos to a string representation. Due to issues with equality comparison of Vec2 objects
                let originPos = this.stringToVec2(fireTile)
                let newPos = new Vec2(originPos.x + dx * 32, originPos.y + dy * 32);
                let vec2ToString = this.vec2ToString(newPos);

                let nodes = this.sceneGraph.getNodesAt(newPos);
    
                for (let node of nodes) {
                    let animatedSprite = node as AnimatedSprite;
    
                    if (animatedSprite.animation.getcurrentAnimation() === "DESERT_TUMBLE") {
                        animatedSprite.animation.playIfNotAlready("FIRE_WAVE", true);
                        newFireTiles.add(vec2ToString);
                        this.desertTiles.delete(vec2ToString);
                        break;
                    }
    
                    if (animatedSprite.animation.getcurrentAnimation() === "GRASS_FLOWER") {
                        animatedSprite.animation.playIfNotAlready("FIRE_WAVE", true);
                        newFireTiles.add(vec2ToString);
                        this.desertTiles.delete(vec2ToString);
                        this.grassTiles.delete(vec2ToString)
                        break;
                    }
                }
            }
        }
    
        this.fireTiles = new Set<String>([...this.fireTiles, ...newFireTiles]);

    }

    // method for comparing tiles' positions
    vec2ToString(vec: Vec2): string {
        return `${vec.x}:${vec.y}`;
    }
    stringToVec2(s: String): Vec2 {
        const [x, y] = s.split(':').map(Number);
        return new Vec2(x, y);
    }
    
    
    
    
    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
        this.roundTimer += deltaT;

        if (this.roundTimer >= this.roundDelay) {
            this.roundTimer = 0;
            this.spreadWater();
            this.spreadFire();
            this.growGrassFromDesert();

            
        }
        
        // temporarily set the tile mode
        if (Input.isKeyPressed('q')) {
            this.currentMode = "DESERT";
        } else if (Input.isKeyPressed('w')) {
            this.currentMode = "WATER";
        } else if (Input.isKeyPressed('e')) {
            this.currentMode = "FIRE";
        } else if (Input.isKeyPressed('r')) {
            this.currentMode = "ROCK";
        }


        if (Input.isMouseJustPressed()) {
            const position = Input.getGlobalMousePosition();
            const tilePos = new Vec2(position.x, position.y);
            const vec2ToString = this.vec2ToString(tilePos);
            const nodes = this.sceneGraph.getNodesAt(tilePos);
        
            for (let node of nodes) {
                const animatedSprite = node as AnimatedSprite;
                const currentAnimation = animatedSprite.animation.getcurrentAnimation();
        
                switch (this.currentMode) {
                    case "DESERT":
                        if (currentAnimation === "SPACE" || currentAnimation === "SPACE_COMET") {
                            animatedSprite.animation.playIfNotAlready("DESERT_TUMBLE", true);
                            this.desertTiles.add(vec2ToString);
                        }
                        break;
                    case "WATER":
                        if (currentAnimation === "DESERT_TUMBLE") {
                            this.desertTiles.delete(vec2ToString);
                        } else if (currentAnimation === "FIRE_WAVE") {
                            this.fireTiles.delete(vec2ToString);
                        } 
                         else if (currentAnimation == "GRASS_FLOWER"){
                            this.grassTiles.delete(vec2ToString);
                        }
                        animatedSprite.animation.playIfNotAlready("WATER_UP", true);
                        this.waterTiles.add(vec2ToString);
                        break;
                    case "FIRE":
                        if (currentAnimation === "DESERT_TUMBLE") {
                            this.desertTiles.delete(vec2ToString);
                        } else if (currentAnimation == "GRASS_FLOWER"){
                            this.grassTiles.delete(vec2ToString);
                        }
                        animatedSprite.animation.playIfNotAlready("FIRE_WAVE", true);
                        this.fireTiles.add(vec2ToString);
                        break;
                    case "ROCK":
                        if (currentAnimation === "DESERT_TUMBLE") {
                            this.desertTiles.delete(vec2ToString);
                        } else if (currentAnimation === "FIRE_WAVE") {
                            this.fireTiles.delete(vec2ToString);
                        } 
                         else if (currentAnimation == "GRASS_FLOWER"){
                            this.grassTiles.delete(vec2ToString);
                        }
                        animatedSprite.animation.playIfNotAlready("ROCK", true);
                        this.rockTiles.add(vec2ToString);
                        break;    
                }
            }
        }
        
    }
}