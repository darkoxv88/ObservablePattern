import { AObservable } from "./a-observable";

export class PromisedSubject<T> extends AObservable<T> {

  private _promise: Promise<T>;

  constructor() {
    super();

    this._observeAfterSubscription = false;
    this._promise = null;
  }

  public dispatchEvent(value: T): void { }

  public getPromise(): Promise<T> {
    return this._promise;
  }

  public toPromise(exe: (res: Function, rej: Function) => void): void {
    this._promise = new Promise((resolve, reject) => {
      exe(
        (value: T) => {
          this.setValue(value);
          this._observeAfterSubscription = true;
          resolve(value);
        },
        (err: any) => {
          reject(err);
        }
      );
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
      .catch((err: any) => {
        this.error(err);
      })
      .finally(() => {
        this.complete();
      });
  }

}
