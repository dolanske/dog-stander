<script setup>
  import { computed } from 'vue'
  import { formatTime, formatDate, getTimeFromSeconds, inRange } from '../scripts/utils'
  import { useStore } from '../store/store.js'
  import Donut from './graphs/Donut.vue'
  import Bar from './graphs/Bar.vue'
  const store = useStore()

  const data = computed(() => store.graphs.donut.datasets[0].data)

  const smiley = computed(() => {
    const d = data.value[0]
    if (d === 0) return ':)'
    if (inRange(d, 3, 10)) return ': - )'
    if (inRange(d, 11, 25)) return ': -'
    if (inRange(d, 25, 40)) return ':/'
    if (inRange(d, 41, 65)) return ':('
    if (inRange(d, 66, 75)) return ': - ('
    if (inRange(d, 76, 85)) return ":'-(("
    if (inRange(d, 86, 100)) return '😃🔫'
  })
</script>

<template>
  <template v-if="!store.canRecord">
    <template v-if="!store.loading">
      <div class="analyze-layout">
        <div class="header">
          <h2>{{ formatDate(store.recording.timestamp.start) }}</h2>
          <div class="times">
            <p>
              Started: <strong>{{ formatTime(store.recording.timestamp.start) }}</strong>
            </p>
            <p>
              Duration <strong>{{ getTimeFromSeconds(store.recording.timestamp.duration) }}</strong>
            </p>

            <p>Neighbours rating: <strong class="red" v-html="smiley"></strong></p>
          </div>
        </div>
        <div class="button-wrap">
          <button class="button btn-red" @click="store.$reset">Back</button>
          <!-- <button class="button">Save</button> -->
        </div>
      </div>

      <div class="flex-layout">
        <div class="graph-wrap">
          <div class="graph-prewrap">
            <Donut :data="store.graphs.donut" />
          </div>

          <ul class="graph-legend">
            <li v-if="data[0] > 0">
              <div class="point loud"></div>
              <strong>{{ data[0] }}%</strong>
              <span>Loud</span>
            </li>
            <li v-if="data[1] > 0">
              <div class="point noise"></div>
              <strong>{{ data[1] }}%</strong>
              <span>Noise</span>
            </li>
            <li v-if="data[2] > 0">
              <div class="point"></div>
              <strong>{{ data[2] }}%</strong>
              <span>Quiet</span>
            </li>
          </ul>
        </div>

        <div class="bar-wrap">
          <Bar :data="store.graphs.bar" />
        </div>
      </div>
    </template>
    <div v-else-if="store.recording.timestamp.end">L O A D I N G</div>
  </template>
</template>
