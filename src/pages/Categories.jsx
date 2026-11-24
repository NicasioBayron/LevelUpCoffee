import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { productService } from "../api/services";
import { ErrorMessage, PageTitle } from "../components";
import { imageUrl } from "../imageUrl";

export function Categories() {
  const [result, setResult] = useState({
    categories: [],
    loading: true,
    error: "",
  });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([productService.getAll(), productService.getCategorias()])
      .then(([products, categories]) => {
        if (!Array.isArray(categories)) {
          throw new Error("El backend no devolvió una lista de categorías.");
        }
        const categoryProducts = categories.map((category) => {
          const items = products.filter(
            (product) => product.categoriaId === category.id,
          );
          return { ...category, items };
        });
        if (active) {
          setResult({ categories: categoryProducts, loading: false, error: "" });
        }
      })
      .catch((error) => {
        if (active) {
          setResult({
            categories: [],
            loading: false,
            error: error.response?.data?.message || error.message,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [retry]);

  return (
    <main className="container section">
      <PageTitle title="Un universo por descubrir.">
        Encuentra tu estilo de juego o tu próxima pausa favorita.
      </PageTitle>
      {result.loading ? (
        <p role="status">Cargando categorías…</p>
      ) : result.error ? (
        <>
          <ErrorMessage
            message={`No se pudieron cargar las categorías: ${result.error}`}
          />
          <button
            className="btn btn-lime"
            onClick={() => setRetry((attempt) => attempt + 1)}
          >
            Reintentar
          </button>
        </>
      ) : result.categories.length ? (
        <div className="category-grid">
          {result.categories.map((category) => {
            const { items } = category;
            return (
              <Link
                className="category-box"
                to={`/${items[0]?.tipo === "cafe" ? "menu" : "tienda"}?categoria=${encodeURIComponent(category.nombre)}`}
                key={category.id}
              >
                {items[0] && (
                  <img src={imageUrl(items[0].imagen)} alt="" />
                )}
                <div>
                  <h2>{category.nombre}</h2>
                  <span>
                    {items.length} productos <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p>No hay categorías para mostrar.</p>
      )}
    </main>
  );
}