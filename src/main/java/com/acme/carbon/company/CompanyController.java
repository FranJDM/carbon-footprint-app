package com.acme.carbon.company;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:4200")
public class CompanyController {

    private final CompanyRepository companyRepository;

    public CompanyController(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    // Listar todas las empresas
    @GetMapping
    public List<Company> all() {
        return companyRepository.findAll();
    }

    // Obtener empresa por ID
    @GetMapping("/{id}")
    public ResponseEntity<Company> getById(@PathVariable Long id) {
        Optional<Company> company = companyRepository.findById(id);
        return company.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // Crear nueva empresa
    @PostMapping("/new-company")
    public Company create(@RequestBody Company company) {
        if (company.getName() == null || company.getName().isBlank()) {
            throw new IllegalArgumentException("El nombre de la empresa es obligatorio");
        }
        return companyRepository.save(company);
    }

    // Eliminar empresa por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!companyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        companyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // (Opcional) Actualizar empresa
    @PutMapping("/{id}")
    public ResponseEntity<Company> update(@PathVariable Long id, @RequestBody Company updatedCompany) {
        return companyRepository.findById(id)
            .map(existing -> {
                existing.setName(updatedCompany.getName());
                existing.setSector(updatedCompany.getSector());
                return ResponseEntity.ok(companyRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
