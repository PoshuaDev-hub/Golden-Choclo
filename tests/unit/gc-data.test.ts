import { describe, it, expect } from 'vitest';
import { formatFolio, formatOrderItems, sumOrderItems, orderCreatedTime } from '@/lib/gc-data';

// =============================================
// TESTS: lib/gc-data.ts — Funciones de utilidad
// Son las funciones más críticas del negocio:
// formatFolio → aparece en el comprobante del cliente
// sumOrderItems → calcula el total que se cobra
// =============================================

describe('formatFolio', () => {
  it('retorna #00000000 para folio null', () => {
    expect(formatFolio(null)).toBe('#00000000');
  });

  it('retorna #00000000 para folio undefined', () => {
    expect(formatFolio(undefined)).toBe('#00000000');
  });

  it('rellena con ceros a la izquierda para folio 1', () => {
    expect(formatFolio(1)).toBe('#00000001');
  });

  it('no trunca folios de 8 dígitos', () => {
    expect(formatFolio(99999999)).toBe('#99999999');
  });

  it('acepta string con # incluido y lo limpia', () => {
    expect(formatFolio('#42')).toBe('#00000042');
  });

  it('acepta string numérico sin #', () => {
    expect(formatFolio('7')).toBe('#00000007');
  });
});

describe('formatOrderItems', () => {
  it('retorna "Sin items" para array vacío', () => {
    expect(formatOrderItems([])).toBe('Sin items');
  });

  it('retorna "Sin items" para null', () => {
    expect(formatOrderItems(null)).toBe('Sin items');
  });

  it('formatea correctamente con campos en español (nombre/cantidad)', () => {
    const items = [
      { nombre: 'Choclo Clásico', cantidad: 2 },
      { nombre: 'Promo Duo', cantidad: 1 },
    ];
    expect(formatOrderItems(items)).toBe('2x Choclo Clásico\n1x Promo Duo');
  });

  it('formatea correctamente con campos en inglés (name/quantity)', () => {
    const items = [{ name: 'Classic Corn', quantity: 3 }];
    expect(formatOrderItems(items)).toBe('3x Classic Corn');
  });

  it('usa cantidad 1 si el campo está ausente', () => {
    const items = [{ nombre: 'Item Sin Cantidad' }];
    expect(formatOrderItems(items)).toBe('1x Item Sin Cantidad');
  });
});

describe('sumOrderItems', () => {
  it('retorna 0 para array vacío', () => {
    expect(sumOrderItems([])).toBe(0);
  });

  it('retorna 0 para null', () => {
    expect(sumOrderItems(null)).toBe(0);
  });

  it('retorna 0 para string inválido', () => {
    expect(sumOrderItems('no-es-array')).toBe(0);
  });

  it('calcula precio × cantidad correctamente (campos en español)', () => {
    const items = [
      { nombre: 'Choclo', precio: 2000, cantidad: 3 },
      { nombre: 'Promo', precio: 5000, cantidad: 1 },
    ];
    expect(sumOrderItems(items)).toBe(11000);
  });

  it('calcula precio × cantidad con campos en inglés', () => {
    const items = [{ name: 'Item', price: 1500, quantity: 2 }];
    expect(sumOrderItems(items)).toBe(3000);
  });

  it('maneja items con precio 0 sin error', () => {
    const items = [{ nombre: 'Gratis', precio: 0, cantidad: 5 }];
    expect(sumOrderItems(items)).toBe(0);
  });
});

describe('orderCreatedTime', () => {
  it('retorna "--:--" para null', () => {
    expect(orderCreatedTime(null)).toBe('--:--');
  });

  it('retorna una cadena de hora válida HH:MM para fecha ISO', () => {
    const result = orderCreatedTime('2026-04-01T15:30:00.000Z');
    // El resultado varía por timezone, pero siempre debe tener formato HH:MM
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});
