<template>
  <div>
    <Bar :data="data" :options="chartOptions" />
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: "BarChart",
  props: {
    data: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: false,
      default: () => ({
        scales: {
          x: {
            maxBarThickness: 30, 
          },
          y: {
            beginAtZero: true,
          },
        },
      }),
    },
  },
  components: {
    Bar,
  },
};
</script>
