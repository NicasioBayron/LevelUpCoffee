import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { productService } from "../api/services";
import { imageUrl } from "../imageUrl";
import { ErrorMessage, ProductCard } from "../components";

export function Home() {
  const heroContentRef = useRef(null);

  const [result, setResult] = useState({
    products: [],
    loading: true,
    error: "",
  });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setResult((current) => ({ ...current, loading: true, error: "" }));
    productService.getAll()
      .then((products) => active && setResult({ products, loading: false, error: "" }))
      .catch((error) => active && setResult({ products: [], loading: false, error: error.response?.data?.error || error.message || "No se pudieron cargar los productos." }));
    return () => { active = false; };
  }, [retry]);

useEffect(() => {
  const el = heroContentRef.current;
  console.log("ANIMANDO HERO -> ref:", el, "gsap:", gsap?.version);
  if (!el) return;

  const ctx = gsap.context(() => {
    gsap.fromTo(
  el.children,
  { y: 80, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 2.2,
    stagger: 0.2,
    ease: "power3.out",
  }
);
  }, heroContentRef);

  return () => ctx.revert();
}, []);

  return (
    <>
      <section className="hero">
        <div
          className="hero-photo"
          style={{
            "--hero-image": `url("${imageUrl("/img/nosotros1.png")}")`,
          }}
        />
        <div ref={heroContentRef} className="container hero-content">
          <div className="eyebrow">
            <span className="live-dot" /> TU PUNTO DE ENCUENTRO
          </div>
          <h1>
            Buen café.
            <br />
            Grandes partidas.
            <br />
            <em>Tu siguiente nivel.</em>
          </h1>
          <p>
            Desconéctate del mundo. Conéctate con tu equipo.
            <br />
            Café de especialidad y juegos que reúnen.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/tienda" className="btn btn-lime">
              Encuentra tu próximo juego &rarr;
            </Link>
            <Link to="/menu" className="btn btn-glass">
              Ver la carta ☕
            </Link>
          </div>
          <div className="hero-foot">
            <span>01 / COFFEE & PLAY</span>
            <span>Una mesa. Mil historias.</span>
          </div>
        </div>
        <div className="hero-sticker">
          <span className="sticker-icon" aria-hidden="true">🎮</span>
          <span>
            LA VIDA ES MEJOR
            <br />
            <b>EN COOPERATIVO.</b>
          </span>
        </div>
      </section>

      <div className="benefit-bar">
        <div className="container">
          <span>Café con personalidad</span>
          <span><Link to="/eventos">Juegos para cada equipo</Link></span>
          <span>Envío gratis desde $50.000</span>
          <span>Retiro en cafetería</span>
        </div>
      </div>

      <section className="container section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">ELIGE TU AVENTURA</div>
            <h2>¿Qué jugamos hoy?</h2>
          </div>
          <Link to="/categorias">
            Todas las categorías &rarr;
          </Link>
        </div>
        <div className="category-tiles">
          {[
            ["Juegos de mesa", "Estrategia, risas y una revancha.", "catan.png", "/tienda"],
            ["Café & pociones", "Recarga tu energía, a tu manera.", "latte.png", "/menu"],
            ["Algo para compartir", "El mejor power-up de la mesa.", "sandwich.png", "/menu?categoria=Snacks"],
          ].map(([title, text, img, to], i) => (
            <Link to={to} className={"category-tile tile-" + i} key={title}>
              <div>
                <small>0{i + 1} / EXPLORA</small>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="circle-arrow">&rarr;</span>
              </div>
              <img src={imageUrl("/img/" + img)} alt="" />
            </Link>
          ))}
        </div>
      </section>

      <section className="container section pt-0">
        <div className="section-heading">
          <div>
            <div className="eyebrow">EL LOOT MÁS BUSCADO</div>
            <h2>Favoritos de la comunidad</h2>
          </div>
          <Link to="/tienda">
            Ver todos &rarr;
          </Link>
        </div>
        {result.loading ? (
          <p role="status">Cargando favoritos…</p>
        ) : result.error ? (
          <>
            <ErrorMessage
              message={`No se pudieron cargar los productos: ${result.error}`}
            />
            <button
              className="btn btn-lime"
              onClick={() => setRetry((attempt) => attempt + 1)}
            >
              Reintentar
            </button>
          </>
        ) : result.products.length ? (
          <div className="product-grid">
            {result.products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p>No hay productos para mostrar.</p>
        )}
      </section>
    </>
  );
}
