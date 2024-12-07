export const validateBuyProducts = (productInput) => {
  hasSpecialSymbol(productInput);
  checkWrapper(productInput);
  const products = productInput.split(',');

  checkComma(products);
  products.forEach((product) => checkItem(product));
};

export const validateResponse = (answer) => {
  if (answer !== 'Y' && answer !== 'N') {
    throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
  }
};

const checkWrapper = (productInput) => {
  for (let i = 0; i < productInput.length - 1; i++) {
    if (productInput[i] === ']' && productInput[i + 1] !== ',') {
      throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
    }
    if (productInput[i] === ',' && productInput[i + 1] !== '[') {
      throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
    }
  }
};

const hasSpecialSymbol = (productInput) => {
  if (productInput.replace(/[^\[\],\w\s가-힣-]/g, '').length !== productInput.length) {
    throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
  }
};

const checkComma = (products) => {
  for (let i = 0; i < products.length; i++) {
    const startCount = products[i].split('').filter((text) => text === '[').length;
    const endCount = products[i].split('').filter((text) => text === ']').length;
    if (startCount !== endCount)
      throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
    if (startCount > 1 || endCount > 1)
      throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
  }
};

const checkItem = (product) => {
  checkItemEmpty(product);
  const [name, quantity] = product.split('-').map((x) => x.replace(/\[|\]/g, ''));

  checkProductInfo(name, quantity);
  checkQuantity(quantity);
  if (quantity < 1)
    throw new Error('[ERROR] 상품의 수량은 1이상으로만 입력 가능합니다. 다시 입력해 주세요.');
};

const checkItemEmpty = (product) => {
  if (product === '') {
    throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
  }
};

const checkProductInfo = (name, quantity) => {
  if (name === '' || quantity === '') {
    throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
  }
};

const checkQuantity = (quantity) => {
  if (isNaN(quantity)) {
    throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
  }
};
