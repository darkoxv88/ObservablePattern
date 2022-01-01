import { AObservable } from "./a-observable";

export class SingleSubject<T> extends AObservable<T> {

  constructor() {
    super();

    this._observeAfterSubscription = false;
  }

  public error(err: any): void {
    super.error(err);
    this.complete();
  }

  public dispatchEvent(value: T): void {
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
