import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../cart/store/cartStore';
import { orderService } from '../../../services/mock/order';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { CheckCircle2 } from 'lucide-react';

const baseSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().min(8, 'Ingresa un número de teléfono válido (ej: 11 4000 5000)'), // Recuente buyer identifier
  email: z.string().email('Email requerido para enviar la confirmación'),
  deliveryMethod: z.enum(['pickup', 'delivery']),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  references: z.string().optional(),
});

const checkoutSchema = baseSchema.superRefine((data, ctx) => {
  if (data.deliveryMethod === 'delivery') {
    if (!data.street || data.street.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La calle es obligatoria', path: ['street'] });
    }
    if (!data.number || data.number.length < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La altura es obligatoria', path: ['number'] });
    }
    if (!data.state || data.state.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La provincia es obligatoria', path: ['state'] });
    }
    if (!data.zipCode || data.zipCode.length < 4) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Código postal inválido', path: ['zipCode'] });
    }
  }
});

import { toast } from '../../../utils/toast';

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: 'delivery',
      state: 'Buenos Aires'
    }
  });

  const selectedDeliveryMethod = watch('deliveryMethod');

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const order = await orderService.createOrder(data, items, getSubtotal(), data.deliveryMethod);
      console.log('Orden Procesada y Guardada:', order);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
    } finally { };
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    clearCart();
    navigate('/');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-brand-morado)' }}>Checkout</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>Tu carrito está vacío.</p>
        <Button onClick={() => navigate('/')}>Volver al Catálogo</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '0 1rem' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-brand-morado)' }}>
        Finalizar Pedido
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        {/* Formulario de Checkout */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de Envío y Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Contacto</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                  <Input
                    label="Nombre Completo *"
                    placeholder="Ej. Ana Pérez"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Teléfono (Para pedidos recurrentes) *"
                    placeholder="Ej. 11 1234 5678"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input
                      label="Correo Electrónico (Requerido para confirmación) *"
                      placeholder="ana@ejemplo.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Método de Entrega</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                  <label style={{
                    display: 'flex', flexDirection: 'column', padding: '1rem',
                    border: `2px solid ${selectedDeliveryMethod === 'delivery' ? 'var(--color-brand-morado)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    backgroundColor: selectedDeliveryMethod === 'delivery' ? 'var(--color-brand-crema)' : 'var(--color-surface)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      <input type="radio" value="delivery" {...register('deliveryMethod')} style={{ accentColor: 'var(--color-brand-morado)' }} />
                      Envío a Domicilio
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                      Enviamos tu pedido a la puerta de tu casa.
                    </span>
                  </label>

                  <label style={{
                    display: 'flex', flexDirection: 'column', padding: '1rem',
                    border: `2px solid ${selectedDeliveryMethod === 'pickup' ? 'var(--color-brand-morado)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    backgroundColor: selectedDeliveryMethod === 'pickup' ? 'var(--color-brand-crema)' : 'var(--color-surface)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      <input type="radio" value="pickup" {...register('deliveryMethod')} style={{ accentColor: 'var(--color-brand-morado)' }} />
                      Retiro en Pastelería
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                      Pasá a buscar tu pedido sin costo adicional.
                    </span>
                  </label>
                </div>
              </div>

              {selectedDeliveryMethod === 'delivery' && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Dirección de Entrega</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <Input
                      label="Calle *"
                      placeholder="Ej. Av. Rivadavia"
                      error={errors.street?.message}
                      {...register('street')}
                    />
                    <Input
                      label="Altura *"
                      placeholder="1234"
                      error={errors.number?.message}
                      {...register('number')}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <Input
                      label="Localidad / Barrio"
                      placeholder="Ej. Caballito"
                      error={errors.neighborhood?.message}
                      {...register('neighborhood')}
                    />
                    <Input
                      label="Código Postal *"
                      placeholder="Ej. 1424"
                      error={errors.zipCode?.message}
                      {...register('zipCode')}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <Input
                      label="Provincia *"
                      error={errors.state?.message}
                      {...register('state')}
                    />
                  </div>

                  <Input
                    label="Referencias de entrega (Opcional)"
                    placeholder="Ej. Casa puerta blanca, timbre 2"
                    error={errors.references?.message}
                    {...register('references')}
                  />
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Resumen del Carrito */}
        <Card style={{ position: 'sticky', top: '5rem' }}>
          <CardHeader>
            <CardTitle>Resumen ({items.reduce((acc, i) => acc + i.quantity, 0)})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => (
                <li key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{item.quantity}x</span> {item.productName}
                  </div>
                  <span>{formatPrice(item.totalLinePrice)}</span>
                </li>
              ))}
            </ul>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.25rem', color: 'var(--color-brand-morado)' }}>
              <span>Total</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '1.5rem' }}
              size="lg"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Basic responsive adjustment */}
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="grid-template-columns: 1fr 350px"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* Premium Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        size="md"
      >
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              backgroundColor: 'var(--color-brand-crema)',
              borderRadius: '50%',
              padding: '1rem',
              display: 'inline-flex',
              boxShadow: '0 4px 20px rgba(167, 138, 166, 0.2)'
            }}>
              <CheckCircle2 size={48} color="var(--color-brand-acento)" />
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: 'var(--color-brand-morado)',
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            ¡Tu pedido ha sido confirmado!
          </h2>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            lineHeight: 1.6,
            maxWidth: '430px',
            margin: '0 auto 2.5rem'
          }}>
            Hemos registrado tu solicitud correctamente. Te enviamos un correo electrónico con los pasos a seguir para confirmar el pago y comenzar a preparar tu pedido (por favor, revisa tu casilla de spam). ¡Gracias por elegir Tini Migliore!
          </p>

          <Button
            onClick={handleCloseSuccessModal}
            size="lg"
            style={{
              width: '100%',
              maxWidth: '300px',
              backgroundColor: 'var(--color-brand-acento)',
              borderRadius: 'var(--radius-full)',
              fontSize: '1.125rem',
              boxShadow: '0 4px 15px rgba(127, 76, 165, 0.3)'
            }}
          >
            Volver al Catálogo
          </Button>
        </div>
      </Modal>
    </div>
  );
}
