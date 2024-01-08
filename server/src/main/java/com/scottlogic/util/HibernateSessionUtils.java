package com.scottlogic.util;

import java.util.function.Supplier;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.context.internal.ManagedSessionContext;

public final class HibernateSessionUtils {

    private HibernateSessionUtils() {

    }

    public static <T> T request(SessionFactory factory, Supplier<T> request) {
        Transaction transaction = null;

        try (Session session = factory.openSession()) {
            ManagedSessionContext.bind(session);
            transaction = session.beginTransaction();
            T result = request.get();
            commit(transaction);
            return result;
        } catch (Throwable throwable) {
            rollback(transaction);
            throw throwable;
        } finally {
            ManagedSessionContext.unbind(factory);
        }
    }

    private static void rollback(Transaction transaction) {
        if (transaction != null && transaction.isActive()) {
            transaction.rollback();
        }
    }

    private static void commit(Transaction transaction) {
        if (transaction != null && transaction.isActive()) {
            transaction.commit();
        }
    }
}
