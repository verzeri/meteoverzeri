<template>
  <div>
    <div v-if="jsonData.length">
      <label for="citySelect">Select City:</label>
      <select id="citySelect" v-model="selectedCity" @change="updateCharts">
        <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
      </select>
    </div>
    <div class="chart-container" style="margin-bottom: 50px;">
      <canvas id="temperatureChart"></canvas>
    </div>
    <div class="chart-container" style="margin-bottom: 50px;">
      <canvas id="precipitationChart"></canvas>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'HomeView',
  setup() {
    const jsonData = ref([]);
    const selectedCity = ref('');
    const cities = ref([]);
    const temperatureChart = ref(null);
    const precipitationChart = ref(null);
    const years = ref([]);

    const loadExcelFile = async () => {
      try {
        const response = await fetch(new URL('@/assets/Tavole-Dati-Meteoclimatici-Anno-2021.xlsx', import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Ottieni le città (celle A5:A113)
        cities.value = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'A5:A113' }).flat();

        // Ottieni gli anni (celle B4:Q4)
        years.value = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'B4:Q4' })[0];

        // Ottieni i dati delle temperature (celle B5:Q113)
        const temperatureDataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'B5:Q113' });
        
        // Ottieni i dati delle precipitazioni (celle R5:AG113)
        const precipitationDataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'R5:AG113' });

        jsonData.value = cities.value.map((city, index) => ({
          city,
          temperatures: temperatureDataArray[index],
          precipitations: precipitationDataArray[index]
        }));

        console.log('Città:', cities.value);  // Log delle città
        console.log('Anni:', years.value);    // Log degli anni
        console.log('Dati delle temperature:', jsonData.value);  // Log dei dati delle temperature
        console.log('Dati delle precipitazioni:', jsonData.value);  // Log dei dati delle precipitazioni

        // Imposta la città selezionata di default
        if (cities.value.length > 0) {
          selectedCity.value = cities.value[0];
          updateCharts();
        }
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    const updateCharts = () => {
      const cityData = jsonData.value.find(data => data.city === selectedCity.value);
      const temperatures = cityData ? cityData.temperatures : [];
      const precipitations = cityData ? cityData.precipitations : [];

      if (temperatureChart.value) {
        temperatureChart.value.destroy();
      }
      if (precipitationChart.value) {
        precipitationChart.value.destroy();
      }

      const ctxTemperature = document.getElementById('temperatureChart').getContext('2d');
      temperatureChart.value = new Chart(ctxTemperature, {
        type: 'line',
        data: {
          labels: years.value,
          datasets: [{
            label: `Temperature Media Annua di ${selectedCity.value}`,
            data: temperatures,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Anno'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Temperatura (°C)'
              }
            }
          }
        }
      });

      const ctxPrecipitation = document.getElementById('precipitationChart').getContext('2d');
      precipitationChart.value = new Chart(ctxPrecipitation, {
        type: 'line',
        data: {
          labels: years.value,
          datasets: [{
            label: `Precipitazioni Annue di ${selectedCity.value}`,
            data: precipitations,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Anno'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Precipitazioni (mm)'
              }
            }
          }
        }
      });
    };

    const downloadJSON = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData.value));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "data.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    onMounted(() => {
      loadExcelFile();
    });

    return {
      jsonData,
      selectedCity,
      cities,
      years,
      loadExcelFile,
      updateCharts,
      downloadJSON
    };
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 50%; /* Mantiene un rapporto 2:1 */
  margin-bottom: 50px; /* Aggiunge spazio tra i grafici */
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

select {
  margin: 20px 0;
  padding: 5px;
}
</style>
