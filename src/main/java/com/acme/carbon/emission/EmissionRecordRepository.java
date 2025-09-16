package com.acme.carbon.emission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmissionRecordRepository extends JpaRepository<EmissionRecord, Long> {
    List<EmissionRecord> findByCompanyId(Long companyId);
}
