export const formatRWF = (amount) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatRWFSimple = (amount) => {
  return `${amount.toLocaleString('en-RW')} RWF`
}


