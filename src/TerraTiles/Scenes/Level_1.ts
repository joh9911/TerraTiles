import GameScene from "./GameScene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import { Layers_enum } from "../Utils/Layers_enum";
import { SoundEvent } from "../Utils/SoundEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import TileManager from "../TileManager/TileManager";
import { Objective_Event } from "../Utils/Objective_Event";
import Level_2 from "./Level_2";

export default class Level_1 extends GameScene {

    loadScene(): void {
        // load sfx (desert, dirt, fire, water, rock)
        super.loadScene();

        // load tilemap
        this.load.tilemap("level_1", "Game_Resources/tilemaps/lvl_1.json");

        // load music, make sure the key is "level_music"
        this.load.audio("level_music", "Game_Resources/music/level1.mp3");
    }


    update(deltaT: number): void {
        if (this.nextlevel == true){
            this.sceneManager.changeToScene(Level_2)
        }
        super.update(deltaT);
    }


    startScene(): void {

        // music, events, ui
        super.startScene();

        console.log(this.Tiles);

        // level_1 tilemap
        this.addLayer(Layers_enum.TILES, 10);
        this.add.tilemap("level_1");
        let tilelayer = this.getLayer(Layers_enum.TILES);
        console.log(tilelayer);

        // initialize sets for different types of tiles
        console.log("레벨 초기화")
        let tile_arr = tilelayer.getItems();
        for (let i = 0; i < tile_arr.length; i++) {
            let tile_sprite = <AnimatedSprite>tile_arr[i];

            // level_1 starts with desert
            if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.DESERT) {
                this.Tiles[Tiles_index[Tiles_string.DESERT]].add(this.vec2ToString(tile_arr[i].position));
            }
        }

    }

}