import { parseDateToKr } from '../utils/parseDate.js';

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

  isPromotionApplicableDate(promotionName, now) {
    if (!this.getPromotion(promotionName)) return false;
    const { startDate, endDate } = this.getPromotionDateByName(promotionName);
    const nowDate = new Date(now);
    nowDate.setHours(0, 0, 0, 0);
    if (startDate <= nowDate && nowDate <= endDate) {
      return true;
    }
    return false;
  }

  getPromotionDateByName(name) {
    const { start_date, end_date } = this.#promotionInfo.find(
      (promotion) => promotion.name === name,
    );

    return {
      startDate: parseDateToKr(start_date),
      endDate: parseDateToKr(end_date),
    };
  }

  // eslint-disable-next-line max-lines-per-function
  getTotalInSufficientCount(name, promotionName, quantity) {
    const productNonePromotion = this.#inventoryInfo.find(
      (product) => product.name === name && product.promotion === 'null',
    );
    const promotionProduct = this.#inventoryInfo.find(
      (product) => product.name === name && product.promotion !== 'null',
    );
    if (!promotionProduct) {
      // 프로모션 아예 없는 경우
      const gap = quantity - productNonePromotion.quantity;
      if (gap <= 0) return true;
      return false;
    }
    promotionProduct.promotionName = promotionProduct.promotion;
    const product = this.getPromotionProduct(promotionProduct);
    if (productNonePromotion.quantity - quantity >= 0) return true;

    const maxPromotionQuantity = this.getMaxPromotionQuantity(promotionName, product.quantity);
    const rest = productNonePromotion.quantity - maxPromotionQuantity;
    const gap = rest - quantity;
    if (gap <= 0) return false;
    return true;
  }

  getPromotion(promotionName) {
    return this.#promotionInfo.find((promotion) => promotion.name === promotionName);
  }

  getProductByProductName(productName) {
    return this.#inventoryInfo.find(({ name }) => name === productName).name;
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

  getPriceByProductName(productName) {
    const product = this.#inventoryInfo.find(({ name }) => name === productName);
    return product.price;
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
