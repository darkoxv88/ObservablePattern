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

declare interface IOnDestroy {
  destructor(): void;
}

declare interface IObservable<T> {
  getValue(): T;
  hasError(): boolean;
  getError(): any;
}

declare interface ISubscription {
  isSubscribed(): boolean;
  unsubscribe(): void;
}

declare class EventDispatcher<T> {

  private __listeners_: { [ key: string ]: Map<Function, <T>(e: T) => void> };

  constructor();

  public addEventListener(type: string, listener: <T>(e: T) => void): void;

  public hasEventListener(type: string, listener: <T>(e: T) => void): boolean;

  public removeEventListener(type: string, listener: <T>(e: T) => void): void;

  public dispatchEvent(type: string, event: T): void;

}

declare abstract class Pipe<T> implements IOnDestroy {

  constructor();
  destructor();

  public pipeFunction(fn: (val: T) => any): void;
  public performCall(argValue: T, next: (value: T) => void);
  protected abstract wrapper(argValue: T, pipeOutput: any, next: (value: T) => void): void;
  
}

declare interface IObserver<T> extends IOnDestroy {
  isSubscribe(): boolean;
  pipe(pipe: Pipe<T>): IObserver<T>;
  subscribe(fn: (data: T) => void): ISubscription;
  observe(): void;
  onError(fn: (err: any) => void): void;
  observeError(err: any): void;
  onComplete(fn: () => void): void;
  observeComplete(): void;
}

declare class Subscription implements ISubscription {
	
  constructor();

  public isSubscribed(): boolean;
  public unsubscribe(): void;

}

declare class Observer<T> implements IObserver<T> {

  constructor(observable: IObservable<T>, callOnSubscribe: boolean);
  destructor();

  public isSubscribe(): boolean;
  public pipe(pipe: Pipe<T>): Observer<T>;
  public subscribe(fn: (data: T) => void): Subscription;
  public observe(): void;
  public onError(fn: (err: any) => void): void;
  public observeError(err: any): void;
  public onComplete(fn: () => void): void;
  public observeComplete(): void;

}

declare abstract class AObservable<T> implements IObservable<T>, IOnDestroy {

  protected _isDisabled: boolean;
  protected _observers: Array<IObserver<T>>;
  protected _observeAfterSubscription: boolean;
  
  constructor();
  destructor();

  protected setValue(value: T): void;
  public getValue(): T;
  public hasError(): boolean;
  public getError(): any;
  public clearError(): void;
  public error(err: any): void;
  public complete(): void;
  public asObservable(): IObserver<T>;
  public abstract dispatchEvent(value: T): void;
  
}

declare class Subject<T> extends AObservable<T> {

  public get type(): 'Subject';

  constructor();

  public dispatchEvent(value: T): void;
  
}

declare class BehaviorSubject<T> extends AObservable<T> {

  public get type(): 'BehaviorSubject';

  constructor(value: T);

  public dispatchEvent(value: T): void;

}

declare class PromisedSubject<T> extends AObservable<T> {

  public get type(): 'PromisedSubject';

  constructor();

  public dispatchEvent(value: T): void;
  public toPromise(exe: (res: (value: T) => void, rej: (err?: any) => void) => void): void;
  public getPromise(): Promise<T> | null;

}

declare class SingleSubject<T> extends AObservable<T> {

  public get type(): 'SingleSubject';

  constructor();

  public dispatchEvent(value: T): void;

}

declare class Operators {
  public static debounceTime<T = any>(timeout: number): Pipe<T>;
  public static delay<T = any>(timeout: number): Pipe<T>;
  public static distinctUntilChanged<T = any>(): Pipe<T>;
  public static filter<T = any>(fn: (value: T) => boolean): Pipe<T>;
  public static map<T = any>(fn: (value: T) => T): Pipe<T>;
}

export declare class ObservablePattern {
  public static Operators: typeof Operators;
  public static Subscription: typeof Subscription;
  public static Subject: typeof Subject;
  public static BehaviorSubject: typeof BehaviorSubject;
  public static PromisedSubject: typeof PromisedSubject;
  public static SingleSubject: typeof SingleSubject;
}
