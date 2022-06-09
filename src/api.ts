import { EventDispatcher } from './core/event-dispatcher';

import { Subscription } from './core/subscription';
import { BehaviorSubject } from './core/behavior-subject';
import { PromisedSubject } from './core/promised-subject';
import { SingleSubject } from './core/single-subject';
import { Subject } from './core/subject';

import { debounceTime } from './core/operators/debounce-time';
import { delay } from './core/operators/delay';
import { distinctUntilChanged } from './core/operators/distinct-until-changed';
import { filter } from './core/operators/filter';
import { map } from './core/operators/map';

class Operators {
  public static debounceTime: typeof debounceTime = debounceTime;
  public static delay: typeof delay = delay;
  public static distinctUntilChanged: typeof distinctUntilChanged = distinctUntilChanged;
  public static filter: typeof filter = filter;
  public static map: typeof map = map;
}

class ObservablePattern {
  public static EventDispatcher: typeof EventDispatcher = EventDispatcher;
  public static Operators: typeof Operators = Operators;
  public static Subscription: typeof Subscription = Subscription;
  public static Subject: typeof Subject = Subject;
  public static BehaviorSubject: typeof BehaviorSubject = BehaviorSubject;
  public static PromisedSubject: typeof PromisedSubject = PromisedSubject;
  public static SingleSubject: typeof SingleSubject = SingleSubject;
}

export const Api: typeof ObservablePattern = ObservablePattern;
