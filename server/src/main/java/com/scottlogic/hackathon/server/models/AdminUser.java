package com.scottlogic.hackathon.server.models;

import io.dropwizard.auth.basic.BasicCredentials;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Entity
public class AdminUser {
    private static AdminUser admin;
    private static UUID adminId;

    @Id
    private UUID id;

    @NotNull
    private String password;

    public AdminUser() {
    }

    private AdminUser(UUID id, String password) {
        this.id = id;
        this.password = password;
    }

    public static AdminUser getAdmin(){
        if (admin == null){
            adminId = UUID.randomUUID();
            admin = new AdminUser(adminId, "secret");
        }
        return admin;
    }

    public static UUID getAdminId(){
        return adminId;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    public String getPassword() {
        return this.password;
    }
}
