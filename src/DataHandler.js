export const getPlotData = (arr, keyX, keyY) => arr.map((d, i) => ({
  id: i,
  x: d[keyX],
  y: d[keyY],
}));


export const getColumnsX = (arr, keyX) => arr.map(e => e[keyX]);

export const addPlotData = (currentArr, initArr, key) => currentArr.map((e, i) => ({ ...e, [key]: initArr[i][key] }));

export const removePlotData = (arr, key) => arr.map(({ [key]: _, ...keepAttrs }) => keepAttrs);

export const getLegends = (arr, keyX) => arr.filter(e => e !== keyX);
