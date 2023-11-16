package com.scottlogic.hackathon.server;

public class ErrorMessage {
    private final String errorCode;
    private final String message;

    public ErrorMessage(final String errorCode, final String message) {
        this.errorCode = errorCode;
        this.message = message;
    }

    public String getErrorCode() {
        return this.errorCode;
    }

    public String getMessage() {
        return message;
    }
}
