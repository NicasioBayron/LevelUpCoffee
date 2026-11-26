import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "./database";
import { authService, cartService } from "./api/services";

const Context = createContext();

export function Provider({ children }) {
  const [version, setVersion] = useState(0),
    [notice, setNotice] = useState("");
  const [session, setSession] = useState(() => sessionStorage.getItem("levelup.user"));
  const [user, setUser] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [sessionToken] = useState(() => {
    const key = "levelup.cart.session";
    let value = sessionStorage.getItem(key);
    if (!value) { value = crypto.randomUUID(); sessionStorage.setItem(key, value); }
    return value;
  });

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
    let active = true;
    if (!session) { setUser(null); return () => { active = false; }; }
    authService.getById(session).then((data) => active && setUser(data)).catch(() => {
      sessionStorage.removeItem("levelup.user"); setSession(null); setUser(null);
    });
    return () => { active = false; };
  }, [session]);

  useEffect(() => {
    cartService.get({ usuarioId: session ? Number(session) : null, sessionToken })
      .then((cart) => { setCartId(cart.id); db.setCart((cart.items || []).map((item) => ({ id: item.productoId, quantity: item.cantidad }))); })
      .catch(() => {});
  }, [session, sessionToken]);

  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 4000);
      return () => clearTimeout(t);
    }
  }, [notice]);

  const login = (loggedUser) => {
    sessionStorage.setItem("levelup.user", String(loggedUser.id));
    setUser(loggedUser);
    setSession(String(loggedUser.id));
  };

  const logout = () => {
    sessionStorage.removeItem("levelup.user");
    sessionStorage.removeItem("levelup.token");
    setUser(null);
    setSession(null);
  };

  const add = async (p, quantity = 1) => {
    try {
      const cart = db.list("cart"),
        line = cart.find((x) => x.id === p.id);
      if ((line?.quantity || 0) + quantity > p.stock)
        throw Error("No hay suficiente stock.");
      if (line) line.quantity += quantity;
      else cart.push({ id: p.id, quantity });
      db.setCart(cart);
      if (cartId) await cartService.add(cartId, p.id, quantity);
      setNotice(`${p.nombre} añadido al carrito`);
    } catch (e) {
      setNotice(e.message);
    }
  };

  return (
    <Context.Provider
      value={{ version, user, login, logout, add, notice, setNotice, cartId }}
    >
      {children}
    </Context.Provider>
  );
}

export const useShop = () => useContext(Context);
