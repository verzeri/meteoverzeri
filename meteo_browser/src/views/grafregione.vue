<template>
  <div v-if="jsonData.length">
    <div>
      <label for="region-select">Seleziona una regione:</label>
      <select id="region-select" v-model="selectedRegion">
        <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
      </select>
    </div>

    <canvas id="temperatureChart" style="margin-bottom: 40px;"></canvas>
    <canvas id="precipitationChart"></canvas>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { ref, onMounted, watch, nextTick } from 'vue';
import { Chart } from 'chart.js/auto';

export default {
  name: 'HomeView',
  setup() {
    const jsonData = ref([]);
    const years = ref([]);
    const selectedRegion = ref('');
    const regions = ref([]);
    let temperatureChart = null;
    let precipitationChart = null;

    const loadExcelFile = async () => {
      try {
        const response = await fetch(new URL('@/assets/Tavole-Dati-Meteoclimatici-Anno-2021.xlsx', import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Ottieni le città (celle A5:A113)
        const cities = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'A5:A113' }).flat();

        // Ottieni gli anni (celle B4:Q4)
        years.value = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'B4:Q4' })[0];

        // Ottieni i dati delle temperature (celle B5:Q113)
        const temperatureDataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'B5:Q113' });

        // Ottieni i dati delle precipitazioni (celle R5:AG113)
        const precipitationDataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'R5:AG113' });

        // Mappa città -> regione
        const cityToRegionMap = {
          'Roma': 'Lazio',
          'Milano': 'Lombardia',
          'Napoli': 'Campania',
          'Torino': 'Piemonte',
          'Palermo': 'Sicilia',
          'Genova': 'Liguria',
          'Bologna': 'Emilia-Romagna',
          'Firenze': 'Toscana',
          'Bari': 'Puglia',
          'Catania': 'Sicilia',
          'Venezia': 'Veneto',
          'Verona': 'Veneto',
          'Messina': 'Sicilia',
          'Padova': 'Veneto',
          'Trieste': 'Friuli-Venezia Giulia',
          'Taranto': 'Puglia',
          'Brescia': 'Lombardia',
          'Parma': 'Emilia-Romagna',
          'Prato': 'Toscana',
          'Modena': 'Emilia-Romagna',
          'Reggio Calabria': 'Calabria',
          'Reggio Emilia': 'Emilia-Romagna',
          'Perugia': 'Umbria',
          'Ravenna': 'Emilia-Romagna',
          'Livorno': 'Toscana',
          'Cagliari': 'Sardegna',
          'Foggia': 'Puglia',
          'Rimini': 'Emilia-Romagna',
          'Salerno': 'Campania',
          'Ferrara': 'Emilia-Romagna',
          'Sassari': 'Sardegna',
          'Latina': 'Lazio',
          'Giugliano in Campania': 'Campania',
          'Monza': 'Lombardia',
          'Siracusa': 'Sicilia',
          'Pescara': 'Abruzzo',
          'Bergamo': 'Lombardia',
          'Forlì': 'Emilia-Romagna',
          'Trento': 'Trentino-Alto Adige/Südtirol',
          'Vicenza': 'Veneto',
          'Terni': 'Umbria',
          'Bolzano': 'Trentino-Alto Adige/Südtirol',
          'Novara': 'Piemonte',
          'Piacenza': 'Emilia-Romagna',
          'Ancona': 'Marche',
          'Andria': 'Puglia',
          'Arezzo': 'Toscana',
          'Udine': 'Friuli-Venezia Giulia',
          'Cesena': 'Emilia-Romagna',
          'Lecce': 'Puglia',
          'Pesaro': 'Marche',
          'Barletta': 'Puglia',
          'Alessandria': 'Piemonte',
          'La Spezia': 'Liguria',
          'Pistoia': 'Toscana',
          'Pisa': 'Toscana',
          'Brindisi': 'Puglia',
          'Fiumicino': 'Lazio',
          'Caserta': 'Campania',
          'Lucca': 'Toscana',
          'Treviso': 'Veneto',
          'Como': 'Lombardia',
          'Varese': 'Lombardia',
          'Sesto San Giovanni': 'Lombardia',
          'Pozzuoli': 'Campania',
          'Guidonia Montecelio': 'Lazio',
          'Cosenza': 'Calabria',
          'Grosseto': 'Toscana',
          'Asti': 'Piemonte',
          'Pavia': 'Lombardia',
          'Matera': 'Basilicata',
          'Campobasso': 'Molise',
          'Lamezia Terme': 'Calabria',
          'Trapani': 'Sicilia',
          'Massa': 'Toscana',
          'Ragusa': 'Sicilia',
          'Viterbo': 'Lazio',
          'Vercelli': 'Piemonte',
          'Avellino': 'Campania',
          'Rovigo': 'Veneto',
          'Cremona': 'Lombardia',
          'Benevento': 'Campania',
          'Gela': 'Sicilia',
          'Afragola': 'Campania',
          'Carpi': 'Emilia-Romagna',
          'Imperia': 'Liguria',
          'Crotone': 'Calabria',
          'Agrigento': 'Sicilia',
          'Molfetta': 'Puglia',
          'Lodi': 'Lombardia',
          'Viareggio': 'Toscana',
          'Aosta': 'Valle d\'Aosta/Vallée d\'Aoste',
          'Caltanissetta': 'Sicilia',
          'Carbonia': 'Sardegna',
          'Vibo Valentia': 'Calabria'
        };

        // Raggruppa i dati per regione
        const regionData = {};

        cities.forEach((city, index) => {
          const region = cityToRegionMap[city];
          if (!region) return;

          if (!regionData[region]) {
            regionData[region] = {
              temperatures: Array(years.value.length).fill(0),
              precipitations: Array(years.value.length).fill(0),
              count: 0
            };
          }

          temperatureDataArray[index].forEach((temp, i) => {
            regionData[region].temperatures[i] += temp;
          });

          precipitationDataArray[index].forEach((prec, i) => {
            regionData[region].precipitations[i] += prec;
          });

          regionData[region].count += 1;
        });

        // Calcola le medie
        for (const region in regionData) {
          regionData[region].temperatures = regionData[region].temperatures.map(temp => temp / regionData[region].count);
          regionData[region].precipitations = regionData[region].precipitations.map(prec => prec / regionData[region].count);
        }

        jsonData.value = Object.entries(regionData).map(([region, data]) => ({
          region,
          ...data
        }));

        regions.value = Object.keys(regionData);
        selectedRegion.value = regions.value[0];

        console.log('Dati delle regioni:', jsonData.value);

        // Aspetta che il DOM sia completamente aggiornato prima di creare i grafici
        nextTick(updateCharts);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    const createChart = (canvasId, data, label, unit) => {
      const ctx = document.getElementById(canvasId).getContext('2d');
      return new Chart(ctx, {
        type: 'line',
        data: {
          labels: years.value,
          datasets: [
            {
              label: label,
              data: data,
              borderColor: 'deepskyblue',
              backgroundColor: 'rgba(0, 191, 255, 0.2)',
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: unit,
              },
            },
          },
        },
      });
    };

    const updateCharts = async () => {
      await nextTick();
      const region = jsonData.value.find((data) => data.region === selectedRegion.value);
      if (region) {
        const temperatureData = region.temperatures.map((temp) => parseFloat(temp.toFixed(2)));
        const precipitationData = region.precipitations.map((prec) => parseFloat(prec.toFixed(2)));

        if (temperatureChart) {
          temperatureChart.destroy();
        }
        if (precipitationChart) {
          precipitationChart.destroy();
        }

        temperatureChart = createChart('temperatureChart', temperatureData, 'Temperatura Media Annua (°C)', '°C');
        precipitationChart = createChart('precipitationChart', precipitationData, 'Precipitazione Totale Annua (mm)', 'mm');
      }
    };

    onMounted(() => {
      loadExcelFile();
    });

    watch(selectedRegion, updateCharts);

    return {
      jsonData,
      years,
      selectedRegion,
      regions,
    };
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 16px;
  text-align: center;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  transition: background-color 0.3s ease;
}

th {
  background-color: deepskyblue;
  color: white;
}

tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

tbody tr:hover {
  background-color: #ddd;
}

td:hover {
  background-color: #c0c0c0;
}

thead tr th[colspan] {
  background-color: deepskyblue;
}

thead tr th[colspan]:not(:first-child) {
  border-left: 1px solid #fff;
}
</style>

