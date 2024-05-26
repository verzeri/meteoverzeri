<template>
  <div>
    <h2>Top 10 Comuni con le temperature medie più alte</h2>
    <canvas id="barChart" style="width: 800px; height: 600px;"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';

export default {
  name: 'TopCitiesChart',
  setup() {
    const jsonData = ref([]);

    const loadExcelFile = async () => {
      try {
        const response = await fetch(new URL('@/assets/Tavole-Dati-Meteoclimatici-Anno-2021.xlsx', import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Ottieni i dati delle temperature (celle C5:R113)
        const temperatureDataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'C5:R113' });

        // Ottieni le città (celle A5:A113)
        const cities = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'A5:A113' }).flat();

        jsonData.value = cities.map((city, index) => ({
          city,
          temperatures: temperatureDataArray[index]
        }));

        console.log('Dati delle temperature per città:', jsonData.value); // Log dei dati delle temperature

        createBarChart();
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    const createBarChart = () => {
      const sortedCities = jsonData.value
        .map(cityData => ({
          name: cityData.city,
          avgTemperature: cityData.temperatures.reduce((acc, val) => acc + val, 0) / cityData.temperatures.length
        }))
        .sort((a, b) => b.avgTemperature - a.avgTemperature) // Ordina in ordine decrescente
        .slice(0, 10); // Prendi solo i primi 10

      const labels = sortedCities.map(city => city.name);
      const data = sortedCities.map(city => city.avgTemperature);

      const ctx = document.getElementById('barChart').getContext('2d');

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Temperatura Media Annuale (°C)',
            data: data,
            backgroundColor: 'deepskyblue',
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    };

    onMounted(() => {
      loadExcelFile();
    });

    return {
      jsonData,
    };
  }
};
</script>

<style>
#barChart {
  margin: 20px auto;
}
</style>


