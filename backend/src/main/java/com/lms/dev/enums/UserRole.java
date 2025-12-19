package com.lms.dev.enums;

import lombok.Getter;

@Getter
public enum UserRole {

    STUDENT("ROLE_STUDENT"),
    ADMIN("ROLE_ADMIN"),
    INSTRUCTOR("ROLE_INSTRUCTOR");

    private final String roleName;

    UserRole(String roleName) {
        this.roleName = roleName;
    }
}