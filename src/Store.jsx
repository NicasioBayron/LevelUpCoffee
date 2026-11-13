import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "./database";

const Context = createContext();

export function Provider({ children }) {
  const [version, setVersion] = useState(0),
    [notice, setNotice] = useState("");
  const [session, setSession] = useState(() =>
    sessionStorage.getItem("levelup.user"),
  );

  useEffect(() => {
    const update = () => setVersion((v) => v + 1);
    window.addEventListener("levelup:update", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("levelup:update", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 4000);
      return () => clearTimeout(t);
    }
  }, [notice]);

  const user = db.get("users", session);

  const login = (id) => {
    sessionStorage.setItem("levelup.user", id);
    setSession(id);
  };

  const logout = () => {
    sessionStorage.removeItem("levelup.user");
    setSession(null);
  };

  const add = (p, quantity = 1) => {
    try {
      const cart = db.list("cart"),
        line = cart.find((x) => x.id === p.id);
      if ((line?.quantity || 0) + quantity > p.stock)
        throw Error("No hay suficiente stock.");
      if (line) line.quantity += quantity;
      else cart.push({ id: p.id, quantity });
      db.setCart(cart);
      setNotice(`${p.nombre} añadido al carrito`);
    } catch (e) {
      setNotice(e.message);
    }
  };

  return (
    <Context.Provider
      value={{ version, user, login, logout, add, notice, setNotice }}
    >
      {children}
    </Context.Provider>
  );
}

export const useShop = () => useContext(Context);