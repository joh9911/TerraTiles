import GameScene from "./GameScene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import { Layers_enum } from "../Utils/Layers_enum";
import Input from "../../Wolfie2D/Input/Input";
import Level_1 from "./Level_1";
import Level_2 from "./Level_2";
import Level_4 from "./Level_4";
import Level_5 from "./Level_5";
import Level_6 from "./Level_6";
import { LevelLock } from "../Utils/LevelLock";


export default class Level_3 extends GameScene {

    loadScene(): void {
        // load sfx (desert, dirt, fire, water, rock)
        super.loadScene();

        // load tilemap
        this.load.tilemap("level_3", "Game_Resources/tilemaps/lvl_3.json");

        // load music, make sure the key is "level_music"
        this.load.audio("level_music", "Game_Resources/music/level3.mp3"); // temp
        
    }


    update(deltaT: number): void {
        // cheats
        if (Input.isKeyPressed('1')) {
            this.sceneManager.changeToScene(Level_1);
        } else if (Input.isKeyPressed('2')) {
            this.sceneManager.changeToScene(Level_2);
        } else if (Input.isKeyPressed('4')) {
            this.sceneManager.changeToScene(Level_4);
        } else if (Input.isKeyPressed('5')) {
            this.sceneManager.changeToScene(Level_5);
        } else if (Input.isKeyPressed('6')) {
            this.sceneManager.changeToScene(Level_6);
        } else if (Input.isKeyPressed('m')) {
            this.sceneManager.changeToScene(Level_3);
        }

        // fulfilled objectives
        if (this.nextlevel == true){
            LevelLock[3] = 1;
            this.sceneManager.changeToScene(Level_4)
        }

        // proceed
        super.update(deltaT);
    }


    startScene(): void {

        // music, events, ui
        super.startScene();

        // level_3 tilemap
        this.addLayer(Layers_enum.TILES, 10);
        this.add.tilemap("level_3");
        let tilelayer = this.getLayer(Layers_enum.TILES);
        let tile_arr = tilelayer.getItems();

        // initialize sets for different types of tiles
        for (let i = 0; i < tile_arr.length; i++) {
            let tile_sprite = <AnimatedSprite>tile_arr[i];

            // level_3 starts with houses, grass, mud, desert
            if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.HOUSE) {
                this.Tiles[Tiles_index[Tiles_string.HOUSE]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.GRASS) {
                this.Tiles[Tiles_index[Tiles_string.GRASS]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.MUD) {
                this.Tiles[Tiles_index[Tiles_string.MUD]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.DESERT) {
                this.Tiles[Tiles_index[Tiles_string.DESERT]].add(this.vec2ToString(tile_arr[i].position));
            }
        }

        this.objectives_bar.haveHouse(this.Tiles[Tiles_index[Tiles_string.HOUSE]].size);
        this.objectives_bar.NoMud(this.Tiles[Tiles_index[Tiles_string.MUD]].size);
        this.objectives_bar.NoDesert(this.Tiles[Tiles_index[Tiles_string.DESERT]].size);
    }

}