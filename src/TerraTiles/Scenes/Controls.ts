import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";
import { Layers_enum } from "../Utils/Layers_enum";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class Controls extends Scene{

    public startScene(): void {
      this.addUILayer(Layers_enum.MENU);

      // Center the viewport
      const size = this.viewport.getHalfSize();
      let sizeY = size.y - 250;
      const yOffset = 45;
      this.viewport.setFocus(size);
      this.viewport.setZoomLevel(1);

      // Create title
      const title = <Label>this.add.uiElement(UIElementType.LABEL, Layers_enum.MENU, {
          position: new Vec2(size.x, sizeY - 100),
          text: "Controls",
      });

      // Create info text
      let i = 1;
      this.createLabel(
          "Click: Place down tiles and select tiles",
          new Vec2(size.x, sizeY)
      );
      this.createLabel(
          "p: Pause the game",
          new Vec2(size.x, sizeY + yOffset * i++)
      );
      this.createLabel(
        "m: Restart the level",
        new Vec2(size.x, sizeY + yOffset * i++)
    );
      this.createLabel(
        "q, w, e, r, t: Another way to select tiles",
        new Vec2(size.x, sizeY + yOffset * i++)
      );
      this.createLabel(
        "Arrow keys: Change the current",
        new Vec2(size.x, sizeY + yOffset * i++)
      );
 

      // Create a back button
      const back = this.add.uiElement(UIElementType.BUTTON, Layers_enum.MENU, {position: new Vec2(size.x, 2 * size.y - 60), text: "Back"});
      back.size.set(200, 50);
      back.borderWidth = 2;
      back.borderColor = Color.WHITE;
      back.backgroundColor = Color.BLACK;

      // When the back button is clicked, go to the next scene
      back.onClick = () => {
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "cancel" , loop: false});
          this.sceneManager.changeToScene(MainMenu);
      };
  }

  private createLabel(text: string, pos: Vec2, size?: number): void {
      this.add.uiElement(UIElementType.LABEL, Layers_enum.MENU, {
          position: pos,
          text: text,
          fontSize: size || 18,
      });
  }
}