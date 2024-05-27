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
          <td v-for="(temp, tempIndex) in row.temperatures" :key="'temp-val-' + tempIndex">{{ temp.toFixed(2) }}</td>
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
          <td v-for="(prec, precIndex) in row.precipitations" :key="'prec-val-' + precIndex">{{ prec.toFixed(2) }}</td>
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
          'Trapani': 'Sicilia',
          'Aosta': 'Valle d\'Aosta/Vallée d\'Aoste',
          'Caltanissetta': 'Sicilia',
          'Carbonia': 'Sardegna',
          'Vibo Valentia': 'Calabria'
          // Aggiungi altre città se necessario
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

        console.log('Dati delle regioni:', jsonData.value);
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
