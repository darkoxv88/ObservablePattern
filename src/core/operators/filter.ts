import { Pipe } from "../../helpers/pipeline";

class FilterPipe<T> extends Pipe<T> {

  constructor() {
    super();
  }

  protected wrapper(argValue: T, pipeOutput: any, next: (value: T) => void): void {
    if (pipeOutput ? true : false) {
      next(argValue);
    }
  }

}

export function filter<T = any>(fn: (value: T) => boolean): Pipe<T> {
  const out: FilterPipe<T> = new FilterPipe<T>();

  out.pipeFunction(fn);

  return out;
}
