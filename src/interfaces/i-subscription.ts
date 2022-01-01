export interface ISubscription {
  isSubscribed(): boolean;
  unsubscribe(): void;
}
