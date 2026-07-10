const DEFAULT_SITE_URL = "http://localhost:3000";

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL
  );
}

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API ||
    process.env.REACT_APP_API ||
    "http://localhost:8080"
  );
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/"/g, '\\"')
    .trim();
}

function buildAbsoluteUrl(path, baseUrl = getSiteUrl()) {
  return new URL(path, baseUrl).toString();
}

export async function getProductBySlug(slug) {
  if (!slug) return null;

  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/product/get-product/${slug}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload?.product || null;
}

export function buildProductMetadata(product, slug) {
  const productName = normalizeText(product?.name || "Product");
  const description = normalizeText(
    product?.description || "Explore this premium product from Sweetie Ayman.",
  );
  const productSlug = product?.slug || slug;
  const canonicalUrl = buildAbsoluteUrl(`/product/${productSlug}`);
  const imageUrl = product?._id
    ? buildAbsoluteUrl(
        `/api/v1/product/product-photo/${product._id}`,
        getApiBaseUrl(),
      )
    : buildAbsoluteUrl("/logo.png");

  return {
    title: `${productName} | Sweetie Ayman`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: productName,
      description,
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description,
      images: [imageUrl],
    },
  };
}
