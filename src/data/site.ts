export const WHATSAPP_NUMBER = '593984281859'
export const WHATSAPP_DISPLAY = '+593 98 428 1859'
export const INSTAGRAM_URL = 'https://www.instagram.com/3d.omar.riva/'

// Monto fijo de la simulación de pago con tarjeta (aún sin pasarela real).
export const DEMO_CHARGE = 45

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const WA_DEFAULT = waLink('¡Hola Omar! 👋 Quiero mi figura 3D personalizada. Te paso mis fotos 📸')

export interface Product {
  id: string
  tag: string
  name: string
  subtitle: string
  occasion: string
  description: string
  price: number
  deposit: number
  unit: string
  image: string
  highlight?: string
}

export const SHIPPING = 6.8

export const products: Product[] = [
  {
    id: 'cartoonizame',
    tag: 'El favorito',
    name: 'Cartoonízame',
    subtitle: 'Caricatura con tu esencia',
    occasion: 'Para celebrar o recordar',
    description:
      'Mezcla los rasgos naturales con la caricatura: mantiene la esencia de tu ser querido con toda la ternura de un personaje.',
    price: 50,
    deposit: 25,
    unit: 'por figura',
    image: 'cartoonizame',
    highlight: 'El favorito de nuestros clientes',
  },
  {
    id: 'conmemorativa',
    tag: 'Escultura conmemorativa',
    name: 'Rasgos naturales',
    subtitle: 'Homenaje a quienes partieron',
    occasion: 'Para honrar y acompañar',
    description:
      'Un retrato con rasgos 100% naturales para honrar a esa persona que ya no está. Una pieza serena y fiel, hecha para acompañar y recordar.',
    price: 75,
    deposit: 35,
    unit: 'por figura',
    image: 'conmemorativa',
  },
  {
    id: 'bobblehead',
    tag: 'Cabeza bailarina',
    name: 'Bobblehead',
    subtitle: 'Para llevar en el auto',
    occasion: 'Cumpleaños, jefes, parejas',
    description:
      'El regalo que arranca carcajadas. Ideal para cumpleaños de mejores amigos, jefes, parejas y momentos divertidos.',
    price: 50,
    deposit: 25,
    unit: 'por figura',
    image: 'bobblehead',
  },
  {
    id: 'trofeo',
    tag: 'Reconocimiento',
    name: 'Trofeo',
    subtitle: 'Trofeo personalizado',
    occasion: 'Personas, equipos, instituciones',
    description:
      'Creado especialmente para esa persona, equipo o institución. Convertimos un logro, profesión o momento especial en un recuerdo único.',
    price: 50,
    deposit: 25,
    unit: 'por trofeo',
    image: 'trofeo',
  },
]
