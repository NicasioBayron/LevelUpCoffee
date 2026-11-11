import React from "react";
import { Link, useParams } from "react-router-dom";
import { imageUrl } from "./imageUrl";
import { PageTitle, Empty } from "./components";

const articles = [
  {
    id: "primera-partida",
    title: "Tu primera noche de juegos de mesa",
    image: "juegosdemesa.png",
    tag: "GUÍA PARA EMPEZAR",
    intro:
      "No necesitas conocer todas las reglas para pasarlo bien. Solo necesitas una mesa y ganas de compartir.",
    sections: [
      [
        "Elige según tu grupo",
        "Antes de elegir, considera cuántas personas van a jugar y cuánto tiempo tienen. Un juego corto de cartas puede ser una buena primera experiencia.",
      ],
      [
        "Aprendan jugando",
        "Preparen la mesa y hagan una ronda de ejemplo. Es más fácil entender una acción al verla que memorizar todo el reglamento.",
      ],
      [
        "La mejor regla: disfrutar",
        "Deja espacio para preguntas, respeta los turnos y recuerda que una revancha es una excusa perfecta para volver a juntarse.",
      ],
    ],
  },
  {
    id: "cafe-y-juego",
    title: "Encuentra el café para tu pausa",
    image: "cafegamer.png",
    tag: "DETRÁS DE LA BARRA",
    intro: "Entre una partida y otra también hay espacio para una buena pausa.",
    sections: [
      [
        "Una pausa corta",
        "El espresso concentra sabor en una taza pequeña. Nuestro Radiant Espresso está pensado para quienes disfrutan un café intenso.",
      ],
      [
        "Tómate tu tiempo",
        "Si prefieres una bebida con leche, explora Latte AFK o Capuchino Trifuerza. Son opciones para acompañar una conversación sin apuro.",
      ],
      [
        "Algo para compartir",
        "Combina tu favorito con un snack del menú. Recuerda mantener bebidas y comida lejos de las cartas y los tableros.",
      ],
    ],
  },
];

export function Blog() {
  const { id } = useParams();
  
  if (id) {
    const a = articles.find((art) => art.id === id);
    if (!a)
      return (
        <main className="container section">
          <Empty
            title="Artículo no encontrado"
            to="/blog"
            action="Volver al blog"
          />
        </main>
      );
      
    return (
      <main className="container section prose">
        <Link to="/blog">← Volver al blog</Link>
        <PageTitle eyebrow={a.tag} title={a.title}>
          {a.intro}
        </PageTitle>
        <img
          style={{
            width: "100%",
            maxHeight: 420,
            objectFit: "cover",
            borderRadius: 10,
          }}
          src={imageUrl("/img/" + a.image)}
          alt={a.title}
        />
        {a.sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <Link className="btn btn-lime mt-4" to="/menu">
          Explora nuestra carta &rarr;
        </Link>
      </main>
    );
  }

  return (
    <main className="container section">
      <PageTitle title="Historias entre partidas.">
        Ideas, café y juegos para compartir.
      </PageTitle>
      <div className="category-grid">
        {articles.map((a) => (
          <Link className="category-box" to={"/blog/" + a.id} key={a.id}>
            <img src={imageUrl("/img/" + a.image)} alt={a.title} />
            <div>
              <div className="eyebrow">{a.tag}</div>
              <h2 className="mt-3">{a.title}</h2>
              <p className="muted">{a.intro}</p>
              <span>
                Leer historia &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}