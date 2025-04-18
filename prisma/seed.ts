import { Prisma } from "@prisma/client"
import { prisma } from "../src/app/api/_libs/prisma"

const promoCodeData: any[] = [
  {
    code: 'ECICS5',
    discount: 50,
    start_time: new Date('2023-12-31T23:59:59.999Z'),
    end_time: new Date('2024-12-31T23:59:59.999Z'),
    description: "50% off for new users",
    products: ['car'],
    is_public: true,
    is_show_countdown: true,
  },
]

export async function main() {
  for (const u of promoCodeData) {
    await prisma.promocode.create({ data: u })
  }
}

main()
