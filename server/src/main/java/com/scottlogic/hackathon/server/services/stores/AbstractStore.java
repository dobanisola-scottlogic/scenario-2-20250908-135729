package com.scottlogic.hackathon.server.services.stores;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import io.dropwizard.util.Generics;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.context.internal.ManagedSessionContext;
import org.hibernate.query.SelectionQuery;

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

  private SelectionQuery<?> createQueryByProperty(final String propertyName, final String value, boolean ignoreCase) {
    String queryString;
    if (ignoreCase) {
      queryString = String.format("from %s where %s ilike :value",
          entityClass.getSimpleName(),
          propertyName);
    } else {
      queryString = String.format("from %s where %s like :value",
          entityClass.getSimpleName(),
          propertyName);
    }
    return currentSession().createSelectionQuery(queryString, entityClass)
        .setParameter("value", value);
  }

  public T save(final T entity) {
    currentSession().persist(checkNotNull(entity));

    return entity;
  }

  public T saveOrUpdate(final T entity) {
    currentSession().merge(checkNotNull(entity));

    return entity;
  }

  public boolean delete(final Serializable id) {
    final T entity = get(id);

    if (entity != null) {
      currentSession().remove(entity);

      return true;
    } else {
      return false;
    }
  }

  @SuppressWarnings("unchecked")
  public T get(final Serializable id) {
    return (T) currentSession().get(entityClass, id);
  }

  @SuppressWarnings("unchecked")
  public T get(final String propertyName, final String value, final boolean ignoreCase) {
    var query = createQueryByProperty(propertyName, value, ignoreCase);

    return (T) query.getSingleResultOrNull();
  }

  public T get(final String propertyName, final String value) {
    return get(propertyName, value, false);
  }

  public List<T> list() {
    @SuppressWarnings("unchecked")
    var entities = (List<T>) currentSession().createSelectionQuery(
        String.format("from %s", entityClass.getSimpleName()),
        entityClass)
        .getResultList();
    return Collections.unmodifiableList(entities);
  }

  public List<T> list(final String propertyName, final String value, boolean ignoreCase) {
    var query = createQueryByProperty(propertyName, value, ignoreCase);

    @SuppressWarnings("unchecked")
    var entities = (List<T>) query.list();
    return Collections.unmodifiableList(entities);
  }

  public List<T> list(final String propertyName, final String value) {
    return list(propertyName, value, false);
  }

  public void runInSession(Runnable runnable) {
    sessionFactory.inSession(session -> {
      ManagedSessionContext.bind(session);
      session.beginTransaction();
      runnable.run();
      ManagedSessionContext.unbind(sessionFactory);
      session.getTransaction().commit();
    });
  }
}
