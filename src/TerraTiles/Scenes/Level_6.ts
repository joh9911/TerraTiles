import GameScene from "./GameScene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Tiles_index, Tiles_string } from "../Utils/Tiles_enum";
import { Layers_enum } from "../Utils/Layers_enum";
import MainMenu from "./MainMenu";

export default class Level_6 extends GameScene {

    loadScene(): void {
        // load sfx (desert, dirt, fire, water, rock)
        super.loadScene();

        // load tilemap
        this.load.tilemap("level_6", "Game_Resources/tilemaps/lvl_6.json");

        // load music, make sure the key is "level_music"
        // this.load.audio("level_music", "Game_Resources/music/???.mp3");
    }


    update(deltaT: number): void {
        if (this.nextlevel == true){
            this.sceneManager.changeToScene(MainMenu)
        }
        super.update(deltaT);
    }


    startScene(): void {
        // music, events, ui
        super.startScene();

        console.log(this.Tiles);

        // level_6 tilemap
        this.addLayer(Layers_enum.TILES, 10);
        this.add.tilemap("level_6");
        let tilelayer = this.getLayer(Layers_enum.TILES);
        let tile_arr = tilelayer.getItems();
        console.log(tilelayer);

        // initialize sets for different types of tiles
        console.log("레벨 초기화")
        for (let i = 0; i < tile_arr.length; i++) {
            let tile_sprite = <AnimatedSprite>tile_arr[i];

            // level_6 starts with houses, grass, desert
            if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.HOUSE) {
                this.Tiles[Tiles_index[Tiles_string.HOUSE]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.GRASS) {
                this.Tiles[Tiles_index[Tiles_string.GRASS]].add(this.vec2ToString(tile_arr[i].position));
            }
            else if (tile_sprite.animation.getcurrentAnimation() == Tiles_string.DESERT) {
                this.Tiles[Tiles_index[Tiles_string.DESERT]].add(this.vec2ToString(tile_arr[i].position));
            }
        }
    }

}