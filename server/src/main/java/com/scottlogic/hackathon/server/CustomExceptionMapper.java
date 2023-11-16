package com.scottlogic.hackathon.server;

import java.util.UUID;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Provider
public class CustomExceptionMapper implements ExceptionMapper<Exception> {
    private final Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    @SneakyThrows
    @Override
    public Response toResponse(Exception ex) {
        if (ex instanceof WebApplicationException) {
            throw ex;
        }

        logger.error(ex.getMessage(), ex);

        UUID uuid = UUID.randomUUID();

        ErrorMessage error = new ErrorMessage(
                uuid.toString(),
                ex.getMessage());

        return Response
                .status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(error)
                .type(MediaType.APPLICATION_JSON)
                .build();
    }
}
