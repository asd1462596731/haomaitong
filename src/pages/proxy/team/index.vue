<template>
  <div id="team" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad">
        <div class="team_item" v-for="item in dataList" :key="item.id">
          <div class="item_top">
            <div class="top_line">
              <div class="line_left line_item">
                姓名：<span>{{item.nickname}}</span>
              </div>
              <div class="line_right line_item">
                角色：
                <span v-show="item.level === 'sale'">业务员</span>
                <span v-show="item.level === 'province'">省代理</span>
                <span v-show="item.level === 'city'">市代理</span>
                <span v-show="item.level === 'area'">区代理</span>
              </div>
            </div>
            <div class="top_line">
              <div class="line_left line_item">
                手机：<span>{{item.mobile}}</span>
              </div>
              <!-- <div class="line_right line_item">
                费率：<span>0.35%</span>
              </div> -->
            </div>
          </div>
          <div class="item_bottom">
            <span>加入时间：{{item.create_time}}</span>
            <a href="javascript:;" @click="jumpTo(`/teamManage?id=${item.id}`)">管理</a>
          </div>
        </div>
        <DataDone v-show="finished" :list="dataList"/>
      </van-list>
    </van-pull-refresh>
    <div class="fixed_button">
      <a href="javascript:;" @click="getRate()">新增下级</a>
    </div>
  </div>
</template>
<script>
import DataDone from '@/components/dataDone'
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters} from 'vuex'
export default {
  components: {
    NavBar,
    DataDone
  },
  data () {
    return {
      meta: this.$route.meta,
      loading: false,
      finished: false,
      isLoading: false,
      page: 0,
      dataList: []
    }
  },
   computed: {
	    ...mapGetters(['user_info'])
	},
     created () {
		  
	},
  methods: {
    getListData () {
      this.page = this.page + 1
      request.get_agent_team(this.page).then(res => {
        let arr = res.data
        if (arr.length === 0) {
          this.finished = true
          this.loading = false
          this.isLoading = false
          return false
        }
        if (res.code === this.SUCCESS_CODE) {
          if (this.isLoading) {
            // 下拉刷新
            this.dataList = arr
          } else {
            // 上啦加载
            this.dataList = this.dataList.concat(arr)
          }
          this.loading = false
          this.isLoading = false
        } else {
          this.$toast.faile(res.msg)
        }
      })
    },
	getRate(){
		request.post_get_rate(this.user_info.id).then(res => {
			
		  if (res.code === this.SUCCESS_CODE) {
					     
					var status = res.data.status;
					if(status == 0){
						this.$toast.fail("代理商费率未设置，请联系管理员！");
					}else{
						this.jumpTo('/teamAdd')
					}
								
		     }
		})
	},
    onLoad () {
      this.getListData()
    },
    onRefresh () {
      this.page = 0
      this.finished = false
      this.isLoading = true
      this.dataList = []
    }
  }
}
</script>
