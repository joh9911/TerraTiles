import GameScene from "./GameScene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import { Layers_enum } from "../Utils/Layers_enum";
import { SoundEvent } from "../Utils/SoundEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class Level1 extends GameScene {
    loadScene(): void {
        this.load.audio(Tiles_string.FIRE, "Game_Resources/sounds/Fire.mp3");
        this.load.tilemap("level1", "Game_Resources/tilemaps/lvl_1.json");
    }

    unloadScene() {}

    startScene(): void {
        super.startScene();
        console.log(this.Tiles);

        this.addLayer(Layers_enum.TILES, 10);
        this.add.tilemap("level1");
        let tilelayer = this.getLayer(Layers_enum.TILES);
        let tile_arr = tilelayer.getItems();
        console.log(tilelayer);

        this.roundTimer = 0;
        this.roundDelay = 3;

        console.log("레벨 초기화")
        for (let i = 0; i < tile_arr.length; i++) {
            let tile_sprite = <AnimatedSprite>tile_arr[i];
            if (tile_sprite.animation.getcurrentAnimation() == "DESERT_TUMBLE") {
                this.Tiles[Tiles_index[Tiles_string.DESERT]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == "FIRE_WAVE") {
                this.Tiles[Tiles_index[Tiles_string.FIRE]].add(this.vec2ToString(tile_arr[i].position));
            }
        }
    }

}