import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { money, price } from "../database";
import { productService } from "../api/services";
import { imageUrl } from "../imageUrl";
import { useShop } from "../Store.jsx";
import { Empty, ErrorMessage, Quantity, ProductCard } from "../components";

export function Detail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState({
    key: "",
    product: null,
    relatedProducts: [],
    error: "",
  });
  const { add } = useShop();
  const requestKey = `${id}:${retry}`;
  const loading = result.key !== requestKey;
  const error = loading ? "" : result.error;
  const product = loading || error ? null : result.product;
  const relatedProducts = loading || error ? [] : result.relatedProducts;

  useEffect(() => {
    let active = true;
    Promise.all([productService.getById(id), productService.getAll()])
      .then(([item, products]) => {
        if (active) {
          setResult({
            key: requestKey,
            product: item,
            relatedProducts: products
              .filter(
                (other) =>
                  other.tipo === item.tipo && String(other.id) !== String(item.id),
              )
              .slice(0, 4),
            error: "",
          });
        }
      })
      .catch((requestError) => {
        if (active) {
          setResult({
            key: requestKey,
            product: null,
            relatedProducts: [],
            error:
              requestError.response?.data?.message ||
              requestError.message ||
              "Error desconocido.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [id, requestKey]);

  if (loading)
    return (
      <main className="container section">
        <p role="status">Cargando producto…</p>
      </main>
    );

  if (error)
    return (
      <main className="container section">
        <ErrorMessage message={`No se pudo cargar el producto: ${error}`} />
        <button
          className="btn btn-lime"
          onClick={() => setRetry((attempt) => attempt + 1)}
        >
          Reintentar
        </button>
      </main>
    );

  if (!product)
    return (
      <main className="container section">
        <Empty title="Producto no encontrado" />
      </main>
    );

  return (
    <main className="container section">
      <Link
        to={product.tipo === "cafe" ? "/menu" : "/tienda"}
        className="muted"
      >
        ← Volver al catálogo
      </Link>
      <div className="detail-grid">
        <div className="detail-image">
          <img src={imageUrl(product.imagen)} alt={product.nombre} />
        </div>
        <div>
          <div className="eyebrow">{product.categoria} / LEVEL UP</div>
          <h1>{product.nombre}</h1>
          <p className="detail-price">
            {money(price(product))}{" "}
            {product.descuento > 0 && <del>{money(product.precio)}</del>}
          </p>
          <p>{product.descripcion}</p>
          <p className={product.stock ? "stock" : "text-danger"}>
            {product.stock
              ? `${product.stock} disponibles · Listos para tu próxima partida`
              : "Agotado por ahora"}
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Quantity
              value={quantity}
              onChange={setQuantity}
              max={product.stock}
            />
            <button
              className="btn btn-lime"
              disabled={!product.stock}
              onClick={() => add(product, quantity)}
            >
              Añadir al carrito &rarr;
            </button>
          </div>
          <div className="detail-notes">
            <p>🚚 Envío $3.990 · Gratis desde $50.000</p>
            <p>☕ Retiro gratis en cafetería</p>
            <small>Imágenes referenciales.</small>
          </div>
        </div>
      </div>
      <h2>También te puede gustar</h2>
      <div className="product-grid mt-4">
        {relatedProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </main>
  );
}
