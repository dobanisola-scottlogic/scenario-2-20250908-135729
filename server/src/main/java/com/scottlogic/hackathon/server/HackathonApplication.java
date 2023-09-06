package com.scottlogic.hackathon.server;

import java.util.EnumSet;
import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import com.google.inject.Guice;
import com.google.inject.Injector;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.basic.BasicCredentialAuthFilter;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.hibernate.UnitOfWorkAwareProxyFactory;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import ru.vyarus.dropwizard.guice.GuiceBundle;

import com.scottlogic.hackathon.server.authentication.Authenticator;
import com.scottlogic.hackathon.server.authentication.Authorizer;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.AdminUser;
import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.GameTeam;
import com.scottlogic.hackathon.server.models.Hackathon;
import com.scottlogic.hackathon.server.models.MilestoneBot;
import com.scottlogic.hackathon.server.models.Team;
import com.scottlogic.hackathon.server.models.TeamBot;
import com.scottlogic.hackathon.server.resources.*;
import com.scottlogic.hackathon.server.services.AdminService;
import com.scottlogic.hackathon.server.services.TeamService;
import com.scottlogic.util.ThreadLocalPrintStream;

public class HackathonApplication extends Application<HackathonConfiguration> {
  public static void main(final String[] args) throws Exception {
    new HackathonApplication().run(args);
  }

  @Override
  public String getName() {
    return "hackathon";
  }

  @Override
  public void initialize(final Bootstrap<HackathonConfiguration> bootstrap) {
    bootstrap.addBundle(new AssetsBundle("/assets", "/", "index.html"));
    bootstrap.addBundle(new MultiPartBundle());
    bootstrap.addBundle(hibernateBundle);
    bootstrap.addBundle(
        GuiceBundle.builder()
            .useWebInstallers()
            .extensions(RemoteBotWebSocketServlet.class)
            .build());
  }

  private final HibernateBundle<HackathonConfiguration> hibernateBundle =
      new HibernateBundle<>(
          GameTeam.class,
          GameResult.class,
          Team.class,
          TeamBot.class,
          Hackathon.class,
          MilestoneBot.class,
          AdminUser.class) {
        @Override
        public DataSourceFactory getDataSourceFactory(final HackathonConfiguration configuration) {
          return configuration.getDataSourceFactory();
        }
      };

  @Override
  public void run(final HackathonConfiguration configuration, final Environment environment) {
    ThreadLocalPrintStream sysOut = new ThreadLocalPrintStream(System.out);
    System.setOut(sysOut);

    final Injector injector =
        Guice.createInjector(
            new HackathonModule(
                configuration, environment, hibernateBundle, new BotThreadFactory(sysOut)));

    hibernateBundle.getSessionFactory().openSession().createQuery("from GameResult").list();

    setupCrossOriginHeaders(environment);

    final Authenticator authenticator =
        new UnitOfWorkAwareProxyFactory(hibernateBundle)
            .create(
                Authenticator.class,
                new Class<?>[] {TeamService.class, AdminService.class},
                new Object[] {
                  injector.getInstance(TeamService.class), injector.getInstance(AdminService.class)
                });

    environment
        .jersey()
        .register(
            new AuthDynamicFeature(
                new BasicCredentialAuthFilter.Builder<User>()
                    .setAuthenticator(authenticator)
                    .setAuthorizer(new Authorizer())
                    .setRealm("Restricted Access")
                    .buildAuthFilter()));
    environment.jersey().register(new AuthValueFactoryProvider.Binder<>(User.class));
    environment.jersey().register(RolesAllowedDynamicFeature.class);

    environment.jersey().register(injector.getInstance(HackathonResource.class));
    environment.jersey().register(injector.getInstance(AdminResource.class));
    environment.jersey().register(injector.getInstance(GameResource.class));
    environment.jersey().register(injector.getInstance(TeamResource.class));
    environment.jersey().register(injector.getInstance(RemoteBotResource.class));
    environment.jersey().register(injector.getInstance(MilestoneResource.class));
    environment.jersey().register(injector.getInstance(LoginResource.class));
  }

  private void setupCrossOriginHeaders(final Environment environment) {
    final FilterRegistration.Dynamic filter =
        environment.servlets().addFilter("CrossOriginFilter", CrossOriginFilter.class);

        if ("dev".equals(System.getenv("ENVIRONMENT"))) {
            filter.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), false, "*");
        } else {
            filter.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), false, environment.getApplicationContext().getContextPath() + "*");
        }

        filter.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,POST,PUT,DELETE,HEAD,OPTIONS,PATCH");
        filter.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
        filter.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "*");
        filter.setInitParameter(CrossOriginFilter.ALLOW_CREDENTIALS_PARAM, "true");
    }
}
