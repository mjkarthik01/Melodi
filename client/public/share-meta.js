(function () {
  const path = window.location.pathname || "";
  const isProductPage = /^\/product\//i.test(path);
  const isSharePage = /^\/share\/product\//i.test(path);

  if (!isProductPage && !isSharePage) {
    return;
  }

  const slug = path.split("/").filter(Boolean).pop();

  const setMeta = (selector, value, attr = "content") => {
    let element = document.querySelector(selector);
    if (!element) {
      const isProperty = selector.startsWith("meta[property");
      element = document.createElement("meta");
      element.setAttribute(
        isProperty ? "property" : "name",
        selector.replace(/^meta\[|\]$/g, ""),
      );
      document.head.appendChild(element);
    }
    element.setAttribute(attr, value);
  };

  fetch(
    `${window.location.origin}/api/v1/product/get-product/${encodeURIComponent(slug)}`,
  )
    .then((response) => response.json())
    .then((payload) => {
      const product = payload?.product;
      if (!product) return;

      const productImageUrl = `${window.location.origin}/api/v1/product/product-photo/${product._id}`;
      const productTitle = product.name || document.title || "Product";
      const productDescription =
        product.description ||
        document.querySelector('meta[name="description"]')?.content ||
        "Product details";

      setMeta("meta[property='og:image']", productImageUrl);
      setMeta("meta[name='twitter:image']", productImageUrl);
      setMeta("meta[property='og:title']", productTitle);
      setMeta("meta[name='twitter:title']", productTitle);
      setMeta("meta[property='og:description']", productDescription);
      setMeta("meta[name='twitter:description']", productDescription);
    })
    .catch(() => {
      // Keep the default shop logo if the product cannot be loaded.
    });
})();
