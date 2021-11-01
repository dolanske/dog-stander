<script setup>
  import { ref } from 'vue'
  import { Chart, registerables } from 'chart.js'
  import { BarChart } from 'vue-chart-3'

  Chart.register(...registerables)

  const props = defineProps({
    data: Object,
    // config: Object,
  })

  const options = ref({
    plugins: {
      title: { display: false },
      legend: { display: false },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      yAxis: {
        ticks: {
          display: false,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      xAxis: {
        ticks: {
          autoSkip: true,
          // maxTicksLimit: 128,
        },
      },
    },
  })
</script>

<template>
  <BarChart ref="chart" :chartData="props.data" :options="options" />
</template>
