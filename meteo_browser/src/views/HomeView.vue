<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Città</th>
          <th v-for="year in years" :key="year">{{ year }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.Comune">
          <td>{{ row.Comune }}</td>
          <td v-for="year in years" :key="year">{{ row[year] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
      data: [
        {"Comune": "Torino", "2006": 15.02, "2007": 15.43, "2008": 14.55, "2009": 15.09, "2010": 13.87, "2011": 15.37, "2012": 14.97, "2013": 14.41, "2014": 15.28, "2015": 14.79, "2016": 15.31, "2017": 14.67, "2018": 14.95, "2019": 15.2, "2020": 14.67, "2021": 14.56},
        {"Comune": "Vercelli", "2006": 13.19, "2007": 13.36, "2008": 13.34, "2009": 13.49, "2010": 12.54, "2011": 13.86, "2012": 13.42, "2013": 13.15, "2014": 14.21, "2015": 13.95, "2016": 13.85, "2017": 14.03, "2018": 13.78, "2019": 13.77, "2020": 13.42, "2021": 13.67}
        // Aggiungi altri comuni qui...
      ]
    };
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
</style>
