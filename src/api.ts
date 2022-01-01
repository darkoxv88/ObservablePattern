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
  static debounceTime: typeof debounceTime = debounceTime;
  static delay: typeof delay = delay;
  static distinctUntilChanged: typeof distinctUntilChanged = distinctUntilChanged;
  static filter: typeof filter = filter;
  static map: typeof map = map;
}

class ObservablePattern {
  static Operators: typeof Operators = Operators;
  static BehaviorSubject: typeof BehaviorSubject = BehaviorSubject;
  static PromisedSubject: typeof PromisedSubject = PromisedSubject;
  static SingleSubject: typeof SingleSubject = SingleSubject;
  static Subject: typeof Subject = Subject;
}

export const Api: typeof ObservablePattern = ObservablePattern;
