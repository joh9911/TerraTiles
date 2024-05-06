import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Controls from "./Controls";
import { Layers_enum } from "../Utils/Layers_enum";
import LevelSelect from "./LevelSelect";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Help from "./Help";
import Hints from "./Hints";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;

    public loadScene(){
        // load background
		this.load.image("Menu", "Game_Resources/sprites/Main_Menu.png");

        // Load cancel/no sound        
        this.load.audio("cancel", "Game_Resources/sounds/Cancel.mp3");

        // Load tile animations early
        this.load.spritesheet("tile_animations", "Game_Resources/tilemaps/tile_animations.json");
    }

    public startScene(){
        const center = this.viewport.getCenter();
        
		this.addLayer(Layers_enum.BACK, 0);

		// Add in the background image
		let bg = this.add.sprite("Menu", Layers_enum.BACK);
		bg.scale.set(1, 1);
		bg.position.copy(this.viewport.getCenter());

        center.x += center.x/2;

        // The main menu
        this.mainMenu = this.addUILayer(Layers_enum.MENU);

        const level_select = this.createButton("Level Select", new Vec2(center.x, center.y - 100));

        level_select.onClick = () => {
            this.sceneManager.changeToScene(LevelSelect);
        };

        const controls = this.createButton("Controls", new Vec2(center.x, center.y));

        controls.onClick = () => {
            this.sceneManager.changeToScene(Controls);
        };

        const credit = this.createButton("Help", new Vec2(center.x, center.y + 100));

        credit.onClick = () => {
            this.sceneManager.changeToScene(Help);
        };

        const help = this.createButton("Hints", new Vec2(center.x, center.y + 200));

        help.onClick = () => {
            this.sceneManager.changeToScene(Hints);
        };
    }

    private createButton(text: String, pos: Vec2): Button {
        let btn = <Button>this.add.uiElement(UIElementType.BUTTON, Layers_enum.MENU, {position: pos, text: text});
        btn.size.set(200, 50);
        btn.borderWidth = 2;
        btn.borderColor = Color.WHITE;
        btn.backgroundColor = Color.BLACK;
        return btn;
    }

    public unloadScene(): void {
        // easy traversal of menus
        this.load.keepImage("Menu");

        // used throughout the menus and levels
        this.load.keepAudio("cancel");
        this.load.keepAudio("level_music");

        // pre-load for levels
        this.load.keepSpritesheet("tile_animations");
    }
}