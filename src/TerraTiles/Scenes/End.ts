import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { Layers_enum } from "../Utils/Layers_enum";
import Splash from "./Splash";

export default class End extends Scene {

    public loadScene(): void {
		this.load.spritesheet("planet", "Game_Resources/sprites/terraform.json");        

        this.load.audio("you won!", "Game_Resources/sounds/you won!.mp3");
    }

    
    startScene(): void {
        const center = this.viewport.getCenter();

        this.addUILayer(Layers_enum.BACK);

        // animation
        let planet = this.add.animatedSprite(AnimatedSprite, "planet", Layers_enum.BACK)
        planet.position.set(center.x, center.y);
        planet.scale = new Vec2(6, 6);
        planet.animation.play("win_start");
        planet.animation.queue("win_still", true);

        // ui
        let size = this.viewport.getHalfSize();
        let fullScreen = <Button>this.add.uiElement(UIElementType.BUTTON, Layers_enum.BACK, {position: new Vec2(size.x, size.y * 3/2), text: "You Won!"});
        fullScreen.backgroundColor = Color.TRANSPARENT;
        fullScreen.borderColor = Color.WHITE;
        fullScreen.borderRadius = 0;
        fullScreen.setPadding(new Vec2(size.x, size.y * 3/2)); // with pos at center and padding at halfviewport, that puts everything inside the button        

        // When the play button is clicked, go to the menu
        fullScreen.onClick = () => {
            this.sceneManager.changeToScene(Splash);
        }        

        // sfx
        this.emitter.fireEvent(GameEventType.PLAY_SFX, {key: "you won!", loop: false});
    }


}