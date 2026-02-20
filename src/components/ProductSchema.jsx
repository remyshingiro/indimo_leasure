// src/components/ProductSchema.jsx
const ProductSchema = ({ product }) => {
  if (!product) return null;

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description || `Buy ${product.name} at Kigali Swim Shop Rwanda.`,
    "brand": {
      "@type": "Brand",
      "name": "Kigali Swim Shop"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.kigaliswimshop.online/products/${product.slug}`,
      "priceCurrency": "RWF",
      "price": product.discountPrice || product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "2000",
          "currency": "RWF"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "DAY"
          }
        }
      }
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schemaData)}
    </script>
  );
};

export default ProductSchema;