import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Boleta from '@/components/ui/Boleta';

// =============================================
// TESTS: components/ui/Boleta.tsx
// La boleta es el comprobante que recibe el cliente.
// Un cálculo incorrecto en el total afecta la confianza del negocio.
// =============================================

/** Mock de html-to-image para evitar errores en entorno jsdom */
vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,mock'),
}));

const pedidoBase = {
  id: '#00000001',
  cliente: 'Ana García',
  items: '2x Choclo Clásico, 1x Promo Duo',
  total: 10000,
  fecha: '01/04/2026',
  tipo: 'Retiro',
};

describe('<Boleta /> — Renderizado básico', () => {
  it('muestra el nombre del cliente', () => {
    render(<Boleta pedido={pedidoBase} />);
    expect(screen.getByText('Ana García')).toBeInTheDocument();
  });

  it('muestra el folio del pedido', () => {
    render(<Boleta pedido={pedidoBase} />);
    expect(screen.getByText(/#00000001/)).toBeInTheDocument();
  });

  it('muestra el detalle de items', () => {
    render(<Boleta pedido={pedidoBase} />);
    expect(screen.getByText('2x Choclo Clásico, 1x Promo Duo')).toBeInTheDocument();
  });

  it('muestra el botón de descarga', () => {
    render(<Boleta pedido={pedidoBase} />);
    expect(screen.getByText(/guardar png/i)).toBeInTheDocument();
  });
});

describe('<Boleta /> — Cálculo de totales', () => {
  it('muestra el total sin ajustes cuando no hay descuento ni delivery', () => {
    render(<Boleta pedido={pedidoBase} />);
    // El total aparece dos veces: en el desglose de items y en el total final.
    // Verificamos que al menos exista uno con el valor correcto.
    const elementos = screen.getAllByText('$10.000');
    expect(elementos.length).toBeGreaterThanOrEqual(1);
  });

  it('aplica descuento correctamente: 10.000 - 10% = 9.000', () => {
    render(<Boleta pedido={{ ...pedidoBase, descuento: 10 }} />);
    expect(screen.getByText('$9.000')).toBeInTheDocument();
  });

  it('suma delivery al total: 10.000 + 2.000 = 12.000', () => {
    render(<Boleta pedido={{ ...pedidoBase, delivery: 2000 }} />);
    expect(screen.getByText('$12.000')).toBeInTheDocument();
  });

  it('calcula descuento + delivery combinados: 10.000 - 10% + 2.000 = 11.000', () => {
    render(<Boleta pedido={{ ...pedidoBase, descuento: 10, delivery: 2000 }} />);
    expect(screen.getByText('$11.000')).toBeInTheDocument();
  });
});

describe('<Boleta /> — Sección de ajustes condicionales', () => {
  it('NO muestra la sección de descuento cuando descuento es 0', () => {
    render(<Boleta pedido={{ ...pedidoBase, descuento: 0 }} />);
    expect(screen.queryByText(/DESC\./)).not.toBeInTheDocument();
  });

  it('SÍ muestra la sección de descuento cuando hay descuento', () => {
    render(<Boleta pedido={{ ...pedidoBase, descuento: 15 }} />);
    expect(screen.getByText(/DESC\. \(15%\)/)).toBeInTheDocument();
  });

  it('muestra el motivo del descuento cuando se especifica nota', () => {
    render(<Boleta pedido={{ ...pedidoBase, descuento: 10, nota: 'Cliente frecuente' }} />);
    expect(screen.getByText(/cliente frecuente/i)).toBeInTheDocument();
  });

  it('NO muestra delivery cuando es 0', () => {
    render(<Boleta pedido={{ ...pedidoBase, delivery: 0 }} />);
    expect(screen.queryByText(/COSTO DELIVERY/)).not.toBeInTheDocument();
  });

  it('SÍ muestra delivery cuando es mayor a 0', () => {
    render(<Boleta pedido={{ ...pedidoBase, delivery: 1500 }} />);
    expect(screen.getByText(/COSTO DELIVERY/)).toBeInTheDocument();
  });
});
