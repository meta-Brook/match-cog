import { ImageSource, Loader } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  Sword: new ImageSource("./images/sword.png"), // Vite public/ directory serves the root images
  Blue: new ImageSource("./images/element_blue_square.png"),
  Green: new ImageSource("./images/element_green_square.png"),
  Red: new ImageSource("./images/element_red_square.png"),
  Yellow: new ImageSource("./images/element_yellow_square.png"),
  Purple: new ImageSource("./images/element_purple_square.png"),
  Grey: new ImageSource("./images/element_grey_square.png"),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources. 
// So when you type Resources.Sword -> ImageSource

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
