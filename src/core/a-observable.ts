import { IObservable } from "../interfaces/i-observable";
import { IObserver } from "../interfaces/i-observer";
import { IOnDestroy } from "../interfaces/i-on-destroy";
import { Observer } from "./observer";
import { noop } from "../utility/noop";

export abstract class AObservable<T> implements IObservable<T>, IOnDestroy {

  private _value: T;
  private _err: any;
  protected _isDisabled: boolean;
  protected _observers: Array<IObserver<T>>;
  protected _observeAfterSubscription: boolean;
  
  constructor() {
    this._value = null;
    this._err = null;
    this._isDisabled = false;
    this._observers = new Array<IObserver<T>>();
  }

  destructor() {
    if (Array.isArray(this._observers)) {
      for (let obs of this._observers) {
        obs?.destructor();
      }
    }

    this._observers = null;
    this.error = noop;
    this.complete = noop;
    this.asObservable = noop;
  }

  protected setValue(value: T): void {
    this._value = value;
  }

  public getValue(): T {
    return this._value; 
  }

  public hasError(): boolean {
    return this._err ? true : false;
  }

  public getError(): any {
    return this._err;
  }

  public clearError(): void {
    this._err = null;
  }

  public error(err: any): void {
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

  public complete(): void {
    if (this._isDisabled) {
      return;
    }

    this._isDisabled = true;

    for (let obs of this._observers) {
      obs.observeComplete();
    }
  }

  public asObservable(): IObserver<T> {
    const observer: IObserver<T> = new Observer(this, this._observeAfterSubscription);

    this._observers?.push(observer);

    return observer;
  }
  
  public abstract dispatchEvent(value: T): void;
  
}
