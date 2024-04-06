import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Timer from "../../Wolfie2D/Timing/Timer";
import Credit from "./Credit";
import Controls from "./Controls";
import { Layers_enum } from "../Utils/Layers_enum";
import LevelSelect from "./LevelSelect";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;

    public loadScene(){
		this.load.image("Menu", "Game_Resources/sprites/Main_Menu.png");

        // Load tile animations
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

        const credit = this.createButton("Credits", new Vec2(center.x, center.y + 100));

        credit.onClick = () => {
            this.sceneManager.changeToScene(Credit);
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
        this.load.keepImage("Menu");
        this.load.keepSpritesheet("tile_animations");
    }
}