<script setup>
  import { ref } from 'vue'
  import { Chart, registerables } from 'chart.js'
  import { DoughnutChart } from 'vue-chart-3'

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
        enabled: true,
        mode: 'point',
        callbacks: {
          label: function (context) {
            return context.label
          },
        },
      },
    },
  })
</script>

<template>
  <DoughnutChart ref="chart" :chartData="props.data" :options="options" />
</template>
