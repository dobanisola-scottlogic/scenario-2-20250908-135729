package com.scottlogic.hackathon.server.util;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.scottlogic.util.HibernateSessionUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HibernateSessionUtilsTest {

    @Mock
    private SessionFactory sessionFactory;

    @Test
    void shouldCommitTransaction() {
        var session = mock(Session.class);
        var transaction = mock(Transaction.class);

        when(sessionFactory.openSession()).thenReturn(session);
        when(session.beginTransaction()).thenReturn(transaction);
        when(transaction.isActive()).thenReturn(true);

        HibernateSessionUtils.request(sessionFactory, () -> null);

        verify(transaction).commit();
    }

    @Test
    void shouldRollbackTransactionIfExceptionThrown() {
        var session = mock(Session.class);
        var transaction = mock(Transaction.class);

        when(sessionFactory.openSession()).thenReturn(session);
        when(session.beginTransaction()).thenReturn(transaction);
        when(transaction.isActive()).thenReturn(true);

        var thrown = assertThrows(RuntimeException.class, () -> {
            HibernateSessionUtils.request(sessionFactory, () -> {
                throw new RuntimeException("uh oh");
            });
        });

        assertEquals("uh oh", thrown.getMessage());
        verify(transaction).rollback();
    }
}
