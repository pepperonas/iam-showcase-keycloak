package io.celox.iam.service;

import io.celox.iam.dto.*;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final KeycloakAdminService keycloakAdminService;

    public UserService(KeycloakAdminService keycloakAdminService) {
        this.keycloakAdminService = keycloakAdminService;
    }

    public PagedResponse<UserDto> getUsers(int page, int size) {
        return keycloakAdminService.getUsers(page, size);
    }

    public UserDto getUserById(String userId) {
        return keycloakAdminService.getUserById(userId);
    }

    public UserDto createUser(CreateUserDto dto) {
        return keycloakAdminService.createUser(dto);
    }

    public UserDto updateUser(String userId, UpdateUserDto dto) {
        return keycloakAdminService.updateUser(userId, dto);
    }

    public void deleteUser(String userId) {
        keycloakAdminService.deleteUser(userId);
    }
}
