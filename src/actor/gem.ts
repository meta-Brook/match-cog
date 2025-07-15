import { Actor, Collider, CollisionContact, Engine, Side, vec } from "excalibur";
import { Resources } from "../resources";

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

const colorKeys = ["Blue", "Green", "Red", "Yellow", "Purple", "Grey"] as const;

export class Gem extends Actor {
    public gemColor: keyof typeof Resources;

  constructor() {
    super({
      name: 'Gem',
      pos: vec(0, 0), // Position will be set in the scene
      width: 64, // Assuming each gem is 64x64 pixels
      height: 64, // Assuming each gem is 64x64 pixels
      anchor: vec(0.5, 0.5), // Center the gem's collider and graphics
      collisionType: 'Passive', // Passive means this does not participate in collisions
 
    });
    
    this.gemColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    
    this.name = `${this.gemColor}`;

  }

  override onInitialize() {
    // Generally recommended to stick logic in the "On initialize"
    // This runs before the first update
    // Useful when
    // 1. You need things to be loaded like Images for graphics
    // 2. You need excalibur to be initialized & started 
    // 3. Deferring logic to run time instead of constructor time
    // 4. Lazy instantiation
    
    
    this.graphics.add(Resources[this.gemColor].toSprite());

    // Actions are useful for scripting common behavior, for example patrolling enemies

    // Sometimes you want to click on an actor!
    this.on('pointerdown', evt => {
      // Pointer events tunnel in z order from the screen down, you can cancel them!
      // if (true) {
      //   evt.cancel();
      // }
      console.log('You clicked the actor @', evt.worldPos.toString());
    });
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
