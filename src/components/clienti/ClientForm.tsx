import React, { useState } from 'react';
import { Client } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: Client) => void;
  onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Client>(
    initialData || {
      ID_client: '',
      Nume_client: '',
      CUI: '',
      Adresa: '',
      IBAN: '',
      Banca: '',
      Persoana_contact: '',
      Email: '',
      Telefon: '',
      Status_client: '',
    }
  );
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validare simplă
    if (!form.Nume_client || !form.CUI) {
      setError('Numele clientului și CUI sunt obligatorii.');
      return;
    }
    setError('');
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="Nume_client" value={form.Nume_client} onChange={handleChange} placeholder="Nume client" required />
        <Input name="CUI" value={form.CUI} onChange={handleChange} placeholder="CUI" required />
        <Input name="Adresa" value={form.Adresa} onChange={handleChange} placeholder="Adresă" />
        <Input name="IBAN" value={form.IBAN} onChange={handleChange} placeholder="IBAN" />
        <Input name="Banca" value={form.Banca} onChange={handleChange} placeholder="Banca" />
        <Input name="Persoana_contact" value={form.Persoana_contact} onChange={handleChange} placeholder="Persoană contact" />
        <Input name="Email" value={form.Email} onChange={handleChange} placeholder="Email" type="email" />
        <Input name="Telefon" value={form.Telefon} onChange={handleChange} placeholder="Telefon" />
        <Input name="Status_client" value={form.Status_client || ''} onChange={handleChange} placeholder="Status" />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Renunță</Button>
        <Button type="submit">Salvează</Button>
      </div>
    </form>
  );
}; 