package com.scottlogic.hackathon.game.engine;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.*;
import java.util.function.Consumer;

public class TimedConsumer<T> {
    private final ExecutorService executorService = Executors.newFixedThreadPool(16);

    public Set<Result<T>> consume(final Consumer<T> consumer, final Set<T> items, final long timeout, final TimeUnit timeUnit) throws InterruptedException, ExecutionException {
        final CompletionService<Result<T>> completionService = new ExecutorCompletionService<Result<T>>(executorService);

        items.stream().forEach(item -> {
            completionService.submit(() -> {
                final ExecutorService consumerExecutorService = Executors.newSingleThreadExecutor();
                final Future future = consumerExecutorService.submit(() -> {
                    consumer.accept(item);
                });
                boolean completed;
                try {
                    future.get(timeout, timeUnit);
                    completed = true;
                } catch (final Exception e) {
                    future.cancel(true);
                    completed = false;
                } finally {
                    consumerExecutorService.shutdownNow();
                }
                return new Result<T>(item, completed);
            });
        });

        final Set<Result<T>> consumeResults = new HashSet<>();
        for (int i = 0; i < items.size(); i++) {
            final Result<T> consumeResult = completionService.take().get();
            consumeResults.add(consumeResult);
        }

        return consumeResults;
    }

    static class Result<T> {
        private final T item;
        private final boolean completed;

        Result(final T item, final boolean completed) {

            this.item = item;
            this.completed = completed;
        }

        public T getItem() {
            return item;
        }

        public boolean isCompleted() {
            return completed;
        }
    }

    public void dispose() {
        executorService.shutdown();
    }
}
