import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return '₹' + price.toLocaleString('en-IN')
}

export function formatDiscount(old_price: number, price: number) {
  return Math.round(((old_price - price) / old_price) * 100)
}

export function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function getWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function getOrderWhatsApp(order: any, waNumber: string) {
  const msg = `Hi Hanfi's! I placed an order.\n\nOrder: ${order.order_number}\nName: ${order.customer_name}\nTotal: ₹${order.total.toLocaleString('en-IN')}\nPayment: ${order.payment_method.toUpperCase()}\n\nPlease confirm my order. 🙏`
  return getWhatsAppLink(waNumber, msg)
}