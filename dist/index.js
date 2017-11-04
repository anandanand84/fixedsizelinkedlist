'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Item {
    constructor(data, prev, next) {
        this.next = next;
        if (next)
            next.prev = this;
        this.prev = prev;
        if (prev)
            prev.next = this;
        this.data = data;
    }
}
class LinkedList {
    constructor() {
        this._length = 0;
    }
    get head() {
        return this._head && this._head.data;
    }
    get tail() {
        return this._tail && this._tail.data;
    }
    get current() {
        return this._current && this._current.data;
    }
    get length() {
        return this._length;
    }
    push(data) {
        this._tail = new Item(data, this._tail);
        if (this._length === 0) {
            this._head = this._tail;
            this._current = this._head;
            this._next = this._head;
        }
        this._length++;
    }
    pop() {
        var tail = this._tail;
        if (this._length === 0) {
            return;
        }
        this._length--;
        if (this._length === 0) {
            this._head = this._tail = this._current = this._next = undefined;
            return tail.data;
        }
        this._tail = tail.prev;
        this._tail.next = undefined;
        if (this._current === tail) {
            this._current = this._tail;
            this._next = undefined;
        }
        return tail.data;
    }
    shift() {
        var head = this._head;
        if (this._length === 0) {
            return;
        }
        this._length--;
        if (this._length === 0) {
            this._head = this._tail = this._current = this._next = undefined;
            return head.data;
        }
        this._head = this._head.next;
        if (this._current === head) {
            this._current = this._head;
            this._next = this._current.next;
        }
        return head.data;
    }
    unshift(data) {
        this._head = new Item(data, undefined, this._head);
        if (this._length === 0) {
            this._tail = this._head;
            this._next = this._head;
        }
        this._length++;
    }
    unshiftCurrent() {
        var current = this._current;
        if (current === this._head || this._length < 2) {
            return current && current.data;
        }
        // remove
        if (current === this._tail) {
            this._tail = current.prev;
            this._tail.next = undefined;
            this._current = this._tail;
        }
        else {
            current.next.prev = current.prev;
            current.prev.next = current.next;
            this._current = current.prev;
        }
        this._next = this._current.next;
        // unshift
        current.next = this._head;
        current.prev = undefined;
        this._head.prev = current;
        this._head = current;
        return current.data;
    }
    removeCurrent() {
        var current = this._current;
        if (this._length === 0) {
            return;
        }
        this._length--;
        if (this._length === 0) {
            this._head = this._tail = this._current = this._next = undefined;
            return current.data;
        }
        if (current === this._tail) {
            this._tail = current.prev;
            this._tail.next = undefined;
            this._current = this._tail;
        }
        else if (current === this._head) {
            this._head = current.next;
            this._head.prev = undefined;
            this._current = this._head;
        }
        else {
            current.next.prev = current.prev;
            current.prev.next = current.next;
            this._current = current.prev;
        }
        this._next = this._current.next;
        return current.data;
    }
    resetCursor() {
        this._current = this._next = this._head;
        return this;
    }
    next() {
        var next = this._next;
        if (next !== undefined) {
            this._next = next.next;
            this._current = next;
            return next.data;
        }
    }
}

/**
 * Created by AAravindan on 5/7/16.
 */
class FixedSizeLinkedList extends LinkedList {
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
            
        }
        
    }
    calculatePeriodLow() {
        this.resetCursor();
        if (this.next())
            this.periodLow = this.current;
        while (this.next()) {
            if (this.periodLow >= this.current) {
                this.periodLow = this.current;
            }
            
        }
        
    }
}

exports.FixedSizeLinkedList = FixedSizeLinkedList;
