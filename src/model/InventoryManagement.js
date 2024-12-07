export default class InventoryManagement {
  #inventoryInfo;
  #promotionInfo;

  constructor(inventoryInfo, promotionInfo) {
    this.#inventoryInfo = inventoryInfo;
    this.#promotionInfo = promotionInfo;
  }

  getInventoryInfo() {
    return this.#inventoryInfo;
  }

  getPromotionInfo() {
    return this.#promotionInfo;
  }
}
