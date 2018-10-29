package com.scottlogic.hackathon.server;

import com.scottlogic.util.NoOpPrintStream;
import com.scottlogic.util.ThreadLocalPrintStream;

import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

public class BotThreadFactory implements ThreadFactory {

    private final ThreadFactory delegate = Executors.defaultThreadFactory();
    private final ThreadLocalPrintStream sysOut;

    BotThreadFactory(ThreadLocalPrintStream sysOut) {
        this.sysOut = sysOut;
    }

    @Override
    public Thread newThread(Runnable r) {
        return delegate.newThread(() -> {
            sysOut.setThreadLocalDelegate(NoOpPrintStream.SINGLETON);
            try {
                r.run();
            } finally {
                sysOut.resetThreadLocalDelegate();
            }
        });
    }
}
