import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export default function TestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section>
        <h2>Tipografía y Colores</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ width: 100, height: 100, backgroundColor: 'var(--color-brand-crema)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Crema</div>
          <div style={{ width: 100, height: 100, backgroundColor: 'var(--color-brand-lila)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Lila</div>
          <div style={{ width: 100, height: 100, backgroundColor: 'var(--color-brand-morado)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Morado</div>
        </div>
      </section>

      <section>
        <h2>Botones</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>

          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section>
        <h2>Inputs</h2>
        <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Nombre completo" placeholder="Ej: Ana Maria" />
          <Input label="Teléfono" error="El teléfono es requerido" placeholder="11 1234 5678" />
        </div>
      </section>

      <section>
        <h2>Tarjetas (Cards)</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Card style={{ width: '300px' }} hoverable>
            <CardHeader>
              <CardTitle>Tarta de Frutillas</CardTitle>
              <CardDescription>Clásica y fresca</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="https://images.unsplash.com/photo-1519869325930-281384150729" alt="Tarta" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Masa sablée con crema pastelera y frutillas frescas.</p>
            </CardContent>
            <CardFooter>
              <span style={{ fontWeight: 'bold' }}>$8.500</span>
              <Button size="sm" style={{ marginLeft: 'auto' }}>Agregar</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h2>Modales</h2>
        <Button onClick={() => setIsModalOpen(true)}>Abrir Modal Test</Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Ingredientes"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={() => setIsModalOpen(false)}>Confirmar</Button>
            </>
          }
        >
          <p>¿Qué ingredientes extra deseas añadir a tu pedido?</p>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" /> Extra crema ($500)
            </label>
          </div>
        </Modal>
      </section>

    </div>
  );
}
