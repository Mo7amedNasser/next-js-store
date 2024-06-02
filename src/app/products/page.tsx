"use client";

import React, { useState } from "react";
import { products } from "../products_db";
import Link from "next/link";
import { useRouter } from "next/navigation";

function getSlugged(item: string) {
    return item.replace(/ /g, "_").replace(/\./g, "").toLowerCase();
};

const Products = () => {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");

    const formSearchHandler = (e:React.FormEvent) => {
        e.preventDefault();

        router.push(`/products/search?q=${searchText}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>
            <div>
                <form onSubmit={formSearchHandler}>
                    <input
                        type="search"
                        className="w-full p-3 py-3 mb-5 rounded text-xl border-none text-gray-900"
                        placeholder="Search for a product ..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </form>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <Link key={product.id} href={"/products/" + getSlugged(product.name)} className="block p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 text-center">
                        <img src={product.image} alt={product.name} className="mb-4 w-full h-32 object-cover" />
                        <h2 className="text-xl font-bold">{product.name}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Products;