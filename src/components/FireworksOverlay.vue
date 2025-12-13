<template>
  <div v-show="active" ref="container" class="fireworks-overlay"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Fireworks } from 'fireworks-js'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const container = ref(null)
let fireworks = null

onMounted(() => {
  if (!container.value) return

  fireworks = new Fireworks(container.value, {
    autoresize: true,
    opacity: 0.3,
    acceleration: 1.05,
    friction: 0.97,
    gravity: 1.2,
    particles: 400,//粒の数
    traceLength: 3,
    traceSpeed: 4,
    explosion: 10,//大きさ
    brightness: {
      min: 50,
      max: 100
    }
  })

  if (props.active) {
    fireworks.start()
  }
})

onBeforeUnmount(() => {
  if (fireworks) {
    fireworks.stop()
    fireworks = null
  }
})

watch(
  () => props.active,
  (value) => {
    if (!fireworks) return
    if (value) {
      fireworks.start()
    } else {
      fireworks.stop()
    }
  }
)
</script>

<style scoped>
.fireworks-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none; /* 花火中もボタン操作OK */
}
</style>