export interface IObservable<T> {
  getValue(): T;
  hasError(): boolean;
  getError(): any;
}
