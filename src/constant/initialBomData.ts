export const initialBomData = [
  {
    id: 1,
    seq: 1,
    original_demand:
      '0603 5% 330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R  330R 1/10W',
    category_1: '电阻',
    category_2: '贴片电阻',
    part_number: '',
    manufacturer: ['厚声', '风华'],
    quantity: 3000,
    spec: {
      package: '0603',
      value: 330,
      unit: 'R',
      tolerance: '5%',
      power: '1/10W'
    },
    matchStatus: 2,
    matchedIcDatas: [
      {
        status: 2,
        productName: 'HJ0603-330R',
        productModel: '0603 5% 330R 1/10W ',
        manufacturer: 'ROYALOHM/厚声',
        idCode: 'BDDZTPHS0603WAJ0331T5E',
        package: '0603',
        quantity: 3000,
        price: 2.27,
        validStockNumber: 'CKBM004',
        deliveryDate: '8小时内发货'
      }
    ]
  },
  {
    id: 2,
    seq: 2,
    original_demand: '4D03 5% 330R 1/16W 5000',
    category_1: '电阻',
    category_2: '排阻',
    part_number: '',
    manufacturer: ['ROYALOHM', '厚声'],
    quantity: 2000,
    spec: {
      package: '4D03',
      value: 330,
      unit: 'R',
      tolerance: '5%',
      power: '1/16W'
    },
    matchStatus: 1,
    matchedIcDatas: [
      {
        status: 1,
        productName: 'HJ4D03-330R',
        productModel: '4D03 5% 330R 1/16W',
        manufacturer: 'ROYALOHM/厚声',
        idCode: 'BDDZPLHS4D03WGJ0331T5E',
        package: '4D03',
        quantity: 2000,
        price: 16.48,
        validStockNumber: 'CKBM004',
        deliveryDate: '8小时内发货'
      }
    ]
  },
  {
    id: 3,
    seq: 3,
    original_demand: '0402 2.2K/+-1%',
    category_1: '电阻',
    category_2: '贴片电阻',
    part_number: '',
    manufacturer: [],
    quantity: 50,
    spec: {
      package: '0402',
      value: 2200,
      unit: 'Ω',
      tolerance: '1%'
    },
    matchStatus: 0,
    matchedIcDatas: []
  },
  {
    id: 3,
    seq: 3,
    original_demand: '0402 2.2K/+-1%',
    matchStatus: 3,
    matchedIcDatas: []
  }
]
