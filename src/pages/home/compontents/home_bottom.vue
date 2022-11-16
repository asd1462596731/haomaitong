<template>
  <div id="home_bottom">
    <span></span>
    <div v-html="site_config.copyright" style="text-align:center;"></div>
    <span></span>
  </div>
</template>
<script>
import { company_name_s } from '@/config'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      company_name_s: company_name_s
    }
  },
  computed: {
  	...mapGetters(['site_config','is_code']),
  },
}
</script>
