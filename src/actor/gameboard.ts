//actor, should manage positioning, drawing, and interaction

//boardlogic for valid match detection, tile refill calc, and swap validity

import { Actor, Collider, CollisionContact, Engine, Side,Vector} from "excalibur";
import { Gem } from "../actor/gem"
import { BoardLogic,Coordinates } from "../utils/boardlogic";
import { Resources } from "../resources";
import { TILE_SIZE } from "../utils/config";

export class Gameboard extends Actor {
    public field: (Gem) [][];
    public xsize: number;
    public ysize: number;
    public firstGem: Gem|null;

 

  constructor(xsize: number, ysize:number) {
    const CalcW = xsize * TILE_SIZE
    const CalcH = ysize * TILE_SIZE


    super({
    width: CalcW,
    height: CalcH,
    name: "Gameboard"
  
    });

    this.field = [];
    this.xsize = xsize;
    this.ysize = ysize;
    this.firstGem = null;


    
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

    gem1.setGrid(gem2.col,gem2.row)
    gem1.row = gem2.row;
    gem1.col = gem2.col;
    this.field[gem1.row][gem1.col] = gem1;

    gem2.setGrid(swapC,swapR)
    gem2.row = swapR;
    gem2.col = swapC;
    this.field[gem2.row][gem2.col] = gem2;
    
    //change the stored location on each gem
    //update the gem name to te new location
  }

  gemClick(gem:Gem){

    
    if(this.firstGem instanceof Gem){
      console.log("second", this.firstGem, gem ,BoardLogic.isValidSwap(this, this.firstGem , gem))
      if(BoardLogic.isValidSwap(this , this.firstGem , gem)==true){
      this.swapGems(this.firstGem,gem);
      console.log('swap')
      };
      this.firstGem = null;

    }else if(this.firstGem == null){
      this.firstGem = gem;
      console.log('firstGem')
    }else{
      console.log('error in gemClick');
    }


  }

  gridToPos(col:number,row:number){

    let posC = col * TILE_SIZE;
    let posR = row * TILE_SIZE;

    return new Vector(posC,posR);

  }

  setGem(row:number, col:number){

  }

  removeMatches(){
      console.log(this.field);
    let matches:Coordinates[][] = BoardLogic.findMatches(this.field);
    
    console.log(matches);

    for(let col = 0; this.field[0].length >= col ; col++){
      for(let row = 0 ; this.field.length >= row ; row++){
        if(matches.some(arr=>
          arr.some(coord => 
            coord.col === col && coord.row === row)
        )){
          console.log('match');
         
          //this.removeGem(this.field[col][row]);
          //this.collapseGems;
        }
        

        
      }}

  }

  removeGem(coordinates: Coordinates){
  

    const removeThis:Gem = this.field[coordinates.col][coordinates.row];

    if(removeThis){
    this.scene?.remove(removeThis);
    this.field[coordinates.col][coordinates.row].remove = true;
    }

}



  collapseGems(){
    for(let col = 0; col < this.field[0].length; col++){
      for(let row = this.field.length ; row >= 0 ; row--){
        if(this.field[col][row].remove){
          for(let bubble = 0 ; row - bubble > 0 ; bubble++){
            this.field[col][row-bubble] = this.field[col][row-bubble-1];
            this.field[col][row-bubble-1].setGrid(col,row-bubble-1);

          }
          const gem = new Gem(this);
          this.field[col][0] = gem;
          
          this.field[col][0].setGrid(col,0);
          this.addChild(gem)

      }

    }


  };
}


  refillGrid(){

  };

  public createLevel(){
    for(let row = 0; row < this.xsize; row++){
      this.field[row]=[];
      for(let col = 0;col < this.ysize; col++){
        const gem = new Gem(this);
        this.field[row][col]= gem;
        this.field[row][col].setGrid(row,col);
        this.addChild(gem); 
      }
    }
    this.removeMatches();


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
