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
    if (product) {
      return true;
    }
    return false;
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
}
