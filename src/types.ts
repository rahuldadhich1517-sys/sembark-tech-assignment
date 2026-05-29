export type Category = {
  id: number
  name: string
  slug: string
  image: string
}

export type Product = {
  id: number
  title: string
  price: number
  description: string
  category: {
    id: number
    name: string
  }
  images: string[]
}

export type CartItem = {
  product: Product
  quantity: number
}
