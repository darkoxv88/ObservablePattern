import { ISubscription } from "../interfaces/i-subscription";

export class Subscription implements ISubscription {

  private _subscribed: boolean;

  constructor() {
    this._subscribed = true;
  }

  public isSubscribed(): boolean {
    return this._subscribed;
  }

  public unsubscribe(): void {
    this._subscribed = false;
  }

}
