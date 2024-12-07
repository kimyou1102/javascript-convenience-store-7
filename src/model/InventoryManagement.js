export default class InventoryManagement {
  #inventoryInfo;
  #promotionInfo;

  constructor(inventoryInfo, promotionInfo) {
    this.#inventoryInfo = inventoryInfo;
    this.#promotionInfo = promotionInfo;
  }
  /**
   * 재고
   * {
   *   name,
   *   price,
   *   quantity,
   *   promotion
   * }
   *  */

  /**
   * 프로모션
   * {
   *   name,
   *   buy,
   *   get,
   *   start_date,
   *   end_date
   * }
   *  */

  getInventoryInfo() {
    return this.#inventoryInfo;
  }

  getPromotionInfo() {
    return this.#promotionInfo;
  }

  canApplyPromotion(buyProduct) {
    const product = this.#inventoryInfo.filter(
      (product) => product.name === buyProduct.name && product.promotion !== 'null',
    );
    if (product.length > 0) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line max-lines-per-function
  buyProduct(buyProduct) {
    const index = this.#inventoryInfo.findIndex(
      ({ name, promotion }) => name === buyProduct.name && promotion === 'null',
    );
    const product = this.#inventoryInfo[index];
    if (!buyProduct.promotionName) {
      this.#inventoryInfo[index].quantity = product.quantity - buyProduct.quantity;
      return;
    }
    // 프로모션 부터
    const promotionIndex = this.#inventoryInfo.findIndex(
      ({ name, promotion }) => name === buyProduct.name && promotion === buyProduct.promotionName,
    );
    const promotionProduct = this.#inventoryInfo[promotionIndex];
    const maxPromotionQuantity = this.getMaxPromotionQuantity(
      buyProduct.promotionName,
      promotionProduct.quantity,
    );
    // 프로모션 가능수보다 적거나 같다면
    if (maxPromotionQuantity >= buyProduct.quantity) {
      this.#inventoryInfo[promotionIndex].quantity =
        promotionProduct.quantity - buyProduct.quantity;
      return;
    }
    // 프로모션 가능수보다 많으면
    const rest = buyProduct.quantity - maxPromotionQuantity;
    this.#inventoryInfo[promotionIndex].quantity = promotionProduct.quantity - maxPromotionQuantity;
    this.#inventoryInfo[index].quantity = product.quantity - rest;
  }

  getPromotionByProductName(productName) {
    const products = this.#inventoryInfo.filter(({ name }) => name === productName);
    const product = products.filter((product) => product.promotion !== 'null');
    if (product.length === 0) return null;
    return product[0].promotion;
  }

  getInsufficientStockCount(buyProduct) {
    const promotionName = this.getPromotionByProductName(buyProduct.name);
    const { get, buy } = this.#promotionInfo.filter(({ name }) => name === promotionName)[0];
    const applicableQuantity = get + buy;
    const share = Math.ceil(buyProduct.quantity / applicableQuantity);
    const canStock = share * applicableQuantity;
    return canStock - buyProduct.quantity;
  }

  getPromomtionQuantity(quantity, promotionName) {
    const { get, buy } = this.#promotionInfo.find(({ name }) => name === promotionName);
    const applicableQuantity = get + buy;
    const share = Math.floor(quantity / applicableQuantity);
    return share;
  }

  getInsufficientPromotionStock(promotionProduct) {
    const product = this.getPromotionProduct(promotionProduct);
    const maxPromotionQuantity = this.getMaxPromotionQuantity(
      promotionProduct.promotionName,
      product.quantity,
    );
    const gap = maxPromotionQuantity - promotionProduct.quantity;
    if (gap >= 0) return 0;
    return gap * -1;
  }

  getMaxPromotionQuantity(promotionName, quantity) {
    const { get, buy } = this.#promotionInfo.find(({ name }) => name === promotionName);
    const applicableQuantity = get + buy;
    const share = Math.floor(quantity / applicableQuantity);
    return share * applicableQuantity;
  }

  getPromotionProduct(promotionProduct) {
    return this.#inventoryInfo.find(
      ({ name, promotion }) =>
        name === promotionProduct.name && promotion === promotionProduct.promotionName,
    );
  }
}
