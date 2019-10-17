export default function createDeferred() {
  const deferred = {};

  deferred.promise = new Promise((resolve, reject) => {
    deferred.reject = reject;
    deferred.resolve = resolve;
  });

  return deferred;
}
