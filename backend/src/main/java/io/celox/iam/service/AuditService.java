package io.celox.iam.service;

import io.celox.iam.dto.AuditLogDto;
import io.celox.iam.dto.PagedResponse;
import io.celox.iam.model.AuditLog;
import io.celox.iam.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(String userId, String username, String action, String resource, String detail, String ipAddress) {
        AuditLog log = AuditLog.builder()
                .userId(userId)
                .username(username)
                .action(action)
                .resource(resource)
                .detail(detail)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(log);
    }

    public PagedResponse<AuditLogDto> getAuditLogs(int page, int size) {
        Page<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size));
        return new PagedResponse<>(
                logs.getContent().stream().map(this::toDto).toList(),
                logs.getNumber(),
                logs.getSize(),
                logs.getTotalElements(),
                logs.getTotalPages()
        );
    }

    private AuditLogDto toDto(AuditLog log) {
        return new AuditLogDto(
                log.getId(),
                log.getUserId(),
                log.getUsername(),
                log.getAction(),
                log.getResource(),
                log.getDetail(),
                log.getIpAddress(),
                log.getTimestamp() != null ? log.getTimestamp().toString() : null
        );
    }
}
