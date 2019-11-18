import createDeferred from './createDeferred';

export default function waitForConnected(directLine) {
  const connectedDeferred = createDeferred();
  const subscription = directLine.connectionStatus$.subscribe({
    error: error => connectedDeferred.reject(error),
    next: value => {
      if (value === 2) {
        connectedDeferred.resolve();
        subscription.unsubscribe();
      } else if (value === 4) {
        connectedDeferred.reject(new Error('Disconnected from Direct Line Speech.'));
        subscription.unsubscribe();
      }
    }
  });

  return connectedDeferred.promise;
}
