import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { Layers_enum } from "./Utils/Layers_enum";
import Layer from "../../Wolfie2D/Scene/Layer";
import Test_Scene from "./Test_Scene";

export default class LevelSelect extends Scene {
    private mainMenu: Layer;

    public loadScene(): void {
    }

    public startScene(): void {

        const center = this.viewport.getCenter();

        
		this.addLayer(Layers_enum.BACK, 0);

		// Add in the background image
		let bg = this.add.sprite("Menu", Layers_enum.BACK);
		bg.scale.set(1, 1);
		bg.position.copy(this.viewport.getCenter());

        center.x += center.x/2;

        // The main menu
        this.mainMenu = this.addUILayer(Layers_enum.MENU);

        const level_1 = this.createButton("Level 1", new Vec2(center.x, center.y - 250));

        const level_2 = this.createButton("Level 2", new Vec2(center.x, center.y - 150));

        const level_3 = this.createButton("Level 3", new Vec2(center.x, center.y - 50));

        const level_4 = this.createButton("Level 4", new Vec2(center.x, center.y + 50));

        const level_5 = this.createButton("Level 5", new Vec2(center.x, center.y + 150));

        const level_6 = this.createButton("Level 6", new Vec2(center.x, center.y + 250));

        level_1.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        };
        level_2.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        };
        level_3.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        };
        level_4.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        };
        level_5.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        };
        level_6.onClick = () => {
            this.sceneManager.changeToScene(Test_Scene);
        };

        const back = this.createButton("Back", new Vec2(center.x, center.y + 350));

        // When the back button is clicked, go to the next scene
        back.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
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
}
