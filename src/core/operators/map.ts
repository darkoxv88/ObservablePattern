import { Pipe } from "../../helpers/pipeline";

class MapPipe<T> extends Pipe<T> {

  constructor() {
    super();
  }

  protected wrapper(argValue: T, pipeOutput: any, next: (value: T) => void): void {
    next(pipeOutput);
  }

}

export function map<T = any>(fn: (value: T) => T): Pipe<T> {
  const out: MapPipe<T> = new MapPipe<T>();

  out.pipeFunction(fn);

  return out;
}
