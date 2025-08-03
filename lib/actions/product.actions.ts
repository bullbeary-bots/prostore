"use server";

import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { convertToPlainObject } from "@/lib/utils";
import { PrismaClient } from "../generated/prisma";

// Get latest products
export async function getLatestProducts() {
  const prisma = new PrismaClient();

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
  const prisma = new PrismaClient();
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
