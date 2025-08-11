//actor, should manage positioning, drawing, and interaction

//boardlogic for valid match detection, tile refill calc, and swap validity

import { Actor, Collider, CollisionContact, Engine, Side,} from "excalibur";
import { Gem } from "../actor/gem"
import { Resources } from "../resources";

export class Gameboard extends Actor {
    public field: Gem[][];

  constructor() {
    super({
  
    });

    this.field = [];
    
  }

  override onInitialize() {

  
  }

  /*override swapGems(gem1: Gem,gem2: Gem) {

  
  }

  override getGem(row:number,col:number){

  }

  override setGem(row:number, col:number){

  }

  override removeGems(coordinates: Coordinates[]){

  }

  override collapseTiles(){

  }

  override refillGrid(){

  }

  override createLevel(){

  }
*/
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
