import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MainMenu from "./MainMenu";
import { Layers_enum } from "../Utils/Layers_enum";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class Help extends Scene {

    public startScene(): void {
      this.addUILayer(Layers_enum.MENU);

      // Center the viewport
      const size = this.viewport.getHalfSize();
      let sizeY = size.y - 350;
      let sizeX = size.x - 250;
      const yOffset = 45;
      this.viewport.setFocus(size);
      this.viewport.setZoomLevel(1);

      // Create title
      const title = <Label>this.add.uiElement(UIElementType.LABEL, Layers_enum.MENU, {
          position: new Vec2(size.x, sizeY - 100),
          text: "TerraTiles",
      });

      // Create info text
      let i = 1;
      this.createLabel(
          "Developed by Timothy Sit, Tingting Chen-Deng, and Sungmin Joh",
          new Vec2(size.x, sizeY)
      );
      this.createLabel(
          "Wolfie2D created by Joe Weaver and Richard McKenna",
          new Vec2(size.x, sizeY + yOffset * i++)
      );
      sizeY += 130;
      this.createLabel(
          `Backstory`,
          new Vec2(size.x, sizeY + yOffset * i++)
      );
      this.createLabel(
          `Welcome to your new job. Your predecessor left quite a mess.`,
          new Vec2(size.x, sizeY + yOffset * i++)
      );
      this.createLabel(
          `You'll be given some time to learn your tools`,
          new Vec2(size.x, sizeY + yOffset * i++)
      );
      this.createLabel(
          `then you'll be tossed into the deep end of the pool.`,
          new Vec2(size.x, sizeY + yOffset * i++)
      );
      sizeY += 130;

      // Create cheat codes text
      this.createLabel("Cheat Codes", new Vec2(size.x, sizeY + yOffset * i++), 26);
      sizeY += 15;
      this.createLabel(
          "1-6: Change to level",
          new Vec2(size.x, sizeY + yOffset * i++)
      );
      this.createLabel(
          "Enter: enable mouse drag",
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
          halign: "left"
      });
  }
}