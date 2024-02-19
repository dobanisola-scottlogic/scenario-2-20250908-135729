package com.scottlogic.hackathon.helpers;

import java.io.UnsupportedEncodingException;
import java.util.Base64;

public class BasicAuthHeader {
    public static final String KEY = "Authorization";
    private String username;
    private String password;

    public BasicAuthHeader(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getHeaderValue() {
        String userPassCombo = String.format("%s:%s", username, password);
        try {
            String encoded = Base64.getEncoder().encodeToString(userPassCombo.getBytes("UTF-8"));
            return String.format("Basic %s", encoded);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
