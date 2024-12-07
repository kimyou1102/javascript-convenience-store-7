export const parseProducts = (productToBuy) => {
  const products = productToBuy.split(',').map((x) => x.replace(/\[|\]/g, ''));
  return products.map((product) => {
    const [name, quantity] = product.split('-');
    return {
      name,
      quantity: Number(quantity),
    };
  });
};
