import { Empty } from './../../utility/empty';
import { Pipe } from "../../helpers/pipeline";

class DistinctUntilChangedPipe<T> extends Pipe<T> {

  constructor() {
    super();
  }

  protected wrapper(argValue: T, pipeOutput: any, next: (value: T) => void): void {
    if (pipeOutput ? true : false) {
      next(argValue);
    }
  }

}

export function distinctUntilChanged<T = any>(): Pipe<T> {
  const out: DistinctUntilChangedPipe<T> = new DistinctUntilChangedPipe<T>();

  let prevValue: T | Empty = new Empty();

  out.pipeFunction((v: T) => {
    if (prevValue === v && !(prevValue instanceof Empty)) {
      return false;
    }

    prevValue = v;

    return true;
  });

  return out;
}
