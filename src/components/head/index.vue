<template>
  <div id="head" :style="head_style">
    <div class="head_left">
      <slot name="left" />
    </div>
    <div class="head_center">
      <slot name="center" />
    </div>
    <div class="head_right">
      <slot name="right" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    styles: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      head_style: ''
    }
  },
  created () {
    this.head_style = `padding-top: ${this.top_rem}rem;${this.styles}`
  }
}
</script>
