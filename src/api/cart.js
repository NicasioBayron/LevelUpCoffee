import { db } from "../database";

export function migrateCartProductIds(products) {
  const lines = db.list("cart");
  const localProducts = db.list("products");
  const migrated = [];

  for (const line of lines) {
    const remoteProduct =
      products.find((product) => String(product.id) === String(line.id)) ||
      products.find((product) => {
        const localProduct = localProducts.find(
          (item) => String(item.id) === String(line.id),
        );
        return localProduct && product.nombre === localProduct.nombre;
      });
    const id = remoteProduct?.id ?? line.id;
    const existing = migrated.find((item) => String(item.id) === String(id));

    if (existing) {
      existing.quantity += line.quantity;
    } else {
      migrated.push({ ...line, id });
    }
  }

  if (
    migrated.length !== lines.length ||
    migrated.some((line, index) => String(line.id) !== String(lines[index].id))
  ) {
    db.setCart(migrated);
  }
}
