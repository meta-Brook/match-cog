//actor, should manage positioning, drawing, and interaction

//boardlogic for valid match detection, tile refill calc, and swap validity

import { Actor, Collider, CollisionContact, Engine, Side,} from "excalibur";
import { Gem } from "../actor/gem"
import { BoardLogic,Coordinates } from "../utils/boardlogic";
import { Resources } from "../resources";
import { TILE_SIZE } from "../utils/config";

export class Gameboard extends Actor {
    public field: Gem[][];
    public xsize: number;
    public ysize: number;

 

  constructor(xsize: number, ysize:number) {
    const CalcW = xsize * TILE_SIZE
    const CalcH = ysize * TILE_SIZE


    super({
    width: CalcW,
    height: CalcH
  
    });

    this.field = [];
    this.xsize = xsize;
    this.ysize = ysize;


    
  }

  override onInitialize() {
    console.log('gameboard init');
    
    this.createLevel();


  }

  public swapGems(gem1: Gem,gem2: Gem):void {
    //change the positions of each gem to each other by movement
    //base on their relation to each other, we need to make it so that each move to the positon of the other
    let swapR = gem1.row;
    let swapC = gem1.col;

    gem1.actions.moveTo(gem2.col,gem2.row,200);
    gem1.row = gem2.row;
    gem1.col = gem2.col;
    this.field[gem1.row][gem1.col] = gem1;

    gem2.actions.moveTo(swapC,swapR,200);
    gem2.row = swapR;
    gem2.col = swapC;
    this.field[gem2.row][gem2.col] = gem2;
    
    //change the stored location on each gem
    //update the gem name to te new location
  }

  override getGem(row:number,col:number){
    return  this.field[row][col];
  }

  override setGem(row:number, col:number){

  }

  override removeGems(coordinates: Coordinates[]){

  }

  override collapseTiles(){

  }

  override refillGrid(){

  }

  public createLevel(){
    for(let x = 0;x < this.xsize;x++){
      this.field[x]=[];
      for(let y = 0;y < this.ysize; y++){
        const gem = new Gem();
        this.field[x][y]= gem;
        this.field[x][y].setPos(x,y);
        this.addChild(gem); 
      }
    }


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
