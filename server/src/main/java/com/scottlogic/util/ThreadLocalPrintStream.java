package com.scottlogic.util;

import java.io.PrintStream;
import java.util.Locale;

/**
 * A {@linkplain PrintStream} that forwards to another PrintStream on a per-thread basis.
 * <p>
 * This class's {@link #printf(String, Object...) printf(...)}, {@link #format(String, Object...) format(...)}, and
 * {@link #append(char) append(...)} methods return the current thread's delegate rather than this object.
 * This is for a slight performance improvement, as it is assumed that chained calls to the PrintStream will remain
 * in the same thread, and so the additional cost of looking up the correct delegate each time is unnecessary.
 */
public final class ThreadLocalPrintStream extends PrintStream {

    private final PrintStream defaultDelegate;
    private final ThreadLocal<PrintStream> delegate = new ThreadLocal<PrintStream>() {
        @Override protected PrintStream initialValue() {
            return defaultDelegate;
        }
    };

    /**
     * Constructor for ThreadLocalPrintStream.
     * @param defaultDelegate The {@linkplain PrintStream} to delegate to,
     *                        unless another has been explicitly {@linkplain #setThreadLocalDelegate(PrintStream) set}
     */
    public ThreadLocalPrintStream(PrintStream defaultDelegate) {
        super(NoOpOutputStream.SINGLETON);
        this.defaultDelegate = defaultDelegate;
    }

    /**
     * Sets the {@linkplain PrintStream} that the current thread should delegate to.
     * @param delegate The print stream that the current thread should delegate to
     */
    public void setThreadLocalDelegate(PrintStream delegate) {
        if(delegate==this) {
            throw new IllegalArgumentException("ThreadLocalPrintStream cannot set itself as a delegate.");
        }
        if(delegate==defaultDelegate) {
            this.delegate.remove();
        } else {
            this.delegate.set(delegate);
        }
    }

    public void resetThreadLocalDelegate() {
        delegate.remove();
    }

    @Override public void flush() { delegate.get().flush(); }
    @Override public void close() { delegate.get().close(); }
    @Override public void write(int b) { delegate.get().write(b); }
    @Override public void write(byte[] buf, int off, int len) { delegate.get().write(buf, off, len); }
    @Override public void print(boolean b) { delegate.get().print(b); }
    @Override public void print(char c) { delegate.get().print(c); }
    @Override public void print(int i) { delegate.get().print(i); }
    @Override public void print(long l) { delegate.get().print(l); }
    @Override public void print(float f) { delegate.get().print(f); }
    @Override public void print(double d) { delegate.get().print(d); }
    @Override public void print(char[] s) { delegate.get().print(s); }
    @Override public void print(String s) { delegate.get().print(s); }
    @Override public void print(Object obj) { delegate.get().print(obj); }
    @Override public void println() { delegate.get().println(); }
    @Override public void println(boolean x) { delegate.get().println(x); }
    @Override public void println(char x) { delegate.get().println(x); }
    @Override public void println(int x) { delegate.get().println(x); }
    @Override public void println(long x) { delegate.get().println(x); }
    @Override public void println(float x) { delegate.get().println(x); }
    @Override public void println(double x) { delegate.get().println(x); }
    @Override public void println(char[] x) { delegate.get().println(x); }
    @Override public void println(String x) { delegate.get().println(x); }
    @Override public void println(Object x) { delegate.get().println(x); }
    @Override public PrintStream printf(String format, Object... args) { return delegate.get().printf(format, args); }
    @Override public PrintStream printf(Locale l, String format, Object... args) { return delegate.get().printf(l, format, args); }
    @Override public PrintStream format(String format, Object... args) { return delegate.get().format(format, args); }
    @Override public PrintStream format(Locale l, String format, Object... args) { return delegate.get().format(l, format, args); }
    @Override public PrintStream append(CharSequence csq) { return delegate.get().append(csq); }
    @Override public PrintStream append(CharSequence csq, int start, int end) { return delegate.get().append(csq, start, end); }
    @Override public PrintStream append(char c) { return delegate.get().append(c); }
    @Override public boolean checkError() { return delegate.get().checkError(); }
}
