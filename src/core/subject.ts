import { AObservable } from "./a-observable";

const type = 'Subject';

export class Subject<T> extends AObservable<T> {

  public get type(): 'Subject' {
    return type;
  }

  constructor() {
    super();

    this._observeAfterSubscription = false;
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
