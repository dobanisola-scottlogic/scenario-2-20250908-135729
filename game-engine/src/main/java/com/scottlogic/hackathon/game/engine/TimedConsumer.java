package com.scottlogic.hackathon.game.engine;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.*;
import java.util.function.Consumer;

public class TimedConsumer<T> {
    private final Executor executor;
    private final Runnable onShutdown;

    public TimedConsumer(final Executor executor, final Runnable onShutdown) {
        this.executor = executor;
        this.onShutdown = onShutdown;
    }

    public Set<Result<T>> consume(
            final Consumer<T> consumer, final Set<T> items, final long timeout, final TimeUnit timeUnit
    ) throws InterruptedException, ExecutionException {
        final CompletionService<Result<T>> completionService = new ExecutorCompletionService<>(executor);

        items.forEach(item ->
                completionService.submit(() -> {
                    final ExecutorService consumerExecutorService = Executors.newSingleThreadExecutor();
                    final Future future = consumerExecutorService.submit(() -> consumer.accept(item));
                    boolean completed;
                    Exception exception = null;
                    try {
                        future.get(timeout, timeUnit);
                        completed = true;
                    } catch (final Exception e) {
                        future.cancel(true);
                        completed = false;
                        exception = e;
                    } finally {
                        consumerExecutorService.shutdownNow();
                    }
                    return new Result<>(item, completed, exception);
                })
        );

        final Set<Result<T>> consumeResults = new HashSet<>();
        for (int i = 0; i < items.size(); i++) {
            final Result<T> consumeResult = completionService.take().get();
            consumeResults.add(consumeResult);
        }

        return consumeResults;
    }

    public void dispose() {
        onShutdown.run();
    }

    static class Result<T> {
        private final T item;
        private final boolean completed;
        private final Exception exception;

        Result(final T item, final boolean completed, final Exception exception) {
            this.item = item;
            this.completed = completed;
            this.exception = exception;
        }

        public T getItem() {
            return item;
        }

        public boolean isCompleted() {
            return completed;
        }

        public Exception getException() {
            return exception;
        }
    }
}
