export class EventDispatcher<T> {

  private __listeners_: { [ key: string ]: Map<Function, <T>(e: T) => void> }

  constructor() {
    this.__listeners_ = ({ });
  }

  public addEventListener(type: string, listener: <T>(e: T) => void): void {
    if (this.__listeners_[type] === undefined) {
      this.__listeners_[type] = new Map();
    }

    if (typeof(this.__listeners_[type].get(listener)) !== 'function') {
      this.__listeners_[type].set(listener, listener);
    }
  }

  public hasEventListener(type: string, listener: <T>(e: T) => void): boolean {
    try
    {
      return this.__listeners_[type].get(listener) ? true : false;
    }
    catch (err)
    {
      return false;
    }
  }

  public removeEventListener(type: string, listener: <T>(e: T) => void): void {
    if (this.hasEventListener(type, listener)) {
      this.__listeners_[type].delete(listener);
    }
  }

  public dispatchEvent(type: string, event: T): void {
    const procs: Map<Function, <T>(e: T) => void> = this.__listeners_[type];

    for (const proc of procs) {
      proc[1].apply(null, [event]);
    }
  }

}
