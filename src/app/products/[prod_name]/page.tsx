import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { products } from "@/utils/data";

type Props = {params: {prod_name: string}};

function getSlugged(item: string) {
    return item.replace(/ /g, "_").replace(/\./g, "").toLowerCase();
};

// Define getProduct globally outside the component
const getProduct = (prodName: string) => {
    return products.find(product => getSlugged(prodName) === getSlugged(product.title));
};

export const generateMetadata = ({params}: Props): Metadata => {
    const product = getProduct(params.prod_name);
    const productName = product ? product.title : "";

    return {
        title: `${productName}`,
    };
};

const SingleProductPage = ({params}: Props) => {
    const product = getProduct(params.prod_name);

    return (
        <div className="container mx-auto p-4">
            {product ? (
                <div className="rounded-lg shadow-md p-6">
                    <h3 className="text-2xl font-bold mb-4">Product No. {product.id}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <img src={product.image} alt={product.title} className="w-full h-auto rounded-lg" />
                        </div>
                        <div>
                            <p className="text-lg">Title: {product.title}</p>
                            <p className="text-lg">Company: {product.brand}</p>
                            <p className="text-lg">Description: {product.description}</p>
                            <p className="text-lg">Category: {product.category}</p>
                            <p className="text-lg">Price: {product.price}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-red-500 text-center">Product not found</p>
            )}

            <div className="text-center">
                <Link href="/products" className="mt-5 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">
                    Back
                </Link>
            </div>
        </div>
    );
};

export default SingleProductPage;