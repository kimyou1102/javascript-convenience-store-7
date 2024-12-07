import OutputView from '../view/OutputView.js';
import InventoryManagement from '../model/InventoryManagement.js';
import { getProductsData, getPromotionsData } from '../utils/getfileData.js';

export default class Controller {
  async start() {
    const productsData = await getProductsData();
    const promotionsData = await getPromotionsData();
    const inventoryManagement = new InventoryManagement(productsData, promotionsData);
    const inventory = inventoryManagement.getInventoryInfo();
    OutputView.printGreetingAndInventory(inventory);
  }
}
