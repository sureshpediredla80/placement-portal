package com.college.placement.repository;

import com.college.placement.entity.Certificate;
import com.college.placement.entity.CertificateStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Page<Certificate> findByStudentId(Long studentId, Pageable pageable);
    Page<Certificate> findByStatus(CertificateStatus status, Pageable pageable);
    Page<Certificate> findByStudentIdAndStatus(Long studentId, CertificateStatus status, Pageable pageable);
}
