export const medFormOptions = [
  { label: 'Cairan', value: 'cairan' },
  { label: 'Kapsul', value: 'kapsul' },
  { label: 'Tablet', value: 'tablet' },
  { label: 'Suntikan', value: 'suntikan' },
  { label: 'Bubuk', value: 'bubuk' },
  { label: 'Patch', value: 'patch' },
  { label: 'Gel', value: 'gel' },
];

export const dosageOptions = {
  cairan: [
    { label: '¼ sendok makan', value: '¼ sendok makan', doseQuantity: 3.75 },
    { label: '½ sendok makan', value: '½ sendok makan', doseQuantity: 7.5 },
    { label: '1 sendok makan', value: '1 sendok makan', doseQuantity: 15 },
    { label: '2 sendok makan', value: '2 sendok makan', doseQuantity: 30 },
    { label: '3 sendok makan', value: '3 sendok makan', doseQuantity: 45 },
    { label: '4 sendok makan', value: '4 sendok makan', doseQuantity: 60 },
    { label: '½ sendok teh', value: '½ sendok teh', doseQuantity: 2.5 },
    { label: '1 sendok teh', value: '1 sendok teh', doseQuantity: 5 },
    { label: '2 sendok teh', value: '2 sendok teh', doseQuantity: 10 },
    { label: '3 sendok teh', value: '3 sendok teh', doseQuantity: 15 },
    { label: '4 sendok teh', value: '4 sendok teh', doseQuantity: 20 },
  ],
  kapsul: [
    { label: '1 kapsul', value: '1 kapsul', doseQuantity: 1 },
    { label: '2 kapsul', value: '2 kapsul', doseQuantity: 2 },
    { label: '3 kapsul', value: '3 kapsul', doseQuantity: 3 },
    { label: '4 kapsul', value: '4 kapsul', doseQuantity: 4 },
  ],
  tablet: [
    { label: '½ tablet', value: '½ tablet', doseQuantity: 0.5 },
    { label: '1 tablet', value: '1 tablet', doseQuantity: 1 },
    { label: '2 tablet', value: '2 tablet', doseQuantity: 2 },
  ],
  suntikan: [
    { label: '1 ampul', value: '1 ampul', doseQuantity: 1 },
    { label: '2 ampul', value: '2 ampul', doseQuantity: 2 },
    { label: '3 ampul', value: '3 ampul', doseQuantity: 3 },
  ],
  bubuk: [
    { label: '½ sendok takar', value: '½ sendok takar', doseQuantity: 2.5 },
    { label: '1 sendok takar', value: '1 sendok takar', doseQuantity: 5 },
    { label: '2 sendok takar', value: '2 sendok takar', doseQuantity: 10 },
    { label: '¼ sendok makan', value: '¼ sendok makan', doseQuantity: 3.75 },
    { label: '½ sendok makan', value: '½ sendok makan', doseQuantity: 7.5 },
    { label: '1 sendok makan', value: '1 sendok makan', doseQuantity: 15 },
    { label: '2 sendok makan', value: '2 sendok makan', doseQuantity: 30 },
    { label: '3 sendok makan', value: '3 sendok makan', doseQuantity: 45 },
    { label: '4 sendok makan', value: '4 sendok makan', doseQuantity: 60 },
  ],
  patch: [
    { label: '1 patch', value: '1 patch', doseQuantity: 1 },
    { label: '2 patch', value: '2 patch', doseQuantity: 2 },
    { label: '3 patch', value: '3 patch', doseQuantity: 3 },
  ],
  gel: [
    { label: '½ aplikator', value: '½ aplikator', doseQuantity: 0.5 },
    { label: '1 aplikator', value: '1 aplikator', doseQuantity: 1 },
    { label: '2 aplikator', value: '2 aplikator', doseQuantity: 2 },
    { label: '3 aplikator', value: '3 aplikator', doseQuantity: 3 },
  ],
};

export const frequencyOptions = [
  { label: '1x sehari', value: '1x sehari', timesPerDay: 1, intervalDays: 1 },
  { label: '2x sehari', value: '2x sehari', timesPerDay: 2, intervalDays: 1 },
  { label: '3x sehari', value: '3x sehari', timesPerDay: 3, intervalDays: 1 },
  { label: '4x sehari', value: '4x sehari', timesPerDay: 4, intervalDays: 1 },
  { label: '1x per 2 hari', value: '1x per 2 hari', timesPerDay: 1, intervalDays: 2 },
  { label: '1x per 3 hari', value: '1x per 3 hari', timesPerDay: 1, intervalDays: 3 },
  { label: '1x per minggu', value: '1x per minggu', timesPerDay: 1, intervalDays: 7 },
  { label: '1x per bulan', value: '1x per bulan', timesPerDay: 1, intervalDays: 30 },
  { label: 'Setiap 6 jam', value: 'Setiap 6 jam', timesPerDay: 4, intervalDays: 1 },
  { label: 'Setiap 8 jam', value: 'Setiap 8 jam', timesPerDay: 3, intervalDays: 1 },
  { label: 'Setiap 12 jam', value: 'Setiap 12 jam', timesPerDay: 2, intervalDays: 1 },
];
