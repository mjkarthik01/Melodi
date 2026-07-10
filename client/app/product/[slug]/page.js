import { notFound } from "next/navigation";
import ClientAppBridge from "../../../components/ClientAppBridge";
import {
  buildProductMetadata,
  getProductBySlug,
} from "../../../lib/productMetadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found | Sweetie Ayman",
      description: "The requested product could not be found.",
    };
  }

  return buildProductMetadata(product, slug);
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ClientAppBridge />;
}
