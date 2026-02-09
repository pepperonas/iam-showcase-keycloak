package io.celox.iam.service;

import io.celox.iam.dto.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private KeycloakAdminService keycloakAdminService;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldDelegateGetUsersToKeycloak() {
        PagedResponse<UserDto> expected = new PagedResponse<>(List.of(), 0, 20, 0, 0);
        when(keycloakAdminService.getUsers(0, 20)).thenReturn(expected);

        PagedResponse<UserDto> result = userService.getUsers(0, 20);

        assertEquals(expected, result);
        verify(keycloakAdminService).getUsers(0, 20);
    }

    @Test
    void shouldDelegateGetUserByIdToKeycloak() {
        UserDto expected = new UserDto("id1", "user", "user@test.de", "Test", "User", true, List.of(), List.of(), null);
        when(keycloakAdminService.getUserById("id1")).thenReturn(expected);

        UserDto result = userService.getUserById("id1");

        assertEquals(expected, result);
        verify(keycloakAdminService).getUserById("id1");
    }

    @Test
    void shouldDelegateCreateUserToKeycloak() {
        CreateUserDto dto = new CreateUserDto("newuser", "new@test.de", "Password1", "New", "User", List.of("user"), List.of("api-read"));
        UserDto expected = new UserDto("id2", "newuser", "new@test.de", "New", "User", true, List.of("user"), List.of("api-read"), null);
        when(keycloakAdminService.createUser(dto)).thenReturn(expected);

        UserDto result = userService.createUser(dto);

        assertEquals(expected, result);
        verify(keycloakAdminService).createUser(dto);
    }

    @Test
    void shouldDelegateDeleteUserToKeycloak() {
        doNothing().when(keycloakAdminService).deleteUser("id1");

        userService.deleteUser("id1");

        verify(keycloakAdminService).deleteUser("id1");
    }
}
