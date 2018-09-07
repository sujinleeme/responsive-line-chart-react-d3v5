export const getPlotData = (data, countryName) => data.map((d, i) => ({
  id: i,
  x: d.Year,
  y: d[countryName],
}));
