<script setup>
  import { ref, computed } from 'vue'
  import { useStopwatch } from '../scripts/utils.js'

  import { useStore } from '../store/store.js'

  const store = useStore()
  const state = ref(false)
  const text = ref('Record')

  const { start, stop, time } = useStopwatch()

  const handle = async () => {
    state.value = !state.value

    if (state.value) {
      text.value = 'Stop'
      store.startRecording()
      start()
    } else {
      text.value = 'Record'
      stop()
      store.endRecording()
    }
  }
</script>

<template>
  <div v-if="store.canRecord">
    <div class="layout-center mb-2">
      <button class="button" @click="handle">{{ text }}</button>
    </div>
    <div class="layout-center">
      <span class="stopwatch" :class="{ active: state }">{{ time }}</span>
    </div>
  </div>
</template>
