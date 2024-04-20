import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Scene from "../../Wolfie2D/Scene/Scene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Tiles_string, Tiles_index, TileMatrix } from "../Utils/Tiles_enum";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import { Layers_enum } from "../Utils/Layers_enum";
import Color from "../../Wolfie2D/Utils/Color";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { SoundEvent } from "../Utils/SoundEvent";


export default class GameScene extends Scene {
    // protected tilemap: OrthogonalTilemap;
    // changed Vec2 to String, because It can't campare between Vec2 objects when deleting tiles.
    protected Tiles: Set<String>[] = [];//uses Tiles_index for array, so desert is 0, grass is 1, ...
    protected roundDelay: number;
    protected roundTimer: number;
    protected currentMode: string = Tiles_string.DESERT; // temporarily set the tile mode, default mode is DESERT
    protected pause: boolean;
    protected pause_box: Graphic

    // method for comparing tiles' positions
    vec2ToString(vec: Vec2): string {
        return `${vec.x}:${vec.y}`;
    }
    stringToVec2(s: String): Vec2 {
        const [x, y] = s.split(':').map(Number);
        return new Vec2(x, y);
    }

    private createButton(text: String, pos: Vec2): Button {
        let btn = <Button>this.add.uiElement(UIElementType.BUTTON, Layers_enum.MENU, {position: pos, text: text});
        btn.size.set(200, 50);
        btn.borderColor = Color.TRANSPARENT;
        btn.backgroundColor = Color.TRANSPARENT;
        btn.setHAlign("left");
        btn.onClick = () => {
        };
        return btn;
    }

    growGrassFromDesert() {

        for (let desertTile of this.Tiles[Tiles_index[Tiles_string.DESERT]]) {

            // Convert newPos to a string representation. Due to issues with equality comparison of Vec2 objects
            let pos = this.stringToVec2(desertTile);
            let vec2ToString = this.vec2ToString(pos);

            let nodes = this.sceneGraph.getNodesAt(pos);
            
            for (let node of nodes) {
                if (node instanceof AnimatedSprite) {
                    let animatedSprite = node as AnimatedSprite;
                    if (animatedSprite.animation.getcurrentAnimation().valueOf() == Tiles_string.DESERT) {
                        animatedSprite.animation.playIfNotAlready(Tiles_string.GRASS, true);
                        this.Tiles[Tiles_index[Tiles_string.GRASS]].add(vec2ToString);    
                        this.Tiles[Tiles_index[Tiles_string.DESERT]].delete(vec2ToString);                        
                        break;
                    }
                    this.Tiles[Tiles_index[Tiles_string.DESERT]].delete(vec2ToString);
                }
            }

        }
        
    }

    spreadWater(){
        const newWaterTiles: Set<String> = new Set<String>();

        let dx = 0, dy = -1;
        for (let waterTile of this.Tiles[Tiles_index[Tiles_string.W_UP]]) {
            // Convert newPos to a string representation. Due to issues with equality comparison of Vec2 objects
            let originPos = this.stringToVec2(waterTile);
            let newPos = new Vec2(originPos.x + dx * 32, originPos.y + dy * 32);
            let vec2ToString = this.vec2ToString(newPos);
            
            let nodes = this.sceneGraph.getNodesAt(newPos);
            for (let a = 0; a < nodes.length; a++) {
                if (nodes[a] instanceof AnimatedSprite){
                    let animated_sprite = <AnimatedSprite>nodes[a];
                    let animation_string = animated_sprite.animation.getcurrentAnimation().valueOf();

                    if (TileMatrix[Tiles_string.W_UP][animation_string] == 1){
                        animated_sprite.animation.playIfNotAlready(Tiles_string.W_UP, true);
                        newWaterTiles.add(vec2ToString);
                        this.Tiles[Tiles_index[animation_string]].delete(vec2ToString);
                    }
                }
            }
        }
        this.Tiles[Tiles_index[Tiles_string.W_UP]] = new Set<String>([...this.Tiles[Tiles_index[Tiles_string.W_UP]], ...newWaterTiles]);
    }

    
    spreadFire() {
        console.log(this.Tiles[Tiles_index[Tiles_string.FIRE]]);
        const newFireTiles: Set<String> = new Set<String>();
    
        for (let fireTile of this.Tiles[Tiles_index[Tiles_string.FIRE]]) {
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
                    if (node instanceof AnimatedSprite){
                        let animated_sprite = node as AnimatedSprite;
                        let animation_string = animated_sprite.animation.getcurrentAnimation().valueOf();
                        if (TileMatrix[Tiles_string.FIRE][animation_string] == 1){
                            animated_sprite.animation.playIfNotAlready(Tiles_string.FIRE, true);
                            newFireTiles.add(vec2ToString);
                            this.Tiles[Tiles_index[animation_string]].delete(vec2ToString);
                        }
                    }
                }
            }
        }
    
        this.Tiles[Tiles_index[Tiles_string.FIRE]] = new Set<String>([...this.Tiles[Tiles_index[Tiles_string.FIRE]], ...newFireTiles]);

    }
    
    startScene(): void {
        for (let i = 0; i < 9; i++) {
            this.Tiles[i] = new Set();
        }
        this.pause = false;
        this.addLayer(Layers_enum.MENU, 10);
        this.addLayer(Layers_enum.BACK, 9);
        this.addLayer(Layers_enum.PAUSE, 100);
        let obj_box = this.add.graphic(GraphicType.RECT, Layers_enum.BACK, {
            position: new Vec2(1100, 200),
            size: new Vec2(500, 512),
        });
        obj_box.color = new Color(139, 69, 19, 1);
        this.createButton("Objective", new Vec2(1000, 200));
        this.createButton("Create 10 new lands", new Vec2(1000, 230));
        this.pause_box = this.add.graphic(GraphicType.RECT, Layers_enum.PAUSE, {
            position: new Vec2(640, 640),
            size: new Vec2(1280, 1280),
        });
        this.pause_box.color = Color.BLACK;
        this.pause_box.visible = false;
    }
    
    
    updateScene(deltaT: number): void {
        if (Input.isKeyJustPressed('p') === true){
            this.pause = !this.pause;
            this.pause_box.visible = !this.pause_box.visible;
        }
        if (this.pause){
            return;
        }
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
            this.currentMode = Tiles_string.DESERT;
        } else if (Input.isKeyPressed('w')) {
            this.currentMode = Tiles_string.W_UP;
        } else if (Input.isKeyPressed('e')) {
            this.currentMode = Tiles_string.FIRE;
        } else if (Input.isKeyPressed('r')) {
            this.currentMode = Tiles_string.ROCK;
        }


        if (Input.isMouseJustPressed()) {
            const position = Input.getGlobalMousePosition();
            if (position.y <= 512 && position.x <= 512){//size of map
                const tilePos = new Vec2(position.x, position.y);
                const vec2ToString = this.vec2ToString(tilePos);
                const nodes = this.sceneGraph.getNodesAt(tilePos);
            
                for (let node of nodes) {
                    if (node instanceof AnimatedSprite) {
                        const animatedSprite = node as AnimatedSprite;
                        const currentAnimation = animatedSprite.animation.getcurrentAnimation();
    
                        if (TileMatrix[this.currentMode][currentAnimation]){
                            if (currentAnimation != Tiles_string.COMET && currentAnimation != Tiles_string.SPACE){
                                console.log(this.Tiles[Tiles_index[currentAnimation]]);
                                this.Tiles[Tiles_index[currentAnimation]].delete(vec2ToString);
                                console.log(this.Tiles[Tiles_index[currentAnimation]]);
                                console.log(currentAnimation, vec2ToString);
                            }
                            animatedSprite.animation.playIfNotAlready(this.currentMode, true);
                            this.Tiles[Tiles_index[this.currentMode]].add(vec2ToString);
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.currentMode, loop: false});
                        }    
                    }
                }
            }
        }
        
    }
}