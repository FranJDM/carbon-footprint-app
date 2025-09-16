export interface EmissionRecord {
  id?: number;
  type: string;
  amount: number;
  co2e: number;
  date?: string;
  company: {
    id: number;
  };
}

// Interfaz para el objeto que devuelve la API (más completo)
export interface EmissionRecordDetails extends EmissionRecord {
    id: number;
    date: string;
    company: {
        id: number;
        name: string;
        sector: string;
    }
}