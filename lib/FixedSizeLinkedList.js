/**
 * Created by AAravindan on 5/7/16.
 */
import { LinkedList } from './LinkedList';
export default class FixedSizeLinkedList extends LinkedList {
    constructor(size, maintainHigh, maintainLow, maintainSum) {
        super();
        this.size = size;
        this.maintainHigh = maintainHigh;
        this.maintainLow = maintainLow;
        this.maintainSum = maintainSum;
        this.periodHigh = 0;
        this.periodLow = Infinity;
        this.sum = 0;
        if (!size || typeof size !== 'number') {
            throw ('Size required and should be a number.');
        }
        this._push = this.push;
        this.push = function (data) {
            this.add(data);
        };
    }
    add(data) {
        if (this.length === this.size) {
            this.lastShift = this.shift();
            this._push(data);
            if (this.maintainSum)
                this.sum = this.sum - this.lastShift + data;
            if (this.maintainHigh && (this.lastShift == this.periodHigh))
                this.calculatePeriodHigh();
            if (this.maintainLow && (this.lastShift == this.periodLow))
                this.calculatePeriodLow();
        }
        else {
            this._push(data);
            if (this.maintainSum)
                this.sum = this.sum + data;
        }
        if (this.maintainHigh && (this.periodHigh <= data))
            this.periodHigh = data;
        if (this.maintainLow && (this.periodLow >= data))
            (this.periodLow = data);
    }
    *iterator() {
        this.resetCursor();
        while (this.next()) {
            yield this.current;
        }
    }
    calculatePeriodHigh() {
        this.resetCursor();
        if (this.next())
            this.periodHigh = this.current;
        while (this.next()) {
            if (this.periodHigh <= this.current) {
                this.periodHigh = this.current;
            }
            ;
        }
        ;
    }
    calculatePeriodLow() {
        this.resetCursor();
        if (this.next())
            this.periodLow = this.current;
        while (this.next()) {
            if (this.periodLow >= this.current) {
                this.periodLow = this.current;
            }
            ;
        }
        ;
    }
}
//# sourceMappingURL=FixedSizeLinkedList.js.map