/**
 * ---------------------------------------
 * This demo was created using amCharts 5.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v5/
 * ---------------------------------------
 */

let kat1Tittel = "Helse";
let kat2Tittel = "Jobb";
let kat3Tittel = "Kjærlighet";
let kat4Tittel = "Personlig utvikling";
let kat5Tittel = "Venner og familie";
let kat6Tittel = "Økonomi";
let kat7Tittel = "Moro og avkobling";
let kat8Tittel = "Hjem og omgivelser";


let root = am5.Root.new("chartdiv");
root.setThemes([
  am5themes_Animated.new(root),
  am5themes_Material.new(root)
]);
root.numberFormatter.set("numberFormat", "#.");
let chart = root.container.children.push(am5radar.RadarChart.new(root, {
  panX: false,
  panY: false
  //cursor: am5xy.XYCursor.new(root, {})
}));
let colorSet = am5.ColorSet.new(root, {
  colors: [
    am5.color("#4267b6"),
    am5.color("#7ED321"),
    am5.color("#c93939"),
    am5.color("#e48820"),
    am5.color("#e6e34a"),
    am5.color("#3c801c"),
    am5.color("#a346a7"),
    am5.color("#3dbead"),
  ],
  reuse: true
});
let xRenderer = am5radar.AxisRendererCircular.new(root, {});
xRenderer.labels.template.setAll({
  radius: 10
});
let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0,
  categoryField: "category",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {
    forceHidden: true
  })
}));
let yRenderer = am5radar.AxisRendererRadial.new(root, {
  minGridDistance: 20
});
let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  max: 10,
  renderer: yRenderer
}));
yAxis.get("renderer").labels.template.set("forceHidden", true);


// Create series
let series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  categoryXField: "category",
  opacity: 0.8
}));
let seriesHover = chart.series.push(am5radar.RadarColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  categoryXField: "category",
  opacity: 0.5
}));
series.columns.template.setAll({
  tooltipText: "{categoryX}: {valueY}",
  //showTooltipOn: "click",
  templateField: "columnSettings",
  strokeOpacity: 0,
  width: am5.p100
});
seriesHover.columns.template.setAll({
  templateField: "columnSettings",
  strokeOpacity: 0,
  width: am5.p100
});

let data = [{
  category: kat1Tittel,
}, {
  category: kat2Tittel,
}, {
  category: kat3Tittel,
}, {
  category: kat4Tittel,
}, {
  category: kat5Tittel,
}, {
  category: kat6Tittel,
}, {
  category: kat7Tittel,
}, {
  category: kat8Tittel,
}];
let i = 0;
data.forEach((d)=>{
  d['value'] = 0;
  d['columnSettings'] = {fill: colorSet.next()};
  d['index'] = i;
  i++;
});
dataHover = [...data];
data.forEach((d)=>{
  d.columnSettings['opacity'] = 0.8;
});
series.data.setAll(data);
seriesHover.data.setAll(dataHover);
xAxis.data.setAll(data);
series.set("clustered",  false);
seriesHover.set("clustered",  false);

// Animate chart
series.appear(1000);
chart.appear(1000, 100);

// Hover event
let lastHoverDataIndex = 0;
let lastHoverValue = 0;
let cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {}));
cursor.lineX.set("visible", false);
cursor.lineY.set("visible", false);
cursor.events.on("cursormoved", function(ev) {
  const posX = ev.target.getPrivate("positionX");
  const posY = ev.target.getPrivate("positionY");
  const x = xAxis.toAxisPosition(posX);
  const y = yAxis.toAxisPosition(posY);
  const item = xAxis.getSeriesItem(seriesHover, x);
  const dataIndex = item.dataContext.index;
  const yMax = yAxis.get("max");
  const oldVal = item.dataContext.value;
  const newVal = Math.min(Math.ceil(y * yMax), yMax);

  if (lastHoverDataIndex != dataIndex){
    seriesHover.data.setIndex(lastHoverDataIndex, {...seriesHover.data.getIndex(lastHoverDataIndex), value: 0});
    series.columns.getIndex(lastHoverDataIndex).set("opacity", 0.8);
    series.columns.getIndex(dataIndex).set("opacity", 0.3);
    lastHoverDataIndex = dataIndex;
  }
  if (oldVal == newVal)
    return;
  seriesHover.data.setIndex(dataIndex, {...seriesHover.data.getIndex(dataIndex), value: newVal});
  lastHoverValue = newVal;

  //console.log(dataIndex, ":", item.dataContext.category, "=", newVal);
  });

chart.events.on("globalpointermove", function (ev) {
  let x = ev.point.x;
  let y = ev.point.y;
  let chartCenterX = chart.width() / 2;
  let chartCenterY = chart.height() / 2;
  let distance = Math.sqrt(
      Math.pow(x - chartCenterX, 2) +
      Math.pow(y - chartCenterY, 2)
  );
  let maxRadius = yAxis.maxHeight();

  if (distance > maxRadius * 1.1){
      seriesHover.data.setIndex(lastHoverDataIndex, {...seriesHover.data.getIndex(lastHoverDataIndex), value: 0});
      series.columns.getIndex(lastHoverDataIndex).set("opacity", 0.8);
  }
});

// Click event
chart.events.on("click", function (ev) {
  series.data.setIndex(lastHoverDataIndex, {...series.data.getIndex(lastHoverDataIndex), value: lastHoverValue});
});