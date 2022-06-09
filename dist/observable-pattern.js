/**
  * 
  * @author Darko Petrovic
  * @Link Facebook: https://www.facebook.com/WitchkingOfAngmarr
  * @Link GitHub: https://github.com/darkoxv88
  * 
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.


exports:

  window.ObservablePattern;

**/

(() => {

;// CONCATENATED MODULE: ./src/refs/root.ts
var root = typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : ({});
function getRoot() {
    return root;
}

;// CONCATENATED MODULE: ./src/environment.ts
var production = true;
function isProduction() {
    return production;
}

;// CONCATENATED MODULE: ./src/core/event-dispatcher.ts
class EventDispatcher {
    constructor() {
        this.__listeners_ = ({});
    }
    addEventListener(type, listener) {
        if (this.__listeners_[type] === undefined) {
            this.__listeners_[type] = new Map();
        }
        if (typeof (this.__listeners_[type].get(listener)) !== 'function') {
            this.__listeners_[type].set(listener, listener);
        }
    }
    hasEventListener(type, listener) {
        try {
            return this.__listeners_[type].get(listener) ? true : false;
        }
        catch (err) {
            return false;
        }
    }
    removeEventListener(type, listener) {
        if (this.hasEventListener(type, listener)) {
            this.__listeners_[type].delete(listener);
        }
    }
    dispatchEvent(type, event) {
        const procs = this.__listeners_[type];
        for (const proc of procs) {
            proc[1].apply(null, [event]);
        }
    }
}

;// CONCATENATED MODULE: ./src/core/subscription.ts
class Subscription {
    constructor() {
        this._subscribed = true;
    }
    isSubscribed() {
        return this._subscribed;
    }
    unsubscribe() {
        this._subscribed = false;
    }
}

;// CONCATENATED MODULE: ./src/utility/noop.ts
function noop() { }

;// CONCATENATED MODULE: ./src/helpers/callback.ts
class Callback {
    constructor(logError) {
        this.fn = noop;
        this.onErrorFn = null;
        this.logError = logError ? true : false;
    }
    destructor() {
        this.fn = null;
        this.onErrorFn = null;
        this.logError = false;
    }
    registerCallback(fn) {
        if (typeof (fn) !== 'function') {
            return;
        }
        this.fn = fn;
    }
    onError(fn) {
        if (typeof (fn) !== 'function') {
            return;
        }
        this.onErrorFn = fn;
    }
    remove() {
        this.fn = noop;
    }
    performCall(...args) {
        try {
            if (typeof (this.fn) === 'function') {
                return this.fn.apply(null, arguments);
            }
        }
        catch (err) {
            if (this.logError) {
                console.error(err);
            }
            if (typeof (this.onErrorFn) === 'function') {
                return this.onErrorFn(err);
            }
            return (void 0);
        }
    }
}

;// CONCATENATED MODULE: ./src/helpers/pipeline.ts
class Pipe {
    constructor() {
        this._fnCallback = new Callback(true);
    }
    destructor() {
        this._fnCallback.destructor();
    }
    pipeFunction(fn) {
        this._fnCallback.registerCallback(fn);
    }
    performCall(argValue, next) {
        try {
            const pipeOutput = this._fnCallback.performCall(argValue);
            this.wrapper(argValue, pipeOutput, next);
        }
        catch (err) {
            console.error(err);
        }
    }
}
class Pipeline {
    constructor() {
        this._pipes = new Array();
        this._finalizeCallback = new Callback(true);
    }
    destructor() {
        for (let pipe of this._pipes) {
            pipe === null || pipe === void 0 ? void 0 : pipe.destructor();
        }
        this._pipes = null;
        this._finalizeCallback.destructor();
    }
    addPipe(pipe) {
        this._pipes.push(pipe);
    }
    start(value) {
        let i = 0;
        if (i === this._pipes.length) {
            this._finalizeCallback.performCall(value);
            return;
        }
        const _next = (nextValue) => {
            var _a;
            i = i + 1;
            if (i < this._pipes.length) {
                (_a = this._pipes[i]) === null || _a === void 0 ? void 0 : _a.performCall(nextValue, _next);
                return;
            }
            this._finalizeCallback.performCall(nextValue);
        };
        this._pipes[i].performCall(value, _next);
    }
    onFinalize(fn) {
        this._finalizeCallback.registerCallback(fn);
    }
}

;// CONCATENATED MODULE: ./src/core/observer.ts
class Observer {
    constructor(observable, callOnSubscribe) {
        this._observable = observable;
        this._callOnSubscribe = callOnSubscribe;
        this._pipeline = new Pipeline();
        this._mainCallback = new Callback(true);
        this._onErrorCallback = new Callback(true);
        this._onCompleteCallback = new Callback(true);
        this._pipeline.onFinalize((value) => {
            this._mainCallback.performCall(value);
        });
    }
    destructor() {
        var _a;
        (_a = this._sub) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        this._mainCallback.destructor();
        this._onErrorCallback.destructor();
        this._onCompleteCallback.destructor();
    }
    isSubscribe() {
        var _a;
        return ((_a = this._sub) === null || _a === void 0 ? void 0 : _a.isSubscribed()) ? true : false;
    }
    pipe(pipe) {
        this._pipeline.addPipe(pipe);
        return this;
    }
    subscribe(fn) {
        if (this._sub instanceof Subscription) {
            return this._sub;
        }
        this._mainCallback.registerCallback(fn);
        if (this._callOnSubscribe) {
            this.observe();
        }
        return this._sub = new Subscription();
    }
    observe() {
        this._pipeline.start(this._observable.getValue());
    }
    onError(fn) {
        this._onErrorCallback.registerCallback(fn);
        if (this._callOnSubscribe) {
            this.observeError();
        }
    }
    observeError() {
        if (this._observable.hasError()) {
            this._onErrorCallback.performCall(this._observable.getError());
        }
    }
    onComplete(fn) {
        this._onCompleteCallback.registerCallback(fn);
        if (this._callOnSubscribe) {
            this.observeComplete();
        }
    }
    observeComplete() {
        this._onCompleteCallback.performCall();
    }
}

;// CONCATENATED MODULE: ./src/core/a-observable.ts
class AObservable {
    constructor() {
        this._value = null;
        this._err = null;
        this._isDisabled = false;
        this._observers = new Array();
    }
    destructor() {
        if (Array.isArray(this._observers)) {
            for (let obs of this._observers) {
                obs === null || obs === void 0 ? void 0 : obs.destructor();
            }
        }
        this._observers = null;
        this.error = noop;
        this.complete = noop;
        this.asObservable = noop;
    }
    setValue(value) {
        this._value = value;
    }
    getValue() {
        return this._value;
    }
    hasError() {
        return this._err ? true : false;
    }
    getError() {
        return this._err;
    }
    clearError() {
        this._err = null;
    }
    error(err) {
        if (this._isDisabled) {
            return;
        }
        this._err = err;
        if (this.hasError() === false) {
            this._err = new Error(null);
        }
        for (let obs of this._observers) {
            obs.observeError();
        }
    }
    complete() {
        if (this._isDisabled) {
            return;
        }
        this._isDisabled = true;
        for (let obs of this._observers) {
            obs.observeComplete();
        }
    }
    asObservable() {
        var _a;
        const observer = new Observer(this, this._observeAfterSubscription);
        (_a = this._observers) === null || _a === void 0 ? void 0 : _a.push(observer);
        return observer;
    }
}

;// CONCATENATED MODULE: ./src/core/behavior-subject.ts
class BehaviorSubject extends AObservable {
    constructor(value) {
        super();
        this._observeAfterSubscription = true;
        this.setValue(value);
    }
    dispatchEvent(value) {
        if (this._isDisabled || this.hasError()) {
            return;
        }
        this.setValue(value);
        for (let i = 0; i < this._observers.length; i++) {
            if (this._observers[i].isSubscribe()) {
                this._observers[i].observe();
                continue;
            }
            this._observers.splice(i, 1);
            i = i - 1;
        }
    }
}

;// CONCATENATED MODULE: ./src/core/promised-subject.ts
class PromisedSubject extends AObservable {
    constructor() {
        super();
        this._observeAfterSubscription = false;
        this._promise = null;
    }
    dispatchEvent(value) { }
    getPromise() {
        return this._promise;
    }
    toPromise(exe) {
        this._promise = new Promise((resolve, reject) => {
            exe((value) => {
                this.setValue(value);
                this._observeAfterSubscription = true;
                resolve(value);
            }, (err) => {
                reject(err);
            });
        });
        this._promise
            .then(() => {
            for (let i = 0; i < this._observers.length; i++) {
                if (this._observers[i].isSubscribe()) {
                    this._observers[i].observe();
                    continue;
                }
                this._observers.splice(i, 1);
                i = i - 1;
            }
        })
            .catch((err) => {
            this.error(err);
        })
            .finally(() => {
            this.complete();
        });
    }
}

;// CONCATENATED MODULE: ./src/core/single-subject.ts
class SingleSubject extends AObservable {
    constructor() {
        super();
        this._observeAfterSubscription = false;
    }
    error(err) {
        super.error(err);
        this.complete();
    }
    dispatchEvent(value) {
        if (this._isDisabled || this.hasError()) {
            return;
        }
        this.setValue(value);
        for (let i = 0; i < this._observers.length; i++) {
            if (this._observers[i].isSubscribe()) {
                this._observers[i].observe();
                continue;
            }
            this._observers.splice(i, 1);
            i = i - 1;
        }
        this.complete();
        this._observers = null;
    }
}

;// CONCATENATED MODULE: ./src/core/subject.ts
class Subject extends AObservable {
    constructor() {
        super();
        this._observeAfterSubscription = false;
    }
    dispatchEvent(value) {
        if (this._isDisabled || this.hasError()) {
            return;
        }
        this.setValue(value);
        for (let i = 0; i < this._observers.length; i++) {
            if (this._observers[i].isSubscribe()) {
                this._observers[i].observe();
                continue;
            }
            this._observers.splice(i, 1);
            i = i - 1;
        }
    }
}

;// CONCATENATED MODULE: ./src/core/operators/debounce-time.ts
class DebounceTimePipe extends Pipe {
    constructor(timeout) {
        super();
        if (typeof (timeout) !== 'number' || timeout <= 0) {
            timeout = 0;
        }
        this._timeout = timeout;
    }
    wrapper(argValue, pipeOutput, next) {
        if (this._timeout <= 0) {
            next(argValue);
            return;
        }
        try {
            getRoot().clearTimeout(this._timeoutSub);
        }
        catch (err) {
        }
        finally {
            this._timeoutSub = null;
        }
        this._timeoutSub = getRoot().setTimeout(() => {
            this._timeoutSub = null;
            next(argValue);
        }, this._timeout);
    }
}
function debounceTime(timeout) {
    const out = new DebounceTimePipe(timeout);
    out.pipeFunction(noop);
    return out;
}

;// CONCATENATED MODULE: ./src/core/operators/delay.ts
class DelayPipe extends Pipe {
    constructor(timeout) {
        super();
        if (typeof (timeout) !== 'number' || timeout <= 0) {
            timeout = 0;
        }
        this._timeout = timeout;
    }
    wrapper(argValue, pipeOutput, next) {
        if (this._timeout <= 0) {
            next(argValue);
            return;
        }
        getRoot().setTimeout(() => {
            next(argValue);
        }, this._timeout);
    }
}
function delay(timeout) {
    const out = new DelayPipe(timeout);
    out.pipeFunction(noop);
    return out;
}

;// CONCATENATED MODULE: ./src/utility/empty.ts
class Empty {
}

;// CONCATENATED MODULE: ./src/core/operators/distinct-until-changed.ts
class DistinctUntilChangedPipe extends Pipe {
    constructor() {
        super();
    }
    wrapper(argValue, pipeOutput, next) {
        if (pipeOutput ? true : false) {
            next(argValue);
        }
    }
}
function distinctUntilChanged() {
    const out = new DistinctUntilChangedPipe();
    let prevValue = new Empty();
    out.pipeFunction((v) => {
        if (prevValue === v && !(prevValue instanceof Empty)) {
            return false;
        }
        prevValue = v;
        return true;
    });
    return out;
}

;// CONCATENATED MODULE: ./src/core/operators/filter.ts
class FilterPipe extends Pipe {
    constructor() {
        super();
    }
    wrapper(argValue, pipeOutput, next) {
        if (pipeOutput ? true : false) {
            next(argValue);
        }
    }
}
function filter(fn) {
    const out = new FilterPipe();
    out.pipeFunction(fn);
    return out;
}

;// CONCATENATED MODULE: ./src/core/operators/map.ts
class MapPipe extends Pipe {
    constructor() {
        super();
    }
    wrapper(argValue, pipeOutput, next) {
        next(pipeOutput);
    }
}
function map(fn) {
    const out = new MapPipe();
    out.pipeFunction(fn);
    return out;
}

;// CONCATENATED MODULE: ./src/api.ts
class Operators {
}
Operators.debounceTime = debounceTime;
Operators.delay = delay;
Operators.distinctUntilChanged = distinctUntilChanged;
Operators.filter = filter;
Operators.map = map;
class ObservablePattern {
}
ObservablePattern.EventDispatcher = EventDispatcher;
ObservablePattern.Operators = Operators;
ObservablePattern.Subscription = Subscription;
ObservablePattern.BehaviorSubject = BehaviorSubject;
ObservablePattern.PromisedSubject = PromisedSubject;
ObservablePattern.SingleSubject = SingleSubject;
ObservablePattern.Subject = Subject;
const Api = ObservablePattern;

;// CONCATENATED MODULE: ./src/index.js
var libName = 'ObservablePattern';

try
{
  if (getRoot()[libName] && isProduction()) {
    throw new Error('window["' + libName + '"] is already in use!');
  }

  getRoot()[libName] = Api;
}
catch(err)
{
  console.error(err);
}

})();
