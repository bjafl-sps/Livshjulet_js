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
let chart = root.container.children.push(am5radar.RadarChart.new(root, {
  panX: false,
  panY: false
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
  tooltip: am5.Tooltip.new(root, {})
}));
let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  max: 10,
  renderer: am5radar.AxisRendererRadial.new(root, {
    minGridDistance: 20
  })
}));
yAxis.get("renderer").labels.template.set("forceHidden", true);

// Create series
let series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  categoryXField: "category"
}));

series.columns.template.setAll({
  tooltipText: "{categoryX}: {valueY}",
  templateField: "columnSettings",
  strokeOpacity: 0,
  width: am5.p100
});
let data = [{
  category: kat1Tittel,
  value: 0,
  columnSettings: {
    fill: colorSet.next()
  }
}, {
  category: kat2Tittel,
  value: 0,
  columnSettings: {
  fill: colorSet.next()
            }
}, {
  category: kat3Tittel,
  value: 0,
  columnSettings: {
    fill: colorSet.next()
  }
}, {
  category: kat4Tittel,
  value: 0,
  columnSettings: {
    fill: colorSet.next()
  }
}, {
  category: kat5Tittel,
  value: 0,
  columnSettings: {
    fill: colorSet.next()
  }
}, {
  category: kat6Tittel,
  value: 0,
  columnSettings: {
    fill: colorSet.next()
  }
}, {
  category: kat7Tittel,
  value: 0,
  columnSettings: {
    fill: colorSet.next()
  }
}, {
  category: kat8Tittel,
  value: 0,
  columnSettings: {
    fill: colorSet.next()
  }
}];
series.data.setAll(data);
xAxis.data.setAll(data);

// Animate chart
series.appear(1000);
chart.appear(1000, 100);

// Add click event to change value
series.columns.template.events.on("click", function (ev) {
  // Get the current data item
  let dataItem = ev.target.dataItem;
  
  console.log("clicked")
  if (dataItem) {
      // Increment value on click
      let newValue = dataItem.get("valueY") + 10; // Adjust increment as needed
      dataItem.set("valueY", newValue > 100 ? 0 : newValue); // Reset to 0 if it exceeds 100
      console.log(dataItem)
  }
});

// Add a click event on the entire chart
chart.events.on("click", function (ev) {
  // Get the coordinates of the click relative to the chart's origin
  let chartCenterX = chart.width() / 2;
  let chartCenterY = chart.height() / 2;

  let clickX = ev.point.x;
  let clickY = ev.point.y;

  // Calculate the distance from the center
  let distance = Math.sqrt(
      Math.pow(clickX - chartCenterX, 2) +
      Math.pow(clickY - chartCenterY, 2)
  );
  let maxRadius = yAxis.maxHeight();

  if (distance > maxRadius * 1.1)
    return;

  // Calculate the new value based on the distance
  const maxVal = yAxis.get("max");
  let newValue = Math.ceil(Math.min(maxVal, (distance / maxRadius) * maxVal));

  // Determine which sector (or category) was clicked based on angle
  let angle = Math.atan2(clickY - chartCenterY, clickX - chartCenterX) 
      * (180 / Math.PI) + 90; // +90 to adjust for different 0-point
  angle = (angle + 360) % 360; // Normalize angle to [0, 360)

  // Identify which category was clicked based on angle
  let clickedCategory = null;
  let sectorAngleSize = 360 / data.length;
  data.forEach((item, index) => {
      if (angle >= sectorAngleSize * index && angle < sectorAngleSize * (index + 1)) {
          clickedCategory = item.category;

          // Update the data value for the clicked category
          data[index].value = newValue;

          // Log the information
          console.log("angle: ", angle);
          console.log("index: ", index);
          console.log(`Clicked category: ${clickedCategory}`);
          console.log(`New value: ${newValue.toFixed(2)}`);
          console.log(`Distance from origin: ${distance.toFixed(2)} pixels`);
      }
  });

  console.log(ev);
  // Update the chart data to reflect the changes
  series.data.setAll(data);
});

// Function for updating value
function setValue(index, value) {
  
  // Set value
  let row = data[index];
  row.value = value;
  console.log(row.columnSettings);
  series.data.setIndex(index, {
    category: row.category,
    value: value,
    columnSettings: row.columnSettings
  });
  
  // Marker valgt tall
  let areas = document.getElementsByClassName("area");
  let valueBtns = areas[index].getElementsByClassName("value");
  console.log(valueBtns.length);
  for (let i = 0; i < valueBtns.length; i++) {
    if (i == value-1) {
      valueBtns[i].classList.add("clicked");
    } else {
      valueBtns[i].classList.remove("clicked");
    }
  }
  //valueBtns[value-1].classList.add("clicked");
}