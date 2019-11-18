export default function take(observable, count) {
  return new Observable(observer => {
    let index = 0;
    const subscription = observable.subscribe({
      complete() { observer.complete(); },
      error(error) { observer.error(error); },
      next(value) {
        observer.next(value);

        if (++index >= count) {
          observer.complete();
          subscription.unsubscribe();
        }
      }
    });
  });
}
