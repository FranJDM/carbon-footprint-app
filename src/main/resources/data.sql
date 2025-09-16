-- Datos iniciales de Company
INSERT INTO company (name, sector) VALUES ('Acme Energy', 'Energía');
INSERT INTO company (name, sector) VALUES ('Green Transport', 'Transporte');
INSERT INTO company (name, sector) VALUES ('EcoFoods', 'Alimentación');
INSERT INTO company (name, sector) VALUES ('BlueSteel', 'Manufactura');
INSERT INTO company (name, sector) VALUES ('SunPower', 'Energía Solar');
INSERT INTO company (name, sector) VALUES ('WaterPure', 'Tratamiento de Agua');
INSERT INTO company (name, sector) VALUES ('BioPharma', 'Farmacéutica');
INSERT INTO company (name, sector) VALUES ('SkyLogistics', 'Logística');

-- Datos iniciales de EmissionRecord
INSERT INTO emission_record (type, amount, co2e, date, company_id)
VALUES ('Electricidad', 1200.5, 450.75, '2025-01-10', 1);

INSERT INTO emission_record (type, amount, co2e, date, company_id)
VALUES ('Gas Natural', 300.0, 600.0, '2025-02-15', 1);

INSERT INTO emission_record (type, amount, co2e, date, company_id)
VALUES ('Transporte', 500.0, 1250.0, '2025-03-05', 2);

INSERT INTO emission_record (type, amount, co2e, date, company_id)
VALUES ('Refrigeración', 200.0, 800.0, '2025-04-01', 3);

INSERT INTO emission_record (type, amount, co2e, date, company_id)
VALUES ('Electricidad', 950.0, 360.0, '2025-01-20', 4);

INSERT INTO emission_record (type, amount, co2e, date, company_id)
VALUES ('Gasóleo', 400.0, 1050.0, '2025-02-12', 5);

INSERT INTO emission_record (type, amount, co2e, date, company_id)
VALUES ('Agua Caliente', 700.0, 200.0, '2025-03-15', 6);

INSERT INTO emission_record (type, amount, co2e, date, company_id)
VALUES ('Productos Químicos', 250.0, 1750.0, '2025-04-18', 7);

INSERT INTO emission_record (type, amount, co2e, date, company_id)
VALUES ('Flota Aérea', 1200.0, 4200.0, '2025-05-10', 8);