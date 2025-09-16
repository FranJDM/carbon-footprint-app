package com.acme.carbon.emission;

import com.acme.carbon.company.Company;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class EmissionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;      // ej: Electricidad, Gas, Transporte
    private double amount;    // cantidad (ej: kWh, litros)
    private double co2e;      // equivalente en kgCO2e
    private LocalDate date;   // fecha del registro

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public double getCo2e() { return co2e; }
    public void setCo2e(double co2e) { this.co2e = co2e; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
}
