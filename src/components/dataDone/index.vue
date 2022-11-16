<template>
  <div id="dataDone">
    <div class="done_content" v-if="list.length === 0">
      <img src="@/assets/img/public/public_icon6.png" alt="">
      <span>暂无数据</span>
    </div>
    <div class="done_content done_span" v-if="list.length !== 0">
      <span>暂无更多数据</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>