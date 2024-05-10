import GameScene from "./GameScene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import { Layers_enum } from "../Utils/Layers_enum";
import Input from "../../Wolfie2D/Input/Input";
import Level_1 from "./Level_1";
import Level_2 from "./Level_2";
import Level_3 from "./Level_3";
import Level_4 from "./Level_4";
import Level_6 from "./Level_6";
import { LevelLock } from "../Utils/LevelLock";

export default class Level_5 extends GameScene {
    
    loadScene(): void {
        // load sfx (desert, dirt, fire, water, rock)
        super.loadScene();

        // load tilemap
        this.load.tilemap("level_5", "Game_Resources/tilemaps/lvl_5_7.json");
            // 5_1 -- center block
            // 5_2 -- ^ with half Xs
            // 5_3 -- ^ with a reduced center block; 85 min.
            // 5_4 -- 2 Xs
            // 5_5 -- 1 lopsided X
            // 5_6 -- reduced 5_3; 92/95 house min.
            // 5_7 -- ^ so the bottom houses are actually affected; 72/75 min.

        // load music, make sure the key is "level_music"
        this.load.audio("level_music", "Game_Resources/music/level5.mp3"); // temp
    }


    update(deltaT: number): void {
        // cheats
        if (Input.isKeyPressed('1')) {
            this.sceneManager.changeToScene(Level_1);
        } else if (Input.isKeyPressed('2')) {
            this.sceneManager.changeToScene(Level_2);
        } else if (Input.isKeyPressed('3')) {
            this.sceneManager.changeToScene(Level_3);
        } else if (Input.isKeyPressed('4')) {
            this.sceneManager.changeToScene(Level_4);
        } else if (Input.isKeyPressed('6')) {
            this.sceneManager.changeToScene(Level_6);
        } else if (Input.isKeyPressed('m')) {
            this.sceneManager.changeToScene(Level_5);
        }

        // fulfilled objectives
        if (this.nextlevel == true){
            LevelLock[5] = 1;
            this.sceneManager.changeToScene(Level_6)
        }

        // proceed
        super.update(deltaT);
    }


    startScene(): void {
        // music, events, ui
        super.startScene();

        // level_5 tilemap
        this.addLayer(Layers_enum.TILES, 10);
        this.add.tilemap("level_5");
        let tilelayer = this.getLayer(Layers_enum.TILES);
        let tile_arr = tilelayer.getItems();

        // initialize sets for different types of tiles
        for (let i = 0; i < tile_arr.length; i++) {
            let tile_sprite = <AnimatedSprite>tile_arr[i];

            // level_5 starts with houses, grass, dirt, desert, disease, mud 
            if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.HOUSE) {
                this.Tiles[Tiles_index[Tiles_string.HOUSE]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.GRASS) {
                this.Tiles[Tiles_index[Tiles_string.GRASS]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.DIRT) {
                this.Tiles[Tiles_index[Tiles_string.DIRT]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.DISEASE) {
                this.Tiles[Tiles_index[Tiles_string.DISEASE]].add(this.vec2ToString(tile_arr[i].position));
            }
        }

        this.objectives_bar.haveHouse(100);
        // this.objectives_bar.NoDisease(this.Tiles[Tiles_index[Tiles_string.DISEASE]].size);
        this.objectives_bar.reachTime(30, false);
    }


 
}