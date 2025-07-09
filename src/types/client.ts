export interface Client {
  ID_client: string;
  Nume_client: string;
  CUI: string;
  Adresa: string;
  IBAN: string;
  Banca: string;
  Persoana_contact: string;
  Email: string;
  Telefon: string;
  Status_client?: string; // opțional, dacă există în sheet
} 