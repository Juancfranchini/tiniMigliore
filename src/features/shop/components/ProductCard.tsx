import type { Product } from '../../../core/types/catalog';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onClick?: (product: Product) => void;
}

export function ProductCard({ product, onAdd, onClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  const isAvailable = true;

  return (
    <Card hoverable style={{ height: '100%', opacity: isAvailable ? 1 : 0.9 }}>
      <div
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onClick={() => {
          if (onClick) onClick(product);
        }}
      >
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: isAvailable ? 'none' : 'grayscale(100%)'
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#f8f9fa', color: '#9ca3af',
              filter: isAvailable ? 'none' : 'grayscale(100%)'
            }}>
              <span style={{ fontSize: '2.5rem', opacity: 0.5 }}>🧁</span>
            </div>
          )}
          {!isAvailable && (
            <div style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-surface)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              Agotado
            </div>
          )}
        </div>
        <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
          <CardTitle style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-serif)'
          }}>
            {product.name}
          </CardTitle>
          <CardDescription style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            color: 'var(--color-text-secondary)'
          }}>
            {product.description}
          </CardDescription>
        </CardHeader>
      </div>
      <CardFooter style={{ marginTop: 'auto', justifyContent: 'space-between', padding: '1rem 1.25rem 1.25rem 1.25rem' }}>
        <span style={{
          fontWeight: '600',
          fontSize: '1.25rem',
          color: 'var(--color-brand-morado)',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '-0.01em'
        }}>
          {formatPrice(product.price)}
        </span>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (isAvailable) onAdd(product);
          }}
          disabled={!isAvailable}
          style={{
            backgroundColor: isAvailable ? 'var(--color-brand-acento)' : 'var(--color-border)',
            color: isAvailable ? 'var(255, 255, 255)' : 'var(--color-text-secondary)',
            borderRadius: 'var(--radius-full)',
            padding: '0 1.25rem',
            boxShadow: isAvailable ? '0 2px 4px rgba(127, 76, 165, 0.2)' : 'none',
            cursor: isAvailable ? 'pointer' : 'not-allowed'
          }}
        >
          {isAvailable ? 'Agregar' : 'Agotado'}
        </Button>
      </CardFooter>
    </Card>
  );
}
