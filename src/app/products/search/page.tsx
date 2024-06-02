import React from "react";
import { products } from "@/app/utils/data";
import Link from "next/link";
import { Metadata } from "next";

function getSlugged(item: string) {
  return item.replace(/ /g, "_").replace(/\./g, "").toLowerCase();
};

interface SearchProductProps {
  searchParams: { q: string };
};

export const generateMetadata = ({ searchParams }: SearchProductProps): Metadata => {
  const searchQuery = searchParams.q;

  return {
      title: `${searchQuery}`,
  };
};

const searchProduct = ({ searchParams }: SearchProductProps) => {
  const query = searchParams.q;
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="fix-height container m-auto px-5 text-center py-5">
        <div className="mt-5">
          {filteredProducts.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Link href={'/products/' + getSlugged(product.title)} key={product.id}>
                  <li className="border p-4 rounded-lg">
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    <p className="text-gray-700">Company: <span className="text-emerald-600">{product.brand}</span></p>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-red-800">No products found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default searchProduct;
