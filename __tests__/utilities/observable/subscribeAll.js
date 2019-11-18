export default function subscribeAll(observable) {
  const values = [];

  return new Promise((resolve, reject) => {
    observable.subscribe({
      complete() {
        resolve(values);
      },
      error(error) {
        reject(error);
      },
      next(value) {
        values.push(value);
      }
    });
  });
}
