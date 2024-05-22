<template>
  <div v-if="jsonData.length">
    <table>
      <thead>
        <tr>
          <th v-for="(key, index) in jsonData[0]" :key="index">{{ key }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in jsonData" :key="rowIndex">
          <td v-for="(value, key) in row" :key="key">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import * as XLSX from 'xlsx';

export default {
  name: 'HomeView',
  data() {
    return {
      jsonData: [],
    };
  },
  mounted() {
    this.loadExcelFile();
  },
  methods: {
    async loadExcelFile() {
      try {
        const response = await fetch(new URL('@/assets/Tavole-Dati-Meteoclimatici-Anno-2021.xlsx', import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let json = XLSX.utils.sheet_to_json(worksheet);
       
        // Rimuovi intestazioni vuote
        json = json.filter(row => Object.values(row).some(cell => cell !== ''));
       
        this.jsonData = json;
       
        // Visualizza array di elementi nella console
        console.log('Array di elementi:', this.jsonData);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
  font-weight: bold;
}

</style>
