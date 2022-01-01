import { IOnDestroy } from "../interfaces/i-on-destroy";

import { Callback } from "./callback";

export abstract class Pipe<T> implements IOnDestroy {

  private _fnCallback: Callback;

  constructor() {
    this._fnCallback = new Callback(true);
  }

  destructor() {
    this._fnCallback.destructor();
  }

  public pipeFunction(fn: (val: T) => any): void {
    this._fnCallback.registerCallback(fn);
  }

  public performCall(argValue: T, next: (value: T) => void) {
    try
    {
      const pipeOutput: any = this._fnCallback.performCall(argValue);

      this.wrapper(argValue, pipeOutput, next);
    }
    catch (err)
    {
      console.error(err);
    }
  }

  protected abstract wrapper(argValue: T, pipeOutput: any, next: (value: T) => void): void;
  
}

export class Pipeline<T> implements IOnDestroy {

  private _pipes: Array<Pipe<T>>;

  private _finalizeCallback: Callback;

  constructor() {
    this._pipes = new Array<Pipe<T>>();
    this._finalizeCallback = new Callback(true);
  }

  destructor() {
    for (let pipe of this._pipes) {
      pipe?.destructor();
    }

    this._pipes = null;
    this._finalizeCallback.destructor();
  }

  public addPipe(pipe: Pipe<T>): void {
    this._pipes.push(pipe);
  }

  public start(value: T): void {
    let i = 0;

    if (i === this._pipes.length) {
      this._finalizeCallback.performCall(value);

      return;
    }

    const _next: (nextValue: T) => void = (nextValue: T) => {
      i = i + 1;

      if (i < this._pipes.length) {
        this._pipes[i]?.performCall(nextValue, _next);

        return;
      }

      this._finalizeCallback.performCall(nextValue);
    };

    this._pipes[i].performCall(value, _next);
  }

  onFinalize(fn: (value: T) => void): void {
    this._finalizeCallback.registerCallback(fn);
  }

}
