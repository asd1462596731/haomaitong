<template>
  <div class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <section class="form-wrap">
      <van-field
        name="picker"
        :value="user_info.nickname"
        label="代理商名称"
        readonly
      />
      <van-field
        v-model="comboLink"
        name="comboLink"
        label="赋能链接"
        placeholder="请输入完整赋值链接口令"
      />

      <van-field
        v-model="comboType"
        name="comboType"
        label="赋能类型"
        placeholder="请输入赋值类型，例如：淘宝，拼多多"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" @click="editSubmit">
          提交
        </van-button>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from "@/components/navBar";
import * as request from "@/api";
import { mapGetters } from "vuex";
export default {
  name: "Edit",
  data() {
    return {
      meta: this.$route.meta,
      comboLink: "",
      comboType: "",
    };
  },

  components: {
    NavBar,
  },
  computed: {
    ...mapGetters(["user_info"]),
  },
  created() {
    this.$nextTick(() => {
      this.comboLink = this.$route.params.url;
      this.comboType = this.$route.params.url_type;
    });
  },
  methods: {
    async editSubmit() {
      const params = {
        id: this.$route.params.id,
        url: this.comboLink,
        url_type: this.comboType,
      };
      const result = await request.ad_setting_updata(params);
      const { code, msg } = result;

      if (code === 0) {
        this.$toast.success(msg);
      } else if (code === 1) {
        this.$toast.success(msg);
      }
      this.jumpTo({ name: "adSet" });
    },
  },
};
</script>

<style scoped>
.form-wrap {
  padding: 0.4rem;
}
</style>
