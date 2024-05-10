import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Scene from "../../Wolfie2D/Scene/Scene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Tiles_string, Tiles_index, TileMatrix, Tile_manage } from "../Utils/Tiles_enum";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import { Layers_enum } from "../Utils/Layers_enum";
import Color from "../../Wolfie2D/Utils/Color";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import TileManager from "../TileManager/TileManager";
import ObjectivesManager from "../ObjectivesBar/ObjectivesManager";
import { Objective_Event, Objective_mapping, Send_Objective_Event } from "../Utils/Objective_Event";
import MainMenu from "./MainMenu";
import { Keyboard_enum } from "../Utils/Keyboard_enum";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";


export default class GameScene extends Scene {

    // tile interactions
    protected Tiles: Set<String>[] = []; 
        // uses Tiles_index for array, so desert is 0, grass is 1, ...
        // changed Vec2 to String, because it can't compare between Vec2 objects when deleting tiles.
    protected TilesTimer: Map<String, number>[] = [];
    protected removeWaterPositions: Map<String, Map<string, Vec2>>;
    protected currentMode: string = Tiles_string.DESERT; // temporarily set the tile mode, default mode is DESERT
    protected waterdir: string = Tiles_string.W_UP; // temporarily set the tile mode, default mode is DESERT

    // ui
    protected pause: number;
    protected pause_box: Graphic
    protected abandon_world_button: Button
    protected unpause_button: Button
    protected see_world_button: Button
    protected tile_manager: TileManager
    protected tile_lengths: number[]
    protected objectives_bar: ObjectivesManager
    protected nextlevel: Boolean
    protected clicktilepos: Vec2
    protected cheat: Boolean
    protected cheat_enabled: Label
    protected locked_tiles: Boolean[] = null
    protected follow_mouse_box: Graphic

    // method for comparing tiles' positions
    vec2ToString(vec: Vec2): string {
        return `${vec.x}:${vec.y}`;
    }
    stringToVec2(s: String): Vec2 {
        const [x, y] = s.split(':').map(Number);
        return new Vec2(x, y);
    }



    growGrassFromDirt(deltaT: number) {

        for (let dirtTile of this.Tiles[Tiles_index[Tiles_string.DIRT]]) {
            let tileTimer = this.getTileTimer(Tiles_index[Tiles_string.DIRT], this.stringToVec2(dirtTile));
    
            // time to grow
            if (tileTimer <= 0) {
                this.initializeTileTimer(Tiles_index[Tiles_string.DIRT], this.stringToVec2(dirtTile), 3); 

                // get position
                let pos = this.stringToVec2(dirtTile);
                let vec2ToString = this.vec2ToString(pos);

                // get tile at this position
                let nodes = this.sceneGraph.getNodesAt(pos);
                for (let node of nodes) {
                    if (node instanceof AnimatedSprite) {
                        let animatedSprite = node as AnimatedSprite;

                        // double check -- is the tile at this position a dirt tile?
                        if (animatedSprite.animation.getcurrentAnimation().valueOf() == Tiles_string.DIRT) {
                            animatedSprite.animation.playIfNotAlready(Tiles_string.GRASS, true);
                            this.Tiles[Tiles_index[Tiles_string.GRASS]].add(vec2ToString);    
                            this.Tiles[Tiles_index[Tiles_string.DIRT]].delete(vec2ToString);                        
                            break;
                        }
                        // not a dirt tile, remove it from the set
                        this.Tiles[Tiles_index[Tiles_string.DIRT]].delete(vec2ToString);
                    }
                }
            }
            // adjust time
            else {
                tileTimer -= deltaT;
                this.initializeTileTimer(Tiles_index[Tiles_string.DIRT], this.stringToVec2(dirtTile), tileTimer);
            }
        }

    }



    spreadWater(deltaT: number) {
        [Tiles_string.W_UP, Tiles_string.W_DOWN, Tiles_string.W_LEFT, Tiles_string.W_RIGHT].forEach(waterType => {
            const newWaterTiles: Set<String> = new Set<String>();

            const direction = this.getWaterDirection(waterType);

            for (let waterTile of this.Tiles[Tiles_index[waterType]]) {
                let tileTimer = this.getTileTimer(Tiles_index[waterType], this.stringToVec2(waterTile));

                // time to spread water
                if (tileTimer <= 0) {
                    this.initializeTileTimer(Tiles_index[waterType], this.stringToVec2(waterTile), 3); 

                    // get positions
                    let originPos = this.stringToVec2(waterTile);
                    let newPos = new Vec2(originPos.x + direction.dx * 32, originPos.y + direction.dy * 32);
                    let vec2ToString = this.vec2ToString(newPos);

                    // get the tile at this new position
                    let nodes = this.sceneGraph.getNodesAt(newPos);
                    for (let node of nodes) {
                        if (node instanceof AnimatedSprite) {
                            let animated_sprite = node as AnimatedSprite;
                            let animation_string = animated_sprite.animation.getcurrentAnimation().valueOf();
                            if (TileMatrix[waterType][animation_string] === 1) {
                                // add water
                                animated_sprite.animation.playIfNotAlready(waterType, true);
                                newWaterTiles.add(vec2ToString);
                                // remove from old set 
                                this.Tiles[Tiles_index[animation_string]].delete(vec2ToString);
                                this.TilesTimer[Tiles_index[animation_string]].delete(vec2ToString);

                            }
                        }
                    }

                    const directions = [
                        { dx: 0, dy: -1 },
                        { dx: 1, dy: 0 },
                        { dx: 0, dy: 1 },
                        { dx: -1, dy: 0 }
                    ];

                    for (let {dx, dy} of directions) {

                        // get positions
                        let originPos = this.stringToVec2(waterTile);
                        let newPos = new Vec2(originPos.x + dx * 32, originPos.y + dy * 32);
                        let vec2ToString = this.vec2ToString(newPos);
    
                        // get the tile at this new position
                        let nodes = this.sceneGraph.getNodesAt(newPos);
                        for (let node of nodes) {
                            if (node instanceof AnimatedSprite){
                                let animated_sprite = node as AnimatedSprite;
                                let animation_string = animated_sprite.animation.getcurrentAnimation().valueOf();
    
                                if (animation_string == Tiles_string.DESERT) {
                                    animated_sprite.animation.playIfNotAlready(Tiles_string.DIRT, true);
                                    this.Tiles[Tiles_index[Tiles_string.DIRT]].add(vec2ToString);
                                    this.Tiles[Tiles_index[Tiles_string.DESERT]].delete(vec2ToString);
    
                                } 

                            }
                            
                        }
                        
                    }
                } 
                // adjust time
                else {
                    tileTimer -= deltaT;
                    this.initializeTileTimer(Tiles_index[waterType], this.stringToVec2(waterTile), tileTimer);
                }
            }

            // update water set
            this.Tiles[Tiles_index[waterType]] = new Set<String>([...this.Tiles[Tiles_index[waterType]], ...newWaterTiles]);
        });
    }

    getWaterDirection(waterType: string) {
        switch (waterType) {
            case Tiles_string.W_UP:
                return { dx: 0, dy: -1 };
            case Tiles_string.W_DOWN:
                return { dx: 0, dy: 1 };
            case Tiles_string.W_LEFT:
                return { dx: -1, dy: 0 };
            case Tiles_string.W_RIGHT:
                return { dx: 1, dy: 0 };
            default:
                return { dx: 0, dy: 0 }; 
        }
    }



    spreadDisease(deltaT: number) {
        const newDiseaseTiles: Set<String> = new Set<String>();

        for (let diseaseTile of this.Tiles[Tiles_index[Tiles_string.DISEASE]]) {
            let tileTimer = this.getTileTimer(Tiles_index[Tiles_string.DISEASE], this.stringToVec2(diseaseTile));

            // time to spread disease
            if (tileTimer <= 0) {
                this.initializeTileTimer(Tiles_index[Tiles_string.DISEASE], this.stringToVec2(diseaseTile), 3); 

                // disease spreads to diagonal positions
                const directions = [
                    { dx: 1, dy: 1 },
                    { dx: 1, dy: -1 },
                    { dx: -1, dy: 1 },
                    { dx: -1, dy: -1 }
                ];

                for (let {dx, dy} of directions) {

                    // get positions
                    let originPos = this.stringToVec2(diseaseTile);
                    let newPos = new Vec2(originPos.x + dx * 32, originPos.y + dy * 32);
                    let vec2ToString = this.vec2ToString(newPos);

                    // get the tile at this new position
                    let nodes = this.sceneGraph.getNodesAt(newPos);
                    for (let node of nodes) {
                        if (node instanceof AnimatedSprite) {
                            let animated_sprite = node as AnimatedSprite;
                            let animation_string = animated_sprite.animation.getcurrentAnimation().valueOf();

                            // can disease spread to this new position?
                            if (TileMatrix[Tiles_string.DISEASE][animation_string] === 1) {
                                // add disease
                                animated_sprite.animation.playIfNotAlready(Tiles_string.DISEASE, true);
                                newDiseaseTiles.add(vec2ToString);
                                // remove old tile
                                this.Tiles[Tiles_index[animation_string]].delete(vec2ToString);
                                this.TilesTimer[Tiles_index[animation_string]].delete(vec2ToString);
                            }
                        }
                    }
                }
            } 
            // adjust time
            else {
                tileTimer -= deltaT;
                this.initializeTileTimer(Tiles_index[Tiles_string.DISEASE], this.stringToVec2(diseaseTile), tileTimer);
            }
        }

        // update disease set
        this.Tiles[Tiles_index[Tiles_string.DISEASE]] = new Set<String>([...this.Tiles[Tiles_index[Tiles_string.DISEASE]], ...newDiseaseTiles]);
    }

    removeWaterTilesAboveRock(deltaT: number) {
        for (let rockTile of this.Tiles[Tiles_index[Tiles_string.ROCK]]) {
          const rockTilePos = this.stringToVec2(rockTile);
          let removeWaterTimer = this.getTileTimer(Tiles_index[Tiles_string.ROCK], rockTilePos);
          removeWaterTimer -= deltaT;
      
          if (removeWaterTimer <= 0) {
            let foundWaterTiles = false;
            [Tiles_string.W_UP, Tiles_string.W_DOWN, Tiles_string.W_LEFT, Tiles_string.W_RIGHT].forEach(waterType => {
              const direction = this.getWaterDirection(waterType);
              let currentPos = this.getRemoveWaterPosition(waterType, rockTilePos) || rockTilePos.clone();
      
              currentPos.x += (direction.dx * 32);
              currentPos.y += (direction.dy * 32);
              const currentTileKey = this.vec2ToString(currentPos);
              
      
              if (this.Tiles[Tiles_index[waterType]].has(currentTileKey)) {
                foundWaterTiles = true;
                const nodes = this.sceneGraph.getNodesAt(currentPos);
                for (let node of nodes) {
                  if (node instanceof AnimatedSprite) {
                    const animatedSprite = node as AnimatedSprite;
                    this.Tiles[Tiles_index[waterType]].delete(currentTileKey);
                    animatedSprite.animation.playIfNotAlready(Tiles_string.DESERT, true);
                    this.Tiles[Tiles_index[Tiles_string.DESERT]].add(currentTileKey);
      
                    this.TilesTimer[Tiles_index[waterType]].delete(currentTileKey);
                  }
                }
      
                this.saveRemoveWaterPosition(waterType, rockTilePos, currentPos);
              } else {
                
                this.deleteRemoveWaterPosition(waterType, rockTilePos);
              }
            });
            if (!foundWaterTiles){
                this.TilesTimer[Tiles_index[Tiles_string.ROCK]].delete(this.vec2ToString(rockTilePos));
                this.Tiles[Tiles_index[Tiles_string.ROCK]].delete(this.vec2ToString(rockTilePos));
            }
            this.initializeTileTimer(Tiles_index[Tiles_string.ROCK], rockTilePos, 1);
          } else {
            this.initializeTileTimer(Tiles_index[Tiles_string.ROCK], rockTilePos, removeWaterTimer);
          }
        }
      }
      
      saveRemoveWaterPosition(waterType: String, rockTilePos: Vec2, currentPos: Vec2) {
        if (!this.removeWaterPositions) {
          this.removeWaterPositions = new Map<String, Map<string, Vec2>>();
        }
        let directionMap = this.removeWaterPositions.get(waterType);
        if (!directionMap) {
            directionMap = new Map<string, Vec2>();
            this.removeWaterPositions.set(waterType, directionMap);
            
        } 

        // Add the rock position and corresponding water position to the inner map
        directionMap.set(this.vec2ToString(rockTilePos), currentPos);
        this.removeWaterPositions.set(waterType, directionMap)
      }
      
      getRemoveWaterPosition(waterType: String, rockTilePos: Vec2): Vec2 | undefined {
        if (!this.removeWaterPositions) {
            this.removeWaterPositions = new Map<String, Map<string, Vec2>>();
          }
        if (!this.removeWaterPositions.get(waterType)) {
          return undefined;
        }
        return this.removeWaterPositions.get(waterType).get(this.vec2ToString(rockTilePos));
      }
      
      deleteRemoveWaterPosition(waterType: String, rockTilePos: Vec2) {
        if (!this.removeWaterPositions) {
            this.removeWaterPositions = new Map<String, Map<string, Vec2>>();
          }
        if (this.removeWaterPositions.get(waterType)) {
          this.removeWaterPositions.get(waterType).delete(this.vec2ToString(rockTilePos));
        }
      }
    
    

    spreadFire(deltaT: number) {
        const newFireTiles: Set<String> = new Set<String>();
        for (let fireTile of this.Tiles[Tiles_index[Tiles_string.FIRE]]) {
            let tileTimer = this.getTileTimer(Tiles_index[Tiles_string.FIRE], this.stringToVec2(fireTile));

            // adjust time
            tileTimer -= deltaT;

            // fire spreads
            if (tileTimer <= 2 && tileTimer + deltaT > 2 ) {

                // fire moves to adjacent tiles
                const directions = [
                    { dx: 0, dy: -1 },
                    { dx: 1, dy: 0 },
                    { dx: 0, dy: 1 },
                    { dx: -1, dy: 0 }
                ];

                for (let {dx, dy} of directions) {

                    // get positions
                    let originPos = this.stringToVec2(fireTile);
                    let newPos = new Vec2(originPos.x + dx * 32, originPos.y + dy * 32);
                    let vec2ToString = this.vec2ToString(newPos);

                    // get the tile at this new position
                    let nodes = this.sceneGraph.getNodesAt(newPos);
                    for (let node of nodes) {
                        if (node instanceof AnimatedSprite){
                            let animated_sprite = node as AnimatedSprite;
                            let animation_string = animated_sprite.animation.getcurrentAnimation().valueOf();

                            // fire + mud = dirt
                            if (animation_string == Tiles_string.MUD) {
                                animated_sprite.animation.playIfNotAlready(Tiles_string.DIRT, true);
                                this.Tiles[Tiles_index[Tiles_string.DIRT]].add(vec2ToString);
                                this.Tiles[Tiles_index[Tiles_string.MUD]].delete(vec2ToString);

                            } 
                            // fire + (grass, house, disease) = fire
                            else if (animation_string == Tiles_string.GRASS
                                    || animation_string == Tiles_string.HOUSE
                                    || animation_string == Tiles_string.DISEASE
                            ) {
                                animated_sprite.animation.playIfNotAlready(Tiles_string.FIRE, true);
                                newFireTiles.add(vec2ToString);
                                this.Tiles[Tiles_index[animation_string]].delete(vec2ToString);

                            } 
                        }
                    }
                }
            }
    
            // fire goes out, leaves behind desert
            if (tileTimer <= 0) {
                let nodes = this.sceneGraph.getNodesAt(this.stringToVec2(fireTile));
                for (let node of nodes) {
                    if (node instanceof AnimatedSprite) {
                        let animated_sprite = node as AnimatedSprite;
                        animated_sprite.animation.playIfNotAlready(Tiles_string.DESERT, true);
                        this.Tiles[Tiles_index[Tiles_string.DESERT]].add(fireTile);
                        this.Tiles[Tiles_index[Tiles_string.FIRE]].delete(fireTile);
                        this.TilesTimer[Tiles_index[Tiles_string.FIRE]].delete(fireTile);
                    }
                }
                
            } 
            // adjust time
            else {
                this.initializeTileTimer(Tiles_index[Tiles_string.FIRE], this.stringToVec2(fireTile), tileTimer);
            }
        } // per fireTile
        
        // update fire set
        this.Tiles[Tiles_index[Tiles_string.FIRE]] = new Set<String>([...this.Tiles[Tiles_index[Tiles_string.FIRE]], ...newFireTiles]);
    }


    initializeTileTimer(tileType: number, tilePos: Vec2, countdown: number) {
        const tileKey = this.vec2ToString(tilePos);
        if (!this.TilesTimer[tileType]) {
            this.TilesTimer[tileType] = new Map<String, number>();
        }
        this.TilesTimer[tileType].set(tileKey, countdown);
    }

    getTileTimer(tileType: number, tilePos: Vec2): number {
        const tileKey = this.vec2ToString(tilePos);
        if (tileType == Tiles_index[Tiles_string.FIRE])
            return this.TilesTimer[tileType]?.get(tileKey) || 5;  
        else if (tileType == Tiles_index[Tiles_string.W_UP] || tileType == Tiles_index[Tiles_string.W_DOWN] || tileType == Tiles_index[Tiles_string.W_LEFT] || tileType == Tiles_index[Tiles_string.W_RIGHT])
            return this.TilesTimer[tileType]?.get(tileKey) || 2; 
        else if (tileType == Tiles_index[Tiles_string.ROCK])
            return this.TilesTimer[tileType]?.get(tileKey) || 1; 
        else
            return this.TilesTimer[tileType]?.get(tileKey) || 3; 
    }

    update_tile_lengths(){
        for (let value = 0; value < Object.keys(Objective_Event).length - 3; value++){
            if (Send_Objective_Event[value]){
                if (this.Tiles[value].size != this.tile_lengths[value]){
                    this.tile_lengths[value] = this.Tiles[value].size
                    this.emitter.fireEvent(Objective_mapping[value], {size: this.tile_lengths[value]});//If size changed, fire event
                    //and then send the event to say size has changed
                }
            }
        }
        // for (const value in Object.values(Tiles_index)){
        //     if (this.Tiles[value].size != this.tile_lengths[value]){
        //         this.tile_lengths[value] = this.Tiles[value].size
        //         this.emitter.fireEvent(Objective_mapping[value], {size: this.tile_lengths[value]});//If size changed, fire event
        //         //and then send the event to say size has changed
        //     }
        // }
    }

    clear_send_objectives() {
        for (let i = 0; i < Send_Objective_Event.length; i++){
            Send_Objective_Event[i] = 0;
        }
    }

    protected subscribeToEvents(){
        this.receiver.subscribe([
            Tiles_string.DESERT,
            Tiles_string.DIRT,
            Tiles_string.FIRE,
            Tiles_string.W_UP,
            Tiles_string.W_LEFT,
            Tiles_string.W_RIGHT,
            Tiles_string.W_DOWN,
            Tiles_string.ROCK,
            Objective_Event.NEXTLEVEL,
        ]);
    }

    createButton(text: String, pos: Vec2, func: Function): Button {
        let btn = <Button>this.add.uiElement(UIElementType.BUTTON, Layers_enum.PAUSEBUTTON, {position: pos, text: text});
        btn.size.set(300, 50);
        btn.borderWidth = 2;
        btn.borderColor = Color.WHITE;
        btn.backgroundColor = Color.BLACK;
        btn.visible = false;
        btn.onClick = func;
        return btn;
    }


    startScene(): void {
        // music
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "level_music", loop: true, holdReference: true});
        

        // tile placement, next level
        this.subscribeToEvents();

        // ui
        this.addLayer(Layers_enum.MENU, 10);
        this.addLayer(Layers_enum.BACK, 9);
        this.addLayer(Layers_enum.TILEMANAGER, 10);
        this.addLayer(Layers_enum.BOXONMANAGER, 11);
        this.addLayer(Layers_enum.TILEONMANAGER, 12);
        this.addLayer(Layers_enum.PAUSE, 100);
        this.addLayer(Layers_enum.PAUSEBUTTON, 101);

        if (this.locked_tiles == null){
            this.locked_tiles = [true, true, true, true, true]
        }
        this.tile_manager = new TileManager(this, this.currentMode, this.locked_tiles)
        this.objectives_bar = new ObjectivesManager(this)

        Object.keys(Tiles_index).forEach(key => {
            const index = Tiles_index[key];
            this.Tiles[index] = new Set();
            this.TilesTimer[index] = new Map<String, number>();
        });

        // pause screen
        this.pause = 0;
        this.pause_box = this.add.graphic(GraphicType.RECT, Layers_enum.PAUSE, {
            position: new Vec2(640, 640),
            size: new Vec2(1280, 1280),
        });
        this.pause_box.color = Color.BLACK;
        this.pause_box.visible = false;
        this.abandon_world_button = this.createButton("Abandon World?", new Vec2(640, 640), () =>{
            this.sceneManager.changeToScene(MainMenu);
        });
        this.see_world_button = this.createButton("See your world?", new Vec2(1100, 160), () =>{
            this.tile_manager.pause();
            if (this.pause == 2){
                this.pause = 1;
                this.pause_box.visible = true;
                this.abandon_world_button.visible = true;
                this.unpause_button.visible = true;
                this.see_world_button.text = "See your world?"
            }
            else {
                this.pause = 2;
                this.pause_box.visible = false;
                this.abandon_world_button.visible = false;
                this.unpause_button.visible = false;
                this.see_world_button.text = "Unsee your world"
            }
        });
        this.unpause_button = this.createButton("Return to World", new Vec2(640, 580), () =>{
            this.tile_manager.pause();
            this.pause = 0;
            this.pause_box.visible = false;
            this.abandon_world_button.visible = false;
            this.unpause_button.visible = false;
            this.see_world_button.visible = false;
            this.emitter.fireEvent(Objective_Event.TIMER, {pause: this.pause});
        });
        this.follow_mouse_box = this.add.graphic(GraphicType.RECT, Layers_enum.TILEONMANAGER, {
            position: new Vec2(-100, -100),
            size: new Vec2(32, 32),
        });
        // this.follow_mouse_box.color = Color.RED
        this.nextlevel = false;
        this.clicktilepos = new Vec2(-1, -1);
        this.cheat = false
        this.cheat_enabled = <Label>this.add.uiElement(UIElementType.LABEL, Layers_enum.BOXONMANAGER, {
            position: new Vec2(1100, 105),
            text: "Cheats Enabled"
        });
        this.cheat_enabled.visible = false;
        this.tile_lengths = []
        for (const value in Object.values(Tiles_index)){
                this.tile_lengths[value] = this.Tiles[value].size
        }
        this.clear_send_objectives();
    }
    
    
    
    updateScene(deltaT: number): void {
        // next level?
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            if (event.type == Objective_Event.NEXTLEVEL){
                this.nextlevel = true
                this.emitter.fireEvent(GameEventType.PLAY_SFX, {key: "progress", loop: false});
                continue;
            }
            this.currentMode = event.type;
        }

        this.objectives_bar.update()//moved before pause logic because timer needs to get whether to pause or not from receiver

        // pause
        if (Input.isKeyJustPressed('p') === true){
            if (this.pause == 2){
                this.see_world_button.text = "See your world?"
            }
            else{
                this.tile_manager.pause();
            }
            if (this.pause){
                this.pause = 0;
                this.pause_box.visible = false;
                this.abandon_world_button.visible = false;
                this.see_world_button.visible = false;
                this.unpause_button.visible = false;
            }
            else{
                this.pause = 1;
                this.pause_box.visible = true;
                this.abandon_world_button.visible = true;
                this.see_world_button.visible = true;
                this.unpause_button.visible = true;
            }
            if (Send_Objective_Event[15]){
                this.emitter.fireEvent(Objective_Event.TIMER, {pause: this.pause});
            }
        }
        if (this.pause == 1){
            return;
        }
        
        // keyboard shortcuts for tile additions     
        for (const [key, value] of Object.entries(Tile_manage)){
            if (this.locked_tiles[value] && Input.isKeyJustPressed(Keyboard_enum[value])){
                this.emitter.fireEvent(key);
            }
        }
        if (Input.isKeyJustPressed("enter")) {
            this.cheat = !this.cheat;
            this.cheat_enabled.visible = <boolean>this.cheat;
        }
        let waterdir_changed = false;
        if (Input.isKeyJustPressed("arrowup")) {
            this.waterdir = Tiles_string.W_UP
            waterdir_changed = true
        }
        if (Input.isKeyJustPressed("arrowdown")) {
            this.waterdir = Tiles_string.W_DOWN
            waterdir_changed = true
        }
        if (Input.isKeyJustPressed("arrowleft")) {
            this.waterdir = Tiles_string.W_LEFT
            waterdir_changed = true
        }
        if (Input.isKeyJustPressed("arrowright")) {
            this.waterdir = Tiles_string.W_RIGHT
            waterdir_changed = true
        }
        if (waterdir_changed){
            this.tile_manager.changeanimation(this.waterdir)
        }

        this.tile_manager.update(this.currentMode)

        waterdir_changed = false
        if (this.currentMode == Tiles_string.W_UP){
            waterdir_changed = true;
            this.currentMode = this.waterdir;
        }


        const pos = Input.getGlobalMousePosition();
        const teX = Math.floor(pos.x / 32) * 32 + 16;  
        const teY = Math.floor(pos.y / 32) * 32 + 16;
        const tPos = new Vec2(teX, teY);
        const nodes = this.sceneGraph.getNodesAt(tPos);
        for (let node of nodes) {
            if (node instanceof AnimatedSprite) {
                const animatedSprite = node as AnimatedSprite;
                const currentAnimation = animatedSprite.animation.getcurrentAnimation();

                this.follow_mouse_box.position = tPos;
                if (TileMatrix[this.currentMode][currentAnimation]) {
                    (<Rect>this.follow_mouse_box).setBorderColor(Color.GREEN);
                    this.follow_mouse_box.color = Color.GREEN;
                }
                else {
                    (<Rect>this.follow_mouse_box).setBorderColor(Color.RED);
                    this.follow_mouse_box.color = Color.RED;
                }
                this.follow_mouse_box.alpha = 0.2;
            }
        }


        if (this.cheat && Input.isMousePressed()) {
            const position = Input.getGlobalMousePosition();
            if (position.y > 1088){ // in the tile select, so don't do add a tile
                return;
            }


            // get the tile at this position
            const tileX = Math.floor(position.x / 32) * 32 + 16;  
            const tileY = Math.floor(position.y / 32) * 32 + 16;  
            const tilePos = new Vec2(tileX, tileY);
            if (tilePos == this.clicktilepos){//means not on new tile
                return;
            } 
            const vec2ToString = this.vec2ToString(tilePos);
            const nodes = this.sceneGraph.getNodesAt(tilePos);


        
            for (let node of nodes) {
                if (node instanceof AnimatedSprite) {
                    const animatedSprite = node as AnimatedSprite;
                    const currentAnimation = animatedSprite.animation.getcurrentAnimation();

                    // can you actually change this tile?
                    if (TileMatrix[this.currentMode][currentAnimation]) {

                        // remove old tile
                        if (currentAnimation != Tiles_string.COMET && currentAnimation != Tiles_string.SPACE){
                            this.Tiles[Tiles_index[currentAnimation]].delete(vec2ToString);
                        }
                        else if (Send_Objective_Event[14]){//this means land was made from comet/space
                            this.emitter.fireEvent(Objective_Event.LANDMADE);
                        }
                        animatedSprite.animation.playIfNotAlready(this.currentMode, true);
                        this.Tiles[Tiles_index[this.currentMode]].add(vec2ToString);


                        // monitor number of tiles, play sfx  
                        if (Send_Objective_Event[Tiles_index[this.currentMode]]){        
                            this.emitter.fireEvent(Object.values(Objective_Event)[Tiles_index[this.currentMode]], {size: this.Tiles[Tiles_index[this.currentMode]].size});//If we click we change the size. We still need to fire event for regular spreading.
                        }
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.currentMode , loop: false});
                    }    

                }
                
            }
        }
        else if (Input.isMouseJustPressed()){
            const position = Input.getGlobalMousePosition();
            if (position.y > 1088){ // in the tile select, so don't do add a tile
                return;
            }


            // get the tile at this position
            const tileX = Math.floor(position.x / 32) * 32 + 16;  
            const tileY = Math.floor(position.y / 32) * 32 + 16;  
            const tilePos = new Vec2(tileX, tileY);
            const vec2ToString = this.vec2ToString(tilePos);
            const nodes = this.sceneGraph.getNodesAt(tilePos);


        
            for (let node of nodes) {
                if (node instanceof AnimatedSprite) {
                    const animatedSprite = node as AnimatedSprite;
                    const currentAnimation = animatedSprite.animation.getcurrentAnimation();

                    // can you actually change this tile?
                    if (TileMatrix[this.currentMode][currentAnimation]) {

                        

                        // remove old tile
                        if (currentAnimation != Tiles_string.COMET && currentAnimation != Tiles_string.SPACE){
                            this.Tiles[Tiles_index[currentAnimation]].delete(vec2ToString);
                        }
                        else if (Send_Objective_Event[14]){//this means land was made from comet/space
                            this.emitter.fireEvent(Objective_Event.LANDMADE);
                        }
                        animatedSprite.animation.playIfNotAlready(this.currentMode, true);
                        this.Tiles[Tiles_index[this.currentMode]].add(vec2ToString);

                        // if (currentAnimation == Tiles_string.W_UP || currentAnimation == Tiles_string.W_DOWN || currentAnimation == Tiles_string.W_LEFT || currentAnimation == Tiles_string.W_RIGHT){
                        //     const tilePos = new Vec2(tileX, tileY - 32);
                        //     const connectedTilePos = this.vec2ToString(tilePos);
                        //     this.connectedWaterTiles.set(vec2ToString, connectedTilePos);
                        // }

                        // monitor number of tiles, play sfx                        
                        if (Send_Objective_Event[Tiles_index[this.currentMode]]){        
                            this.emitter.fireEvent(Object.values(Objective_Event)[Tiles_index[this.currentMode]], {size: this.Tiles[Tiles_index[this.currentMode]].size});//If we click we change the size. We still need to fire event for regular spreading.
                        }
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.currentMode , loop: false});
                    }    

                }
                
            }
        }
        if (waterdir_changed){
            this.currentMode = Tiles_string.W_UP
        }

        if (this.pause == 2){
            return;
        }
        // update timed elements
        super.updateScene(deltaT);
        this.removeWaterTilesAboveRock(deltaT);
        // this.spreadSpace(deltaT);
        this.spreadFire(deltaT);
        this.spreadWater(deltaT);
        this.spreadDisease(deltaT);
        this.growGrassFromDirt(deltaT);
        this.update_tile_lengths();
    }

    loadScene(): void {
        // load all sfx
        this.load.audio(Tiles_string.DESERT, "Game_Resources/sounds/Desert.mp3");
        this.load.audio(Tiles_string.DIRT, "Game_Resources/sounds/dirt_temp.mp3");
        this.load.audio(Tiles_string.FIRE, "Game_Resources/sounds/Fire.mp3");
        this.load.audio(Tiles_string.W_UP, "Game_Resources/sounds/Water.mp3");
        this.load.audio(Tiles_string.W_DOWN, "Game_Resources/sounds/Water.mp3");
        this.load.audio(Tiles_string.W_RIGHT, "Game_Resources/sounds/Water.mp3");
        this.load.audio(Tiles_string.W_LEFT, "Game_Resources/sounds/Water.mp3");
        this.load.audio(Tiles_string.ROCK, "Game_Resources/sounds/Rock.mp3");
        this.load.audio("progress", "Game_Resources/sounds/progress.mp3");
    }

    unloadScene(): void {
        // stop music
        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "level_music" });
    }


}