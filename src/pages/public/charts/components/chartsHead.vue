<template>
  <div id="chartsHead">
    <div class="head_title">
      {{headTitle}}:
    </div>
    <div class="head_date">
      <div class="date_item" @click="selectDateShow('begin')">
        <i>{{begin_date}}</i>
        <b></b>
      </div>
      <span>至</span>
      <div class="date_item" @click="selectDateShow('end')">
        <i>{{end_date}}</i>
        <b></b>
      </div>
    </div>
    <van-popup
      v-model="date_show"
      position="bottom"
      :style="{ height: 'auto' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :title="date_title"
        :max-date="maxDate"
        @confirm="dateConfirm"
        @cancel="dateCancel"
      />
    </van-popup>
  </div>
</template>
<script>
import { FormatDate } from '@/util'
export default {
  props: {
    headTitle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      maxDate: '',
      date_show: false,
      currentDate: '',
      begin_date: '2019-01-01',
      end_date: '2019-12-31',
      type: 'begin',
      begin_temp: null,
      end_temp: null,
      date_title: '开始日期'
    }
  },
  created () {
    this.currentDate = new Date()
    this.maxDate = new Date()

    this.end_temp = Date.parse(new Date())
    this.end_date = FormatDate(new Date())

    this.begin_temp = this.end_temp - (7 * (24 * 3600 * 1000))
    this.begin_date = FormatDate(new Date(this.begin_temp))
  },
  methods: {
    selectDateShow (type) {
      this.type = type
      if (type === 'begin') {
        this.date_title = '开始日期'
      } else {
        this.date_title = '结束日期'
      }
      this.date_show = true
    },
    dateConfirm (date) {
      let temp = Date.parse(date)
      if (this.type === 'begin') {
        this.begin_temp = temp
        this.begin_date = FormatDate(date)
      } else {
        this.end_temp = temp
        this.end_date = FormatDate(date)
      }
      this.date_show = false
      if (this.begin_temp > this.end_temp) {
        this.$dialog.alert({
          message: '开始时间必须小于结束时间'
        })
		this.begin_temp = this.end_temp - (7 * (24 * 3600 * 1000))
		this.begin_date = FormatDate(new Date(this.begin_temp))
        return false
      }
      // let diff = this.end_temp - this.begin_temp
      // let days = diff / (24 * 3600 * 1000)
      // if (days > 7) {
      //   this.$dialog.alert({
      //     message: '日期不能超过7天'
      //   })
      //   return false
      // }
      let data = {
        begin: this.begin_date,
        end: this.end_date
      }
      this.$emit('beginSearchHandler', data)
    },
    dateCancel () {
      this.date_show = false
    }
  }
}
</script>
