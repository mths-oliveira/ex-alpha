import products from "../database/products.json"

export type ProductId = "wol" | "multWol" | "live" | "multLive"
type ProductName = "Wol" | "Wol Mult" | "Live" | "Live Mult"
export interface Product extends Record<PaymentId, number> {
  name: ProductName
}
type PaymentId = "enrolmentFee" | "monthlyPayment"
type PaymentName = "Matrícula" | "Mensalidade"
export interface Payment {
  name: PaymentName
  productName: ProductName
  value: number
}
type MonthName =
  | "Janeiro"
  | "Fevereiro"
  | "Março"
  | "Abril"
  | "Maio"
  | "Junho"
  | "Julho"
  | "Agosto"
  | "Setembro"
  | "Outubro"
  | "Novembro"
  | "Dezembro"
export interface MonthlyPayments {
  month: MonthName
  payments: Payment[]
}

const months: MonthName[] = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

const productNamesDictnary: Record<ProductId, ProductName> = {
  wol: "Wol",
  multWol: "Wol Mult",
  live: "Live",
  multLive: "Live Mult",
}

export class ProductsController {
  constructor(private value = 1) {}
  getAllProducts(): Product[] {
    return Object.keys(products).map(this.getProductById)
  }
  getProductById = (productId: ProductId): Product => {
    const { enrolmentFee, monthlyPayment } = products[productId]
    const name = productNamesDictnary[productId]
    return {
      name,
      enrolmentFee: enrolmentFee / this.value,
      monthlyPayment: monthlyPayment / this.value,
    }
  }
  createMonthlyPaymentsByProducts(products: Product[]): MonthlyPayments[] {
    const date = new Date()
    const monthIndex = date.getMonth()
    const monthlyPayments: MonthlyPayments[] = []
    for (let i = 0; i < 3; i++) {
      let currentMonthIndex = monthIndex + i
      if (currentMonthIndex >= months.length) currentMonthIndex -= months.length
      monthlyPayments[i] = {
        month: months[currentMonthIndex],
        payments: [],
      }
    }
    for (const product of products) {
      const { enrolmentFee, monthlyPayment } =
        this.getPaymentsByProduct(product)
      if (enrolmentFee) {
        monthlyPayments[0].payments.push(enrolmentFee)
        monthlyPayments[2].payments.push(monthlyPayment)
      } else {
        monthlyPayments.forEach((_, i) => {
          monthlyPayments[i].payments.push(monthlyPayment)
        })
      }
    }
    return monthlyPayments
  }
  getPaymentsByProduct(product: Product): Record<PaymentId, Payment> {
    const monthlyPayment: Payment = {
      name: "Mensalidade",
      productName: product.name,
      value: product.monthlyPayment,
    }
    let enrolmentFee: Payment
    if (product.enrolmentFee) {
      enrolmentFee = {
        name: "Matrícula",
        productName: product.name,
        value: product.enrolmentFee,
      }
    }
    return {
      enrolmentFee,
      monthlyPayment,
    }
  }
}
