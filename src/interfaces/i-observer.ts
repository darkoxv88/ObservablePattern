import { IOnDestroy } from "./i-on-destroy";
import { ISubscription } from "./i-subscription";

import { Pipe } from "../helpers/pipeline";

export interface IObserver<T> extends IOnDestroy {
  isSubscribe(): boolean;
  pipe(pipe: Pipe<T>): IObserver<T>;
  subscribe(fn: (data: T) => void): ISubscription;
  observe(): void;
  onError(fn: (err: any) => void): void;
  observeError(): void;
  onComplete(fn: () => void): void;
  observeComplete(): void;
}
