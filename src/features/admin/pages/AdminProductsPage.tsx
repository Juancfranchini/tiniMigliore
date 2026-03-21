import { useState, useEffect } from 'react';
import { catalogService } from '../../../services/api/catalog';
import type { Product, Section } from '../../../core/types/catalog';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Input } from '../../../components/ui/Input';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { ImageUploader } from '../../../components/ui/ImageUploader';
import type { CloudinaryImageDetails } from '../../../core/types/cloudinary';
import { toast } from '../../../utils/toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Confirm Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    sectionId: '',
    imageUrl: '',
    imageDetails: undefined as CloudinaryImageDetails | undefined,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, sectionsData] = await Promise.all([
        catalogService.getProducts(),
        catalogService.getSections()
      ]);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    setEditingProduct(null);
    setFormData({ 
      name: '', 
      description: '', 
      price: 0, 
      sectionId: sections.length > 0 ? sections[0].id : '', 
      imageUrl: '', 
      imageDetails: undefined
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({ 
      name: prod.name, 
      description: prod.description, 
      price: prod.price, 
      sectionId: prod.sectionId, 
      imageUrl: prod.imageUrl, 
      imageDetails: prod.imageDetails
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sectionId) {
      toast.warning('Por favor selecciona una sección');
      return;
    }

    setIsSaving(true);
    
    try {
      if (editingProduct) {
        await catalogService.updateProduct(editingProduct.id, formData);
      } else {
        await catalogService.createProduct(formData);
      }
      closeModal();
      await loadData();
      toast.success(editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Ocurrió un error al guardar el producto.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await catalogService.deleteProduct(productToDelete);
      await loadData();
      toast.success('Producto eliminado correctamente');
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Type narrowing for checkbox
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getSectionName = (sectionId: string) => {
    return sections.find(s => s.id === sectionId)?.name || 'Desconocida';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-brand-morado)', margin: 0 }}>
          Gestión de Productos
        </h2>
        <Button onClick={openNewModal}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} /> Nuevo Producto
        </Button>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-brand-crema)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Producto</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Sección</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Precio</th>
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
            ) : products.length === 0 ? (
               <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  Aún no hay productos creados.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {product.imageUrl ? (
                       <img src={product.imageUrl} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <ImageIcon size={20} color="var(--color-text-secondary)" />
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>ID: {product.id.slice(-6)}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                    {getSectionName(product.sectionId)}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-primary)' }}>
                    {formatPrice(product.price)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Button variant="outline" size="sm" onClick={() => openEditModal(product)}>
                      <Pencil size={14} style={{ marginRight: '0.25rem' }} /> Editar
                    </Button>
                    <Button variant="outline" size="sm" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }} onClick={() => handleDeleteRequest(product.id)}>
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
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <Input 
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Ej: Lemon Pie"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              Descripción
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontFamily: 'inherit',
                fontSize: '0.875rem'
              }}
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Input 
              label="Precio (ARS)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
              min={0}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Sección
              </label>
              <select
                name="sectionId"
                value={formData.sectionId}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.875rem'
                }}
              >
                <option value="" disabled>Seleccione una sección</option>
                {sections.map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              Imagen del Producto
            </label>
            <ImageUploader 
              currentImageUrl={formData.imageUrl}
              recommendedText="Relación 1:1, sugerido 1200x1200 px"
              onUploadSuccess={(details: CloudinaryImageDetails) => {
                setFormData(prev => ({ ...prev, imageUrl: details.imageUrl, imageDetails: details }));
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <Button type="button" variant="ghost" onClick={closeModal} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar producto"
        message="¿Estás seguro de que deseas eliminar este producto permanentemente? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isConfirming={isDeleting}
      />
    </div>
  );
}
