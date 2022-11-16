<template>
  <div id="voiceVroad" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="tip" v-show="showNotificationTip">
      <img src="@/assets/img/mine/mine_icon15.png" alt="">
      <span>暂未开启通知</span>
      <a href="javascript:;">去开启</a>
    </div>
    <div class="tip" v-show="showIosNotificationTip">
      <img src="@/assets/img/mine/mine_icon15.png" alt="">
      <span>请通过系统"设置->通知"开启</span>
    </div>
    <div class="content">
      <div class="content_item" @click="setOpenShow">
        <span class="item_left">推送通知</span>
        <div class="item_right">
          <i class="right_text">
            {{radioText}}
          </i>
          <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="content_item" v-show="radioValue === 1" @click="setTimeShow">
        <span class="item_left">播报时间</span>
        <div class="item_right">
          <i class="right_text" v-show="timeVal.length > 0">
            {{timeVal[0]}}~{{timeVal[1]}}
          </i>
          <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
    </div>
    <van-action-sheet
      v-model="open_show"
      :actions="open_actions"
      @select="onOpenSelect"
    />
    <van-popup
      v-model="time_show"
      position="bottom"
      :style="{ height: 'auto' }"
    >
      <van-picker show-toolbar :columns="columns" @confirm="onTimeConfirm" @cancel="onTimeCancel" />
    </van-popup>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters, mapMutations } from 'vuex'
const time_arr_start = {
  time: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
}
const time_arr_end = {
  time: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
}
export default {
  components: {
    NavBar
  },
  data () {
    return {
      radioText: '开启',
      meta: this.$route.meta,
      radioValue: 1,
      open_actions: [{
        key: 1,
        name: '开启'
      }, {
        key: 0,
        name: '关闭'
      }],
      open_show: false,
      time_show: false,
      start_time: time_arr_start.time,
      end_time: time_arr_end.time,
      columns: [
        {
          values: time_arr_start.time,
          className: 'column1',
          defaultIndex: 6
        },
        {
          values: time_arr_end.time,
          className: 'column2',
          defaultIndex: 23
        }
      ],
      timeVal: ['06:00', '23:00'],
      showNotificationTip: false,
      showIosNotificationTip: false,
      notice_start: null,
      notice_end: null
    }
  },
  computed: {
    ...mapGetters(['user_info'])
  },
  created () {
    // 检查通知权限是否开启
    this.checkedNotification()
    this.$nextTick(() => {
      this.radioValue = this.user_info.notice_open
      this.notice_start = this.user_info.notice_start
      this.notice_end = this.user_info.notice_end
      this.radioText = this.radioValue === 1 ? '开启' : '关闭'
      let timeStart = this.start_time[this.notice_start]
      let timeEnd = this.end_time[this.notice_end]
      this.timeVal = [timeStart, timeEnd]
    })
  },
  methods: {
    onTimeCancel () {
      this.time_show = false
    },
    onTimeConfirm (values) {
      this.timeVal = values
      let notice_start = this.start_time.indexOf(values[0])
      let notice_end = this.end_time.indexOf(values[1])
      this.time_show = false
      request.post_profile_notice_time(notice_start, notice_end).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
          let data = this.user_info
          data.notice_start = notice_start
          data.notice_end = notice_end
          this.set_user_info(data)
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    setTimeShow () {
      this.time_show = true
    },
    setOpenShow () {
      this.open_show = true
    },
    onOpenSelect (item) {
      this.radioValue = item.key
      this.radioText = item.name
      this.open_show = false
      request.post_profile_notice(this.radioValue).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
          let data = this.user_info
          data.notice_open = this.radioValue
          this.set_user_info(data)
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    /**
     * 权限检查
     */
    checkedNotification () {
      if (!this.$app) {
        return false
      }
      let resultList = this.$app.hasPermission({
        list: ['notification']
      })
      let granted = resultList[0].granted
      if (granted) {
        // 已开启
        this.showNotificationTip = false
        this.showIosNotificationTip = false
      } else {
        // 未开启
        if (this.systemType !== 'ios') {
          this.showNotificationTip = true
        } else {
          this.showIosNotificationTip = true
        }
      }
    },
    ...mapMutations({
      set_user_info: 'UPDATE_USER_INFO'
    })
  }
}
</script>
