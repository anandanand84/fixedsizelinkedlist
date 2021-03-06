/**
 * Created by AAravindan on 5/7/16.
 */
import { LinkedList } from './LinkedList';

export class FixedSizeLinkedList extends LinkedList {
  public periodHigh:number = 0;
  public periodLow:number = Infinity;
  public lastShift:number;
  public sum:number = 0;
  public _push:(data:number)=>void;
  constructor(public size:number,public maintainHigh?:boolean,public maintainLow?:boolean, public maintainSum?:boolean) {
    super();
    if(!size || typeof size !== 'number'){
      throw('Size required and should be a number.');
    }
    this._push = this.push;
    this.push = function(data) {
      this.add(data);
    }
  }

  add(data:number) {
    if(this.length === this.size){
      this.lastShift = this.shift();
      this._push(data);
      if(this.maintainSum) this.sum = this.sum - this.lastShift + data;
      if(this.maintainHigh && (this.lastShift == this.periodHigh)) this.calculatePeriodHigh();
      if(this.maintainLow && (this.lastShift == this.periodLow)) this.calculatePeriodLow();
    }else {
      this._push(data);
      if(this.maintainSum) this.sum = this.sum + data;
    }
    if(this.maintainHigh && (this.periodHigh <= data)) this.periodHigh = data;
    if(this.maintainLow && (this.periodLow >= data)) (this.periodLow = data);
  }

  *iterator() {
    this.resetCursor();
    while(this.next()){
      yield this.current;
    }
  }

  calculatePeriodHigh() {
    this.resetCursor();
    if(this.next())
      this.periodHigh = this.current;
    while(this.next()){
      if(this.periodHigh <= this.current){
        this.periodHigh = this.current;
      };
    };
  }

  calculatePeriodLow() {
    this.resetCursor();
    if(this.next())
      this.periodLow = this.current;
    while(this.next()){
      if(this.periodLow >= this.current){
        this.periodLow = this.current;
      };
    };
  }
}