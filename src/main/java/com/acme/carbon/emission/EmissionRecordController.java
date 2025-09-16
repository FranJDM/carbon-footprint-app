package com.acme.carbon.emission;

import com.acme.carbon.company.Company;
import com.acme.carbon.company.CompanyRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/emissions")
@CrossOrigin(origins = "http://localhost:4200")
public class EmissionRecordController {

    private final EmissionRecordRepository emissionRepository;
    private final CompanyRepository companyRepository;

    public EmissionRecordController(EmissionRecordRepository emissionRepository,
                                    CompanyRepository companyRepository) {
        this.emissionRepository = emissionRepository;
        this.companyRepository = companyRepository;
    }

    // CORRECCIÓN: Cambiar @PathVariable EmissionRecord id por @PathVariable Long id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmission(@PathVariable Long id) {
        try {
            // Verificar si la emisión existe antes de intentar eliminarla
            Optional<EmissionRecord> emission = emissionRepository.findById(id);
            if (emission.isPresent()) {
                emissionRepository.deleteById(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener todas las emisiones
    @GetMapping
    public List<EmissionRecord> all() {
        return emissionRepository.findAll();
    }

    // Obtener emisiones por empresa
    @GetMapping("/company/{companyId}")
    public List<EmissionRecord> byCompany(@PathVariable Long companyId) {
        return emissionRepository.findByCompanyId(companyId);
    }

    // Crear una nueva emisión
    @PostMapping
    public EmissionRecord create(@RequestBody EmissionRecord record) {
        Long companyId = record.getCompany().getId();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));

        record.setCompany(company);
        record.setDate(LocalDate.now());

        return emissionRepository.save(record);
    }
}