package io.celox.iam.service;

import io.celox.iam.dto.AuditLogDto;
import io.celox.iam.dto.PagedResponse;
import io.celox.iam.model.AuditLog;
import io.celox.iam.repository.AuditLogRepository;
import org.easymock.EasyMockExtension;
import org.easymock.Mock;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;

import static org.easymock.EasyMock.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * EasyMock-basierter Test fuer AuditService.
 * Demonstriert die Verwendung beider Mock-Frameworks (Mockito + EasyMock).
 */
@ExtendWith(EasyMockExtension.class)
class AuditServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    private AuditService auditService;

    @BeforeEach
    void setUp() {
        auditService = new AuditService(auditLogRepository);
    }

    @Test
    void shouldSaveAuditLog() {
        expect(auditLogRepository.save(anyObject(AuditLog.class)))
                .andReturn(AuditLog.builder().id(1L).build());
        replay(auditLogRepository);

        auditService.logAction("user-id", "testuser", "LOGIN", "/api/v1/token/inspect", "Token inspected", "127.0.0.1");

        verify(auditLogRepository);
    }

    @Test
    void shouldReturnPagedAuditLogs() {
        AuditLog log = AuditLog.builder()
                .id(1L)
                .userId("user-id")
                .username("admin")
                .action("CREATE_USER")
                .resource("/api/v1/users")
                .detail("User erstellt")
                .ipAddress("127.0.0.1")
                .timestamp(LocalDateTime.now())
                .build();

        expect(auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(0, 20)))
                .andReturn(new PageImpl<>(List.of(log), PageRequest.of(0, 20), 1));
        replay(auditLogRepository);

        PagedResponse<AuditLogDto> result = auditService.getAuditLogs(0, 20);

        assertNotNull(result);
        assertEquals(1, result.content().size());
        assertEquals("CREATE_USER", result.content().get(0).action());
        verify(auditLogRepository);
    }
}
