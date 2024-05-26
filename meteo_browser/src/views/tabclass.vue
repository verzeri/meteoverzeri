<template>
  <div v-if="jsonData.length">
    <h2>Top 10 Comuni con le temperature medie più alte</h2>
    <table>
      <thead>
        <tr>
          <th>COMUNI</th>
          <th>TEMPERATURA MEDIA ANNUALE (°C)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(city, index) in sortedCities" :key="index">
          <td>{{ city.name }}</td>
          <td>{{ city.avgTemperature }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { ref, onMounted, computed } from 'vue';

export default {
  name: 'TopCitiesView',
  setup() {
    const jsonData = ref([]);
    const sortedCities = computed(() => {
      return jsonData.value
        .map(cityData => ({
          name: cityData.city,
          avgTemperature: cityData.temperatures.reduce((acc, val) => acc + val, 0) / cityData.temperatures.length
        }))
        .sort((a, b) => b.avgTemperature - a.avgTemperature) // Ordina in ordine decrescente
        .slice(0, 10); // Prendi solo i primi 10
    });

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
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    onMounted(() => {
      loadExcelFile();
    });

    return {
      jsonData,
      sortedCities,
    };
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 16px;
  text-align: center; /* Allineamento del testo delle celle */
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
}

th {
  background-color: deepskyblue; /* Colore di sfondo delle intestazioni */
  color: white; /* Colore del testo delle intestazioni */
}
</style>
