export class EventQueue<T> {
  private queue: T[] = [];
  private isProcessing = false;

  constructor(private handler: (item: T) => Promise<void>) {}

  enqueue(item: T) {
    this.queue.push(item);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing) return;

    while (this.queue.length > 0) {
      const currentItem = this.queue.shift();
      if (!currentItem) {
        // This should not happen, but just to be safe
        continue;
      }

      this.isProcessing = true;

      try {
        await this.handler(currentItem);
      } finally {
        this.isProcessing = false;
      }
    }
  }
}