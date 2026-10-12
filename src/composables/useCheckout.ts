import { reactive, readonly } from 'vue'
import { products, type Product } from '@/data/site'

const state = reactive({
  open: false,
  product: products[0] as Product,
})

export function useCheckout() {
  function openCheckout(product: Product = products[0]) {
    state.product = product
    state.open = true
  }
  function closeCheckout() {
    state.open = false
  }
  return { checkout: readonly(state), openCheckout, closeCheckout }
}
