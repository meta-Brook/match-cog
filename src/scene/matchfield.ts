import { DefaultLoader, Engine, ExcaliburGraphicsContext, Scene, SceneActivationContext } from "excalibur";
import { Gameboard } from "../actor/gameboard";
import { xsize,ysize } from "../utils/config";

export class Matchfield extends Scene {
    override onInitialize(engine: Engine): void {
        // Scene.onInitialize is where we recommend you perform the composition for your game
        console.log('board');

        let gameboard = new Gameboard(xsize,ysize);

        this.repositonGameboard(gameboard,engine);

        this.add(gameboard);

        engine.on('resize',() => {
            this.repositonGameboard(gameboard,engine);
        })
       

    
        

    }

    private repositonGameboard(gameboard:Gameboard,engine:Engine) {
        const screenWidth = engine.drawWidth;
        const screenHeight = engine.drawHeight;
        gameboard.pos.x = (screenWidth - gameboard.width)/2;
        gameboard.pos.y = (screenHeight - gameboard.height)/2;
        console.log( screenWidth,screenHeight,gameboard.width,gameboard.height)
    }


    override onPreLoad(loader: DefaultLoader): void {
        // Add any scene specific resources to load
    }

 

    override onActivate(context: SceneActivationContext<unknown>): void {
        // Called when Excalibur transitions to this scene
        // Only 1 scene is active at a time
    }

    override onDeactivate(context: SceneActivationContext): void {
        // Called when Excalibur transitions away from this scene
        // Only 1 scene is active at a time
    }

    override onPreUpdate(engine: Engine, elapsedMs: number): void {
        // Called before anything updates in the scene
    }

    override onPostUpdate(engine: Engine, elapsedMs: number): void {
        // Called after everything updates in the scene
        
    }

    override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called before Excalibur draws to the screen
    }

    override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called after Excalibur draws to the screen
    }
}