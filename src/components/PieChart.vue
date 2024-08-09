<template>
  <div class="pie-chart">
    <Pie :data="data" :options="chartOptions" />
  </div>
</template>

<script>
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  name: "PieChart",
  props: {
    data: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: false,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
      }),
    },
  },
  components: {
    Pie,
  },
};
</script>

<style scoped>
.pie-chart {
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  height: 300px;
}
</style>
