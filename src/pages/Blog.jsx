import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { imageUrl } from "../imageUrl";
import { PageTitle, Empty, ErrorMessage } from "../components";
import { communityService } from "../api/services";

export function Blog() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { communityService.getPublicaciones().then(setArticles).catch((e) => setError(e.message)); }, []);
  if (error) return <main className="container section"><ErrorMessage message={error} /></main>;
  if (id) {
    const a = articles.find((item) => String(item.id) === String(id));
    if (!a) return <main className="container section"><Empty title="Artículo no encontrado" to="/blog" action="Volver al blog" /></main>;
    return <main className="container section prose"><Link to="/blog">← Volver al blog</Link><PageTitle title={a.titulo}>{a.resumen}</PageTitle><img style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 10 }} src={imageUrl(a.imagen)} alt={a.titulo} /><p>{a.contenido}</p><Link className="btn btn-lime mt-4" to="/menu">Explora nuestra carta →</Link></main>;
  }
  return <main className="container section"><PageTitle title="Historias entre partidas.">Ideas, café y juegos para compartir.</PageTitle><div className="category-grid">{articles.map((a) => <Link className="category-box" to={`/blog/${a.id}`} key={a.id}><img src={imageUrl(a.imagen)} alt={a.titulo} /><div><div className="eyebrow">BLOG</div><h2 className="mt-3">{a.titulo}</h2><p className="muted">{a.resumen}</p><span>Leer historia →</span></div></Link>)}</div></main>;
}
