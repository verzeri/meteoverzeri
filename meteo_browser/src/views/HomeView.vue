<template>
  <div v-if="jsonData.length">
    <table>
      <thead>
        <tr>
          <th rowspan="2">COMUNI</th>
          <th colspan="16">TEMPERATURA MEDIA ANNUA (°C)</th>
        </tr>
        <tr>
          <th v-for="(year, index) in years" :key="'temp-' + index">{{ year }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in jsonData" :key="rowIndex">
          <td>{{ row.city }}</td>
          <td v-for="(temp, tempIndex) in row.temperatures" :key="'temp-val-' + tempIndex">{{ temp }}</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th rowspan="2">COMUNI</th>
          <th colspan="16">PRECIPITAZIONE TOTALE ANNUA (mm)</th>
        </tr>
        <tr>
          <th v-for="(year, index) in years" :key="'prec-' + index">{{ year }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in jsonData" :key="rowIndex">
          <td>{{ row.city }}</td>
          <td v-for="(prec, precIndex) in row.precipitations" :key="'prec-val-' + precIndex">{{ prec }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { ref, onMounted } from 'vue';

export default {
  name: 'HomeView',
  setup() {
    const jsonData = ref([]);
    const years = ref([]);

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

        jsonData.value = cities.map((city, index) => ({
          city,
          temperatures: temperatureDataArray[index],
          precipitations: precipitationDataArray[index]
        }));

        console.log('Città:', cities);  // Log delle città
        console.log('Anni:', years.value);  // Log degli anni
        console.log('Dati delle temperature:', jsonData.value);  // Log dei dati delle temperature
        console.log('Dati delle precipitazioni:', jsonData.value);  // Log dei dati delle precipitazioni
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    onMounted(() => {
      loadExcelFile();
    });

    return {
      jsonData,
      years,
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
  transition: background-color 0.3s ease; /* Transizione per il cambio di sfondo */
}

th {
  background-color: deepskyblue; /* Colore di sfondo delle intestazioni */
  color: white; /* Colore del testo delle intestazioni */
}

tbody tr:nth-child(even) {
  background-color: #f2f2f2; /* Colore di sfondo delle righe pari */
}

tbody tr:hover {
  background-color: #ddd; /* Colore di sfondo al passaggio del mouse sulle righe */
}

td:hover {
  background-color: #c0c0c0; /* Colore di sfondo al passaggio del mouse sulle celle */
}

thead tr th[colspan] {
  background-color: deepskyblue; /* Colore di sfondo delle celle con colspan */
}

thead tr th[colspan]:not(:first-child) {
  border-left: 1px solid #fff; /* Bordo tra le celle con colspan */
}
</style>

