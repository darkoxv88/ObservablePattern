import { noop } from "../utility/noop";

import { IOnDestroy } from "../interfaces/i-on-destroy";

export class Callback implements IOnDestroy {

  private fn: (...args: any[]) => any;
  private onErrorFn: (err?: any) => any;
  private logError: boolean;
  
  constructor(logError: boolean) {
    this.fn = noop;
    this.onErrorFn = null;
    this.logError = logError ? true : false;
  }

  destructor() {
    this.fn = null;
    this.onErrorFn = null;
    this.logError = false;
  }

  public registerCallback(fn: (...args: any[]) => any): void {
    if (typeof(fn) !== 'function') {
      return;
    }

    this.fn = fn;
  }

  public onError(fn: (err?: any) => any): void {
    if (typeof(fn) !== 'function') {
      return;
    }

    this.onErrorFn = fn;
  }

  public remove(): void {
    this.fn = noop;
  }

  public performCall<T = void>(...args: any[]): T {
    try
    {
      if (typeof(this.fn) === 'function') {
        return this.fn.apply(null, arguments);
      }
    }
    catch (err: any)
    {
      if (this.logError) {
        console.error(err);
      }

      if (typeof(this.onErrorFn) === 'function') {
        return this.onErrorFn(err);
      }

      return (void 0);
    }
  }

}
