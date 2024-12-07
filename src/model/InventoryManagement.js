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
}
