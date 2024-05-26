<template>
  <div v-if="jsonData.length">
    <table>
      <thead>
        <tr>
          <th rowspan="2">REGIONI</th>
          <th colspan="16">TEMPERATURA MEDIA ANNUA (°C)</th>
        </tr>
        <tr>
          <th v-for="(year, index) in years" :key="'temp-' + index">{{ year }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in jsonData" :key="rowIndex">
          <td>{{ row.region }}</td>
          <td v-for="(temp, tempIndex) in row.temperatures" :key="'temp-val-' + tempIndex">{{ temp }}</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th rowspan="2">REGIONI</th>
          <th colspan="16">PRECIPITAZIONE TOTALE ANNUA (mm)</th>
        </tr>
        <tr>
          <th v-for="(year, index) in years" :key="'prec-' + index">{{ year }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in jsonData" :key="rowIndex">
          <td>{{ row.region }}</td>
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

        // Ottieni le città e le regioni (celle A5:B113)
        const locations = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'A5:B113' });

        // Ottieni gli anni (celle C4:R4)
        years.value = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'C4:R4' })[0];

        // Ottieni i dati delle temperature (celle C5:R113)
        const temperatureDataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'C5:R113' });

        // Ottieni i dati delle precipitazioni (celle S5:AH113)
        const precipitationDataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 'S5:AH113' });

        // Raggruppa i dati per regione
        const regionData = {};

        locations.forEach(([city, region], index) => {
          if (!regionData[region]) {
            regionData[region] = { temperatures: Array(years.value.length).fill(0), precipitations: Array(years.value.length).fill(0), count: 0 };
          }
          temperatureDataArray[index].forEach((temp, tempIndex) => {
            regionData[region].temperatures[tempIndex] += temp;
          });
          precipitationDataArray[index].forEach((prec, precIndex) => {
            regionData[region].precipitations[precIndex] += prec;
          });
          regionData[region].count += 1;
        });

        // Calcola la media delle temperature e delle precipitazioni per regione
        jsonData.value = Object.keys(regionData).map(region => ({
          region,
          temperatures: regionData[region].temperatures.map(temp => (temp / regionData[region].count).toFixed(2)),
          precipitations: regionData[region].precipitations.map(prec => (prec / regionData[region].count).toFixed(2))
        }));

        console.log('Regioni:', Object.keys(regionData));  // Log delle regioni
        console.log('Dati delle temperature per regione:', jsonData.value.map(data => data.temperatures));  // Log dei dati delle temperature per regione
        console.log('Dati delle precipitazioni per regione:', jsonData.value.map(data => data.precipitations));  // Log dei dati delle precipitazioni per regione
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
