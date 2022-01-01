import { noop } from "../../utility/noop";
import { getRoot } from "../../refs/root";

import { Pipe } from "../../helpers/pipeline";

class DebounceTimePipe<T> extends Pipe<T> {

  private _timeout: number;
  private _timeoutSub: any;

  constructor(timeout: number) {
    super();

    if (typeof(timeout) !== 'number' || timeout <= 0) {
      timeout = 0;
    }

    this._timeout = timeout;
  }

  protected wrapper(argValue: T, pipeOutput: any, next: (value: T) => void): void {
    if (this._timeout <= 0) {
      next(argValue);

      return;
    } 

    try
    {
      (getRoot() as Window).clearTimeout(this._timeoutSub);
    }
    catch (err: any) 
    { 

    }
    finally
    {
      this._timeoutSub = null;
    }

    this._timeoutSub = (getRoot() as Window).setTimeout(
      () => {
        this._timeoutSub = null;

        next(argValue);
      }, 
      this._timeout
    );
  }

}

export function debounceTime<T = any>(timeout: number): Pipe<T> {
  const out: DebounceTimePipe<T> = new DebounceTimePipe<T>(timeout);

  out.pipeFunction(noop);

  return out;
}
