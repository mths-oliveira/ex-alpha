import products from "../database/products.json"

interface Payment {
  month: string
  value: number
}

interface Product {
  name: string
  enrolmentFee?: number
  monthlyPayment: number
}

export type ProductName = "wol" | "multWol" | "live" | "multLive"

const productName: Record<ProductName, string> = {
  wol: "Wol",
  multWol: "Mult Wol",
  live: "Live",
  multLive: "Mult Live",
}

const date = new Date()
const months = [
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

export class ProductsController {
  findAll(): Product[] {
    return Object.keys(products).map(this.findByName)
  }
  findByName(id: ProductName): Product {
    const { enrolmentFee, monthlyPayment } = products[id]
    const name = productName[id]
    return {
      name,
      monthlyPayment,
      enrolmentFee,
    }
  }
  findPayments(productNames: ProductName[]): Payment[] {
    const payments = Array(3)
      .fill(0)
      .map<Payment>((_, i) => {
        let monthIndex = date.getMonth() + i
        if (monthIndex > 11) monthIndex -= 12
        return {
          month: months[monthIndex],
          value: 0,
        }
      })
    for (const name of productNames) {
      const { enrolmentFee, monthlyPayment } = products[name]
      if (enrolmentFee) {
        payments[0].value += enrolmentFee
        payments[2].value += monthlyPayment
      } else {
        for (const i in payments) {
          payments[i].value += monthlyPayment
        }
      }
    }
    return payments
  }
}
