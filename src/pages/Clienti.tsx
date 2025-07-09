import React, { useState, useEffect } from 'react';
import { Client } from '@/types/client';
import { DataTable } from '@/components/common/DataTable';
import { ClientForm } from '@/components/clienti/ClientForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getClienti, addClient, updateClient, deleteClient } from '@/lib/api';

const columns = [
  { accessorKey: 'ID_client', header: 'ID' },
  { accessorKey: 'Nume_client', header: 'Nume client' },
  { accessorKey: 'CUI', header: 'CUI' },
  { accessorKey: 'Adresa', header: 'Adresă' },
  { accessorKey: 'IBAN', header: 'IBAN' },
  { accessorKey: 'Banca', header: 'Banca' },
  { accessorKey: 'Persoana_contact', header: 'Persoană contact' },
  { accessorKey: 'Email', header: 'Email' },
  { accessorKey: 'Telefon', header: 'Telefon' },
  { accessorKey: 'Status_client', header: 'Status' },
  {
    id: 'actions',
    header: 'Acțiuni',
    cell: ({ row }: any) => row.original.renderActions?.(),
    enableSorting: false,
    enableColumnFilter: false,
  },
];

const ClientiPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    setError(null);
    try {
      const res = await getClienti();
      if (res.success && Array.isArray(res.data)) {
        setClients(res.data);
      } else {
        setError(res.error || 'Eroare la încărcarea clienților');
      }
    } catch (e) {
      setError('Eroare la încărcarea clienților');
    } finally {
      setLoading(false);
    }
  }

  // Adaugă acțiuni custom la fiecare rând
  const dataWithActions = clients.map((client) => ({
    ...client,
    renderActions: () => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => handleEdit(client)} disabled={actionLoading}>Editează</Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(client.ID_client)} disabled={actionLoading}>Șterge</Button>
      </div>
    ),
  }));

  function handleAdd() {
    setEditClient(null);
    setModalOpen(true);
  }

  function handleEdit(client: Client) {
    setEditClient(client);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Sigur vrei să ștergi acest client?')) return;
    setActionLoading(true);
    try {
      const res = await deleteClient(id);
      if (res.success) {
        setClients((prev) => prev.filter((c) => c.ID_client !== id));
      } else {
        alert(res.error || 'Eroare la ștergere');
      }
    } catch (e) {
      alert('Eroare la ștergere');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleFormSubmit(data: Client) {
    setActionLoading(true);
    try {
      if (editClient) {
        // Editare
        const res = await updateClient(editClient.ID_client, data);
        if (res.success) {
          setClients((prev) => prev.map((c) => (c.ID_client === editClient.ID_client ? data : c)));
        } else {
          alert(res.error || 'Eroare la editare');
        }
      } else {
        // Adăugare
        const res = await addClient(data);
        if (res.success && res.data) {
          setClients((prev) => [...prev, res.data]);
        } else {
          alert(res.error || 'Eroare la adăugare');
        }
      }
      setModalOpen(false);
      setEditClient(null);
    } catch (e) {
      alert('Eroare la salvare');
    } finally {
      setActionLoading(false);
    }
  }

  function handleCancel() {
    setModalOpen(false);
    setEditClient(null);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clienți</h1>
        <Button onClick={handleAdd} disabled={actionLoading}>Adaugă client nou</Button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={dataWithActions} />
      )}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogTitle>{editClient ? 'Editează client' : 'Adaugă client nou'}</DialogTitle>
          <ClientForm
            initialData={editClient || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientiPage; 