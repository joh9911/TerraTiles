import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Timer from "../../Wolfie2D/Timing/Timer";
import MainMenu from "./MainMenu";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { Layers_enum } from "../Utils/Layers_enum";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Splash extends Scene {    

    public loadScene() {
		this.load.spritesheet("planet", "Game_Resources/sprites/terraform.json");
    }

    public startScene(): void {
        const center = this.viewport.getCenter();

        this.addUILayer(Layers_enum.BACK);

        let size = this.viewport.getHalfSize();
        let planet = this.add.animatedSprite(AnimatedSprite, "planet", Layers_enum.BACK)
        planet.position.set(center.x, center.y);
        planet.scale = new Vec2(6, 6);
        planet.animation.play("START");
        planet.animation.queue("LOOP", true);

        let fullScreen = <Button>this.add.uiElement(UIElementType.BUTTON, Layers_enum.BACK, {position: new Vec2(size.x, size.y * 3/2), text: "Click on screen to start"});
        fullScreen.backgroundColor = Color.TRANSPARENT;
        fullScreen.borderColor = Color.WHITE;
        fullScreen.borderRadius = 0;
        fullScreen.setPadding(new Vec2(size.x, size.y * 3/2)); // with pos at center and padding at halfviewport, that puts everything inside the button
        
        // When the play button is clicked, go to the next scene
        fullScreen.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        }
    }

}
