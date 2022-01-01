import { Subscription } from "./subscription";
import { Pipeline, Pipe } from "../helpers/pipeline";
import { Callback } from "../helpers/callback";

import { IObservable } from "../interfaces/i-observable";
import { IObserver } from "../interfaces/i-observer";

export class Observer<T> implements IObserver<T> {

  private _observable: IObservable<T>;
  private _callOnSubscribe: boolean;
  private _sub: Subscription;
  private _pipeline: Pipeline<T>;
  private _mainCallback: Callback;
  private _onErrorCallback: Callback;
  private _onCompleteCallback: Callback;

  constructor(observable: IObservable<T>, callOnSubscribe: boolean) {
    this._observable = observable;
    this._callOnSubscribe = callOnSubscribe;
    this._pipeline = new Pipeline<T>();
    this._mainCallback = new Callback(true);
    this._onErrorCallback = new Callback(true);
    this._onCompleteCallback = new Callback(true);

    this._pipeline.onFinalize((value) => {
      this._mainCallback.performCall(value);
    });
  }

  destructor() {
    this._sub?.unsubscribe();
    this._mainCallback.destructor();
    this._onErrorCallback.destructor();
    this._onCompleteCallback.destructor();
  }

  public isSubscribe(): boolean {
    return this._sub?.isSubscribed() ? true : false;
  }

  public pipe(pipe: Pipe<T>): Observer<T> {
    this._pipeline.addPipe(pipe);

    return this;
  }

  public subscribe(fn: (data: T) => void): Subscription { 
    if (this._sub instanceof Subscription) {
      return this._sub;
    }

    this._mainCallback.registerCallback(fn);

    if (this._callOnSubscribe) {
      this.observe();
    }
    
    return this._sub = new Subscription();
  }

  public observe(): void {
    this._pipeline.start(this._observable.getValue());
  }

  public onError(fn: (err: any) => void): void {
    this._onErrorCallback.registerCallback(fn);

    if (this._callOnSubscribe) { 
      this.observeError();
    }
  }

  public observeError(): void {
    if (this._observable.hasError()) {
      this._onErrorCallback.performCall(this._observable.getError());
    }
  }

  public onComplete(fn: () => void): void {
    this._onCompleteCallback.registerCallback(fn);

    if (this._callOnSubscribe) {
      this.observeComplete();
    }
  }

  public observeComplete(): void {
    this._onCompleteCallback.performCall();
  }

}
