import { Actor, Collider, CollisionContact, Engine, Side, Vector} from "excalibur";
import { Gameboard } from "./gameboard"
import { Resources } from "../resources";
import { TILE_SIZE } from "../utils/config"

// Actors are the main unit of composition you'll likely use, anything that you want to draw and move around the screen
// is likely built with an actor

// They contain a bunch of useful components that you might use
// actor.transform
// actor.motion
// actor.graphics
// actor.body
// actor.collider
// actor.actions
// actor.pointer

export const colorKeys = ["Blue", "Green", "Red", "Yellow", "Purple", "Grey"] as const;

export class Gem extends Actor {
  public gemColor: (typeof colorKeys)[number];
  public row: number;
  public col: number;
  public gameboard:Gameboard;
  public remove: boolean;
  
  
  constructor(gameboard: Gameboard) {
    super({
      name: 'Gem',
    
    });
    
    
    this.gameboard = gameboard;
    this.gemColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    this.row = 0;
    this.col = 0;
    this.remove = false;

  }

  override onInitialize() {
    // Generally recommended to stick logic in the "On initialize"
    // This runs before the first update
    // Useful when
    // 1. You need things to be loaded like Images for graphics
    // 2. You need excalibur to be initialized & started 
    // 3. Deferring logic to run time instead of constructor time
    // 4. Lazy instantiation
    
     
    this.graphics.use(Resources[this.gemColor].toSprite());

    this.pos.x = this.col * TILE_SIZE;
    this.pos.y = this.row * TILE_SIZE;

    // Actions are useful for scripting common behavior, for example patrolling enemies

    // Sometimes you want to click on an actor!
   
// subscribe to pointerdown event
    this.on("pointerdown", (evt) =>{
      this.gameboard.gemClick(this);
      console.log('pd');
  
});
  }


  setGrid(row:number, col:number){
    this.row = row;
    this.col = col;
    let vect = new Vector (col * TILE_SIZE , row * TILE_SIZE)

    this.actions.moveTo(vect,200)

  }
  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame after Actor builtins
  }

  override onPreCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called before a collision is resolved, if you want to opt out of this specific collision call contact.cancel()
  }

  override onPostCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called every time a collision is resolved and overlap is solved
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called when a pair of objects are in contact
  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    // Called when a pair of objects separates
  }
}
