import { noop } from "../../utility/noop";
import { getRoot } from "../../refs/root";

import { Pipe } from "../../helpers/pipeline";

class DelayPipe<T> extends Pipe<T> {

  private _timeout: number;

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

    (getRoot() as Window).setTimeout(
      () => {
        next(argValue);
      }, 
      this._timeout
    );
  }

}

export function delay<T = any>(timeout: number): Pipe<T> {
  const out: DelayPipe<T> = new DelayPipe<T>(timeout);

  out.pipeFunction(noop);

  return out;
}
