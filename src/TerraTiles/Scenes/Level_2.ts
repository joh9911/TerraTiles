import GameScene from "./GameScene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import { Layers_enum } from "../Utils/Layers_enum";
import Level_3 from "./Level_3";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class Level_2 extends GameScene {

    loadScene(): void {
        // load sfx (desert, dirt, fire, water, rock)
        super.loadScene();

        // load tilemap
        this.load.tilemap("level_2", "Game_Resources/tilemaps/lvl_2.json");

        // load music, make sure the key is "level_music"
        // this.load.audio("level_music", "Game_Resources/music/???.mp3");
    }


    update(deltaT: number): void {
        if (this.nextlevel === true){
            this.sceneManager.changeToScene(Level_3)
        }
        super.update(deltaT);
    }


    startScene(): void {

        // music, events, ui
        super.startScene();

        console.log(this.Tiles);

        // level_2 tilemap
        this.addLayer(Layers_enum.TILES, 10);
        this.add.tilemap("level_2");
        let tilelayer = this.getLayer(Layers_enum.TILES);
        console.log(tilelayer);

        // initialize sets for different types of tiles
        console.log("레벨 초기화")
        let tile_arr = tilelayer.getItems();
        for (let i = 0; i < tile_arr.length; i++) {
            let tile_sprite = <AnimatedSprite>tile_arr[i];

            // level_2 starts with houses, grass, fire
            if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.HOUSE) {
                this.Tiles[Tiles_index[Tiles_string.HOUSE]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.GRASS) {
                this.Tiles[Tiles_index[Tiles_string.GRASS]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.FIRE) {
                this.Tiles[Tiles_index[Tiles_string.FIRE]].add(this.vec2ToString(tile_arr[i].position));
            }
        }
    }

}