package io.celox.iam.repository;

import io.celox.iam.model.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByKeycloakId(String keycloakId);

    Optional<AppUser> findByEmail(String email);

    Page<AppUser> findAll(Pageable pageable);
}
