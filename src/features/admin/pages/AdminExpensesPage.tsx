import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, X, TrendingUp, TrendingDown, DollarSign, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { toast } from '../../../utils/toast';
import { api } from '../../../core/api/client';

// ── Types ──────────────────────────────
interface ExpenseCategory { id: number; name: string; color: string; }
interface Expense {
  id: number; title: string; description?: string; amount: number;
  category?: string; categoryId?: number; categoryColor?: string;
  paymentMethod: string; date: string; isFixed: boolean; tags: string[];
}
interface Summary {
  current_month_total: number; prev_month_total: number;
  year_to_date: number; variation_percent: number | null;
}
interface CategoryStat { category: string; color: string; count: number; total: number; percentage: number; }

// ── Constants ──────────────────────────
const PAYMENT_METHODS = ['efectivo', 'transferencia', 'tarjeta débito', 'tarjeta crédito', 'mercadopago', 'otro'];
const EMPTY_FORM = { title: '', description: '', amount: '', category_id: '', payment_method: 'efectivo', date: new Date().toISOString().split('T')[0], is_fixed: false, tags: '' };

// ── Helpers ────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

// ── Main Component ─────────────────────
export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [byCat, setByCat] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6F5B72');
  const [showCatForm, setShowCatForm] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterCat) params.set('category_id', filterCat);
      if (filterFrom) params.set('from', filterFrom);
      if (filterTo) params.set('to', filterTo);
      params.set('limit', '100');

      const [expRes, catRes, sumRes, catStatRes] = await Promise.all([
        api.get<any>(`/expenses?${params}`),
        api.get<any>('/expenses/categories'),
        api.get<any>('/expenses/summary'),
        api.get<any>('/expenses/by-category'),
      ]);
      setExpenses(expRes.data || []);
      setCategories(catRes || []);
      setSummary(sumRes);
      setByCat(catStatRes || []);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar los gastos');
    } finally {
      setLoading(false);
    }
  }, [search, filterCat, filterFrom, filterTo]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (e: Expense) => {
    setEditing(e);
    setForm({ title: e.title, description: e.description || '', amount: String(e.amount), category_id: String(e.categoryId || ''), payment_method: e.paymentMethod, date: e.date, is_fixed: e.isFixed, tags: e.tags.join(', ') });
    setShowForm(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    const payload = { title: form.title, description: form.description || null, amount: Number(form.amount), category_id: form.category_id ? Number(form.category_id) : null, payment_method: form.payment_method, date: form.date, is_fixed: form.is_fixed, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
    try {
      if (editing) { await api.put(`/expenses/${editing.id}`, payload); toast.success('Gasto actualizado'); }
      else { await api.post('/expenses', payload); toast.success('Gasto registrado'); }
      setShowForm(false); setEditing(null); loadAll();
    } catch (err: any) { toast.error(err?.message || 'Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este gasto?')) return;
    try { await api.delete(`/expenses/${id}`); toast.success('Gasto eliminado'); loadAll(); }
    catch { toast.error('Error al eliminar'); }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try { await api.post('/expenses/categories', { name: newCatName.trim(), color: newCatColor }); setNewCatName(''); setShowCatForm(false); loadAll(); toast.success('Categoría creada'); }
    catch { toast.error('Error al crear categoría'); }
  };

  const variation = summary?.variation_percent;

  if (loading) return <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Cargando gastos...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-brand-morado)', margin: 0 }}>Gastos</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>Registrá y analizá los gastos del negocio.</p>
        </div>
        <button onClick={openNew} className="button primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Nuevo gasto
        </button>
      </div>

      {/* Métricas */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Card>
            <CardContent style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Este mes</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>{fmt(summary.current_month_total)}</p>
                </div>
                <div style={{ background: 'var(--color-brand-crema)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                  <DollarSign size={20} color="var(--color-brand-morado)" />
                </div>
              </div>
              {variation != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem', fontSize: '0.8rem', color: (variation as number) > 0 ? '#EF4444' : '#10B981' }}>
                  {(variation as number) > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(variation as number)}% vs mes anterior
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mes anterior</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>{fmt(summary.prev_month_total)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Este año</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>{fmt(summary.year_to_date)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Por categoría */}
      {byCat.length > 0 && (
        <Card>
          <CardHeader><CardTitle style={{ fontSize: '1rem' }}>Por categoría</CardTitle></CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {byCat.map(c => (
                <div key={c.category} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', flex: 1, color: 'var(--color-text-primary)' }}>{c.category}</span>
                  <div style={{ flex: 2, height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${c.percentage}%`, height: '100%', background: c.color, borderRadius: '3px', transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', minWidth: '45px', textAlign: 'right' }}>{c.percentage}%</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, minWidth: '100px', textAlign: 'right' }}>{fmt(c.total)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardContent style={{ padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." style={{ paddingLeft: '2rem', height: '36px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', width: '100%', fontFamily: 'inherit', fontSize: '0.875rem' }} />
            </div>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ height: '36px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 0.5rem', fontFamily: 'inherit', fontSize: '0.875rem' }}>
              <option value="">Todas las categorías</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} placeholder="Desde" style={{ height: '36px' }} />
            <Input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} placeholder="Hasta" style={{ height: '36px' }} />
            <button onClick={() => { setSearch(''); setFilterCat(''); setFilterFrom(''); setFilterTo(''); }} style={{ height: '36px', padding: '0 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Limpiar
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Categorías */}
      <Card>
        <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <CardTitle style={{ fontSize: '1rem' }}>Categorías</CardTitle>
          <button onClick={() => setShowCatForm(v => !v)} style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={13} /> Nueva
          </button>
        </CardHeader>
        <CardContent>
          {showCatForm && (
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Nombre de categoría" style={{ flex: 1, minWidth: '160px' }} />
              <input type="color" value={newCatColor} onChange={e => setNewCatColor(e.target.value)} style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid var(--color-border)', cursor: 'pointer' }} />
              <button onClick={handleAddCategory} className="button primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Guardar</button>
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map(c => (
              <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', border: `1px solid ${c.color}20`, background: `${c.color}15`, color: c.color, fontWeight: 500 }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.color, display: 'inline-block' }} />
                {c.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabla de gastos */}
      <Card>
        <CardHeader><CardTitle style={{ fontSize: '1rem' }}>Gastos ({expenses.length})</CardTitle></CardHeader>
        <CardContent style={{ padding: 0 }}>
          {expenses.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <DollarSign size={32} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
              <p>No hay gastos registrados todavía.</p>
              <button onClick={openNew} className="button primary" style={{ marginTop: '0.75rem' }}>Registrar primer gasto</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Fecha', 'Título', 'Categoría', 'Método', 'Fijo', 'Monto', ''].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }} onMouseEnter={el => (el.currentTarget as HTMLElement).style.background = 'var(--color-brand-crema)'} onMouseLeave={el => (el.currentTarget as HTMLElement).style.background = ''}>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{new Date(e.date + 'T00:00:00').toLocaleDateString('es-AR')}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                        {e.title}
                        {e.description && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}>{e.description}</div>}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {e.category ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', background: `${e.categoryColor || '#A78AA6'}18`, color: e.categoryColor || '#6F5B72', border: `1px solid ${e.categoryColor || '#A78AA6'}25` }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: e.categoryColor || '#A78AA6' }} />
                            {e.category}
                          </span>
                        ) : <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>—</span>}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{e.paymentMethod}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{e.isFixed ? <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: '#FEF3C7', color: '#92400E', borderRadius: '999px' }}>Fijo</span> : '—'}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-brand-morado)', whiteSpace: 'nowrap' }}>{fmt(e.amount)}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => openEdit(e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '0.25rem' }}><Edit2 size={15} /></button>
                          <button onClick={() => handleDelete(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '0.25rem' }}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Formulario */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-brand-morado)' }}>{editing ? 'Editar gasto' : 'Nuevo gasto'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Título *</label>
                <Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ej: Harina de almendras" />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Descripción</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Detalle opcional..." style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Monto * (ARS)</label>
                  <Input required type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Fecha *</label>
                  <Input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} max={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Categoría</label>
                  <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} style={{ width: '100%', height: '40px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 0.75rem', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                    <option value="">Sin categoría</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Método de pago</label>
                  <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })} style={{ width: '100%', height: '40px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 0.75rem', fontFamily: 'inherit', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Tags (separados por coma)</label>
                <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Ej: materia prima, mensual" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={form.is_fixed} onChange={e => setForm({ ...form, is_fixed: e.target.checked })} />
                Gasto fijo (se repite todos los meses)
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.625rem 1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Cancelar</button>
                <button type="submit" disabled={saving} className="button primary">
                  {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Registrar gasto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
