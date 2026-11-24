import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { price } from "../database";
import { productService } from "../api/services";
import { PageTitle, ProductCard, Empty, ErrorMessage } from "../components";

export function Catalog({ mode = "tienda" }) {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState("nombre");
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState({ key: "", products: [], error: "" });
  const requestKey = `${mode}:${retry}`;
  const loading = result.key !== requestKey;
  const error = loading ? "" : result.error;
  const products = loading || error ? [] : result.products;
  const query = params.get("q") || "",
    category = params.get("categoria") || "";

  useEffect(() => {
    let active = true;
    productService
      .getAll(mode === "ofertas" ? {} : { tipo: mode === "menu" ? "cafe" : "juego" })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("El backend no devolvió una lista de productos.");
        }
        if (active) {
          setResult({
            key: requestKey,
            products: data,
            error: "",
          });
        }
      })
      .catch((requestError) => {
        if (active) {
          setResult({
            key: requestKey,
            products: [],
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
  }, [mode, requestKey]);

  let visibleProducts = products.filter((p) =>
    mode === "ofertas" ? p.descuento > 0 : true,
  );

  const categories = [...new Set(visibleProducts.map((p) => p.categoria))];

  visibleProducts = visibleProducts.filter(
    (p) =>
      (!category || p.categoria === category) &&
      `${p.nombre} ${p.descripcion}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  visibleProducts.sort((a, b) =>
    sort === "menor"
      ? price(a) - price(b)
      : sort === "mayor"
        ? price(b) - price(a)
        : a.nombre.localeCompare(b.nombre),
  );

  function filter(k, v) {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    setParams(next, { replace: true });
  }

  return (
    <main className="container section">
      <PageTitle
        title={
          mode === "menu"
            ? "Recarga tu energía."
            : mode === "ofertas"
              ? "Más juego. Menos precio."
              : "Tu próxima gran partida."
        }
      >
        {mode === "menu"
          ? "Café de especialidad, pociones y algo rico para compartir."
          : "Encuentra algo nuevo para llevar a tu mesa."}
      </PageTitle>

      <div className="catalog-toolbar">
        <label className="search">
          <Search size={18} />
          <input
            aria-label="Buscar productos"
            placeholder="Busca tu próximo favorito…"
            value={query}
            onChange={(e) => filter("q", e.target.value)}
          />
        </label>
        <label>
          Ordenar{" "}
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="nombre">Nombre A–Z</option>
            <option value="menor">Menor precio</option>
            <option value="mayor">Mayor precio</option>
          </select>
        </label>
      </div>

      <div className="filter-chips">
        <button
          className={!category ? "selected" : ""}
          onClick={() => filter("categoria", "")}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={category === c ? "selected" : ""}
            onClick={() => filter("categoria", c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p role="status">Cargando productos…</p>
      ) : error ? (
        <div>
          <ErrorMessage message={`No se pudieron cargar los productos: ${error}`} />
          <button
            className="btn btn-lime"
            onClick={() => setRetry((attempt) => attempt + 1)}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <p className="muted">{visibleProducts.length} productos encontrados</p>
          {visibleProducts.length ? (
            <div className="product-grid">
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <Empty
              title="No encontramos coincidencias"
              text="Intenta con otro nombre o categoría."
              to={"/" + mode}
              action="Limpiar búsqueda"
            />
          )}
        </>
      )}
    </main>
  );
}