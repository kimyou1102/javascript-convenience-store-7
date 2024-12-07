import { Console } from '@woowacourse/mission-utils';

export default class OutputView {
  static printGreetingAndInventory(inventory) {
    Console.print('안녕하세요. W편의점입니다.');
    Console.print('현재 보유하고 있는 상품입니다.\n');
    this.printInventoryList(inventory);
  }

  static printInventoryList(inventory) {
    inventory.forEach(({ name, price, quantity, promotion }) => {
      const money = price.toLocaleString('ko-KR');
      let quantityWithUnit = `${quantity}개`;

      if (quantity === 0) quantityWithUnit = '재고 없음';

      this.printInventory(name, money, promotion, quantityWithUnit);
    });
  }

  static printInventory(name, money, promotion, quantityWithUnit) {
    if (promotion === 'null') {
      Console.print(`- ${name} ${money}원 ${quantityWithUnit}`);
      return;
    }
    Console.print(`- ${name} ${money}원 ${quantityWithUnit} ${promotion}`);
  }
}
