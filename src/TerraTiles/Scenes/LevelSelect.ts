import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { Layers_enum } from "../Utils/Layers_enum";
import Layer from "../../Wolfie2D/Scene/Layer";
import Level_1 from "./Level_1";
import Level_2 from "./Level_2";
import Level_3 from "./Level_3";
import Level_4 from "./Level_4";
import Level_5 from "./Level_5";
import Level_6 from "./Level_6";
import { LevelLock } from "../Utils/LevelLock";
import Input from "../../Wolfie2D/Input/Input";

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

        let levels = [];
        let yOffset = center.y - 350;
        // The main menu
        this.mainMenu = this.addUILayer(Layers_enum.MENU);
        let unlock = this.createButton("Unlock all levels", new Vec2(center.x, yOffset));
        unlock.size = new Vec2(300, 50);
        yOffset += 100;
        unlock.onClick = () => {
            for (let i = 0; i < 6; i++){
                LevelLock[i] = 1;
            }
            this.sceneManager.changeToScene(LevelSelect);
        }
        let i = 0;
        let levels_array = [Level_1, Level_2, Level_3, Level_4, Level_5, Level_6];
        for (let level of LevelLock){
            if (level){
                    console.log(i);
                levels[i] = this.createButton("Level " + (i+1), new Vec2(center.x, yOffset));
                levels[i].onClick = ((index) => {  // Create a closure with the current value of i
                    return () => {
                        this.sceneManager.changeToScene(levels_array[index]);
                    };
                })(i);
            }
            else{
                levels[i] = this.createButton("Locked", new Vec2(center.x, yOffset));
            }
            yOffset += 100;
            i++;
        }

        const back = this.createButton("Back", new Vec2(center.x, center.y + 350));

        // When the back button is clicked, go to the next scene
        back.onClick = () => {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "cancel" , loop: false});
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
