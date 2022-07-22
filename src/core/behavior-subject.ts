import { AObservable } from "./a-observable";

const type = 'BehaviorSubject';

export class BehaviorSubject<T> extends AObservable<T> {

  public get type(): 'BehaviorSubject' {
    return type;
  }

  constructor(value: T) {
    super();

    this._observeAfterSubscription = true;
    this.setValue(value);
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
  }

}
