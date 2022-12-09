<template>
    <div>
        <div class="head-but">
            <div class="head-but-left">
                <div class="ht" :class="{ 'ht_c': is_check == index }" v-for="(item,index) in data_time"
                    @click="check_time(item.key, index, item.name)">{{ item.name }}</div>
            </div>
            <div class="head-but-right" @click="rq">
                日期选择
            </div>
        </div>
        <ChartsHead head-title="日期选择" ref="time_or" @beginSearchHandler="beginSearchHandler" v-if="is_rq" />

        <div class="Traffic-trend">
            <div class="raffic-trend-title">
                客流量趋势
            </div>
            <van-row>
                <van-col :span="6" :style="getStyle(sumclient)" @click="activeBtn('0')">
                    <div class="cline">总顾客(人)</div>
                    <div class="money">{{ total }}</div>
                    <div class="new_money">{{ total_compare }} 人</div>
                </van-col>
                <van-col :span="6" :style="getStyle(newclient)" @click="activeBtn('1')">
                    <div class="cline">新顾客(人)</div>
                    <div class="money">{{ new_consumer }}</div>
                    <div class="new_money">{{ new_consumer_compare }} 人</div>
                </van-col>
                <van-col :span="6" :style="getStyle(oldclient)" @click="activeBtn('2')">
                    <div class="cline">回头客(人)</div>
                    <div class="money">{{ old_consumer }}</div>
                    <div class="new_money">{{ old_consumer_compare }} 人</div>
                </van-col>
            </van-row>
            <div id="line_charts" style="width:100%;height:8rem"></div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/navBar'
import ChartsHead from '../components/chartsHead'
import * as request from '@/api'
import {
    theme_color,
    web_h5
} from '@/config'
export default {
    components: {
        NavBar,
        ChartsHead
    },
    data() {
        return {
            sumclient: true,
            newclient: false,
            oldclient: false,
            new_consumer_compare: 0,
            old_consumer_compare: 0,
            total_compare: 0,
            new_consumer: 0,
            old_consumer: 0,
            total: 0,
            selectStores: [],
            selectMerchants: [],
            meta: this.$route.meta,
            line_chart_date: [],
            line_chat_list: [],
            pie_chart_data: [],
            pie_chart_list: [],
            start_time: null,
            end_time: null,
            isShowPie: true,
            is_popup: false,
            is_check: 0,
            is_rq: false,
            mach_id: null,
            desk_id: null,
            key: 1,
            id: '',
            all_total: [],
            order_money: [],
            activeName: '',
            data_time: [{
                name: '天',
                key: 1
            },
            {
                name: '周',
                key: 2
            },
            {
                name: '月',
                key: 3
            },
            ],
            email: '',
            title: '',
            mach_name: '',
            time: '天',
            create_time: null
        }



    },
    mounted() {
        this.getOrderReportFunc()
    },
    methods: {
        getStyle(val) {
            if (val) {
                return { 'border': '1px solid #61afe3',}
            } else {
                return
            }
        },
        activeBtn(val) {
            if (val === '0') {
                if (this.sumclient === false) {
                    this.sumclient = true
                    this.oldclient = false
                    this.newclient = false
                    this.getOrderReportFunc(val)
                }
            } else if (val === '2') {
                if (this.oldclient === false) {
                    this.oldclient = true
                    this.sumclient = false
                    this.newclient = false
                    this.getOrderReportFunc(val)
                }
            } else if (val === '1') {
                if (this.newclient === false) {
                    this.newclient = true
                    this.oldclient = false
                    this.sumclient = false
                    this.getOrderReportFunc(val)
                }
            }
        },
        check_time(key, index, name) {
            this.is_check = index;
            this.is_rq = false
            this.key = key;
            this.time = name
            this.getOrderReportFunc()
        },
        getOrderReportFunc(val) {
            // this.time = this.start_time+'-'+this.end_time
            // var dom = document.getElementById('line_charts');
            // var myChart = this.$echarts.init(dom);
            // myChart.showLoading()
            val = val === undefined ? '0' : val
            request.post_order_consumer(this.create_time, this.key).then(res => {
                if (res.code === this.SUCCESS_CODE) {
                    // myChart.hideLoading()
                    this.line_chat_list = res.data.data_time;
                    var data = res.data.data;
                    this.total = res.data.consumer.total
                    this.new_consumer = res.data.consumer.new_consumer
                    this.old_consumer = res.data.consumer.old_consumer
                    this.old_consumer_compare = res.data.consumer.old_consumer_compare
                    this.total_compare = res.data.consumer.total_compare
                    this.new_consumer_compare = res.data.consumer.new_consumer_compare
                    this.all_total = [];
                    for (const key in data) {
                        this.all_total.push(Number(data[key][val]))
                    }
                    this.echear()
                } else {
                    this.$toast.fail(res.msg)
                }
            })
        },
        rq() {
            if (!this.is_rq) {
                this.is_rq = true
                this.is_check = 'k'
                setTimeout(() => {
                    this.start_time = this.$refs.time_or.begin_date
                    this.end_time = this.$refs.time_or.end_date
                    this.time = this.start_time + '-' + this.end_time
                }, 1)

            } else {
                this.is_rq = false
                this.is_check = 0
                this.key = 1
                this.time = "天"
            }
            this.getOrderReportFunc()
        },
        beginSearchHandler(data) {
            this.key = ''
            this.start_time = data.begin
            this.end_time = data.end
            this.time = this.start_time + '-' + this.end_time
            this.create_time = this.start_time + ' - ' + this.end_time
            this.getOrderReportFunc()
        },
        echear() {
            let myChart = this.$echarts.init(document.getElementById('line_charts'))
            var option = {
                color: ["#3398DB"],
                tooltip: {
                    axisPointer: {
                        type: "cross"
                    }
                },
                grid: {
                    left: '8%',
                    top: '10%',
                    bottom: '15%'
                },
                xAxis: [{
                    show: true,
                    type: "category",
                    name: "",
                    data: this.line_chat_list,
                    axisLabel: {
                        textStyle: {
                            fontSize: "12",
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            width: 1 // 粗细
                        }
                    },
                    //    splitLine: {     //网格线
                    //    show: true
                    // },
                    nameTextStyle: {
                        color: '#909198',
                        fontWeight: "100"
                    },
                    axisTick: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: "value",
                    axisLine: {
                        lineStyle: {
                        },
                        show: false, //不显示坐标轴线
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: "12",
                        },
                    },
                    axisTick: {
                        show: false
                    }
                }],
                series: [{
                    name: '总营收',
                    type: 'line',
                    symbol: "circle",
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 1.4
                            }
                        }
                    },
                    data: this.all_total
                },
                ]
            }
            myChart.setOption(option)
        }
    }
}
</script>

<style scoped lang="less">
.raffic-trend-title {
    font-size: .4rem;
    font-weight: 850;
    padding-top: .6rem;
    margin-left: .4rem;
}

.van-row {
    display: flex;
    justify-content: space-around;
    margin-left: .3rem;

    .van-col {
        height: 2rem;
        margin-top: .3rem;
        border: 1px solid #cfcfcf;
        border-radius: .3rem;

        .cline {
            margin-top: .28rem;
            margin-left: .2rem;
            font-size: .333rem;
            font-weight: 650;
            color: #838383;
        }

        .money {
            margin-top: .1rem;
            margin-left: .28rem;
            font-size: .38rem;
            font-weight: 750;
        }

        .new_money {
            margin-top: .4rem;
            margin-left: .45rem;
            font-size: .2rem;
            color: #b68285;
        }
    }
}
</style>