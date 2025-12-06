export const DELIVERY_ZONES = {
  gasabo: {
    name: 'Gasabo',
    fee: 2000,
    eta: '24 hours',
    nameRw: 'Gasabo'
  },
  kicukiro: {
    name: 'Kicukiro',
    fee: 2000,
    eta: '24 hours',
    nameRw: 'Kicukiro'
  },
  nyarugenge: {
    name: 'Nyarugenge',
    fee: 2000,
    eta: '24 hours',
    nameRw: 'Nyarugenge'
  },
  national: {
    name: 'Outside Kigali',
    fee: 5000,
    eta: '48-72 hours',
    nameRw: 'Hanze y\'u Kigali'
  }
}

export const getDeliveryFee = (zone) => {
  return DELIVERY_ZONES[zone]?.fee || 0
}

export const getDeliveryETA = (zone) => {
  return DELIVERY_ZONES[zone]?.eta || '24-48 hours'
}



