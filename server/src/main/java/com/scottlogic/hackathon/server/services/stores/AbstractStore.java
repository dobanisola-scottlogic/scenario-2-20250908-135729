package com.scottlogic.hackathon.server.services.stores;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import io.dropwizard.util.Generics;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.context.internal.ManagedSessionContext;
import org.hibernate.criterion.Criterion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.google.common.base.Preconditions.checkNotNull;

public class AbstractStore<T> {
  private final SessionFactory sessionFactory;
  private final Class<?> entityClass;
  protected final Logger logger;

  public AbstractStore(final SessionFactory sessionFactory) {
    this.sessionFactory = sessionFactory;
    this.entityClass = Generics.getTypeParameter(getClass());
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  protected Session currentSession() {
    return sessionFactory.getCurrentSession();
  }

  public T saveOrUpdate(final T entity) {
    try {
      currentSession().saveOrUpdate(checkNotNull(entity));
      return entity;
    } catch (final HibernateException ex) {
      logger.error(String.format("Error adding %s to database", entityClass.getName()), ex);
      return null;
    }
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
    T entity;
    try {
      entity = (T) currentSession().createCriteria(entityClass).add(criterion).uniqueResult();
    } catch (final HibernateException ex) {
      logger.error(
          String.format("Error retrieving %s from database", entityClass.getName()), criterion, ex);
      entity = null;
    }
    return entity;
  }

  public List<T> list() {
    return list(null);
  }

  public List<T> list(final Criterion criterion) {
    List<T> entities;
    try {
      final Criteria criteria = currentSession().createCriteria(entityClass);

      if (criterion != null) {
        criteria.add(criterion);
      }

      entities = criteria.list();
    } catch (final HibernateException ex) {
      logger.error(
          String.format("Error retrieving %s list from database", entityClass.getName()),
          criterion,
          ex);
      entities = Collections.emptyList();
    }
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
