import { useState, useEffect } from 'react';
import { catalogService } from '../../../services/mock/catalog';
import type { Section } from '../../../core/types/catalog';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from '../../../utils/toast';

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    order: 0,
    isActive: true,
  });

  const loadSections = async () => {
    setIsLoading(true);
    try {
      const data = await catalogService.getSections();
      setSections(data);
    } catch (error) {
      console.error('Error loading sections:', error);
      toast.error('Error al cargar secciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const openNewModal = () => {
    setEditingSection(null);
    setFormData({ name: '', slug: '', order: sections.length + 1, isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (sec: Section) => {
    setEditingSection(sec);
    setFormData({ name: sec.name, slug: sec.slug, order: sec.order, isActive: sec.isActive });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (editingSection) {
        await catalogService.updateSection(editingSection.id, formData);
      } else {
        await catalogService.createSection(formData);
      }
      closeModal();
      await loadSections();
      toast.success(editingSection ? 'Sección actualizada correctamente' : 'Sección creada correctamente');
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Ocurrió un error al guardar la sección.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta sección? Esto podría afectar a los productos asociados.')) return;
    
    try {
      await catalogService.deleteSection(id);
      await loadSections();
      toast.success('Sección eliminada');
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Error al eliminar la sección.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-brand-morado)', margin: 0 }}>
          Gestión de Secciones
        </h2>
        <Button onClick={openNewModal}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} /> Nueva Sección
        </Button>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ minWidth: '600px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-brand-crema)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>ID</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Nombre / Slug</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Orden</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Estado</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  Cargando...
                </td>
              </tr>
            ) : sections.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  Aún no hay secciones creadas.
                </td>
              </tr>
            ) : (
              sections.map((sec) => (
                <tr key={sec.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{sec.id.slice(-6)}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{sec.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>/{sec.slug}</div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-primary)' }}>{sec.order}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      backgroundColor: sec.isActive ? '#D1FAE5' : '#FEE2E2', 
                      color: sec.isActive ? '#065F46' : '#991B1B', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.75rem', 
                      fontWeight: 500 
                    }}>
                      {sec.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Button variant="outline" size="sm" onClick={() => openEditModal(sec)}>
                      <Pencil size={14} style={{ marginRight: '0.25rem' }} /> Editar
                    </Button>
                    <Button variant="outline" size="sm" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }} onClick={() => handleDelete(sec.id)}>
                      <Trash2 size={14} style={{ marginRight: '0.25rem' }} /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear / Editar */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingSection ? 'Editar Sección' : 'Nueva Sección'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Ej: Tortas Clásicas"
          />
          <Input 
            label="Slug (URL amigable)"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            placeholder="ej: tortas-clasicas"
          />
          <Input 
            label="Orden de aparición"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleInputChange}
            required
            min={1}
          />
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <span style={{ color: 'var(--color-text-primary)' }}>Sección activa (visible)</span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <Button type="button" variant="ghost" onClick={closeModal} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Guardando...' : editingSection ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
