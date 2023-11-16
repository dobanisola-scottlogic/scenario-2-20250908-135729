package com.scottlogic.hackathon.server.services.stores;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import io.dropwizard.util.Generics;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.context.internal.ManagedSessionContext;
import org.hibernate.criterion.Criterion;

import static com.google.common.base.Preconditions.checkNotNull;

public class AbstractStore<T> {
  private final SessionFactory sessionFactory;
  private final Class<?> entityClass;

  public AbstractStore(final SessionFactory sessionFactory) {
    this.sessionFactory = sessionFactory;
    this.entityClass = Generics.getTypeParameter(getClass());
  }

  protected Session currentSession() {
    return sessionFactory.getCurrentSession();
  }

  public T saveOrUpdate(final T entity) {
    currentSession().saveOrUpdate(checkNotNull(entity));

    return entity;
  }

  public boolean delete(final Serializable id) {
    final T entity = get(id);

    if (entity != null) {
      currentSession().delete(entity);

      return true;
    } else {
      return false;
    }
  }

  public T get(final Serializable id) {
    return (T) currentSession().get(entityClass, id);
  }

  public T get(final Criterion criterion) {
    return (T) currentSession()
            .createCriteria(entityClass)
            .add(criterion)
            .uniqueResult();
  }

  public List<T> list() {
    return list(null);
  }

  public List<T> list(final Criterion criterion) {
    final Criteria criteria = currentSession().createCriteria(entityClass);

    if (criterion != null) {
      criteria.add(criterion);
    }

    List<T> entities = criteria.list();

    return Collections.unmodifiableList(entities);
  }

  public void runInSession(Runnable runnable) {
    Session currentSession = sessionFactory.openSession();
    ManagedSessionContext.bind(currentSession);
    currentSession.beginTransaction();
    runnable.run();
    ManagedSessionContext.unbind(sessionFactory);
    currentSession.getTransaction().commit();
    currentSession.close();
  }
}
