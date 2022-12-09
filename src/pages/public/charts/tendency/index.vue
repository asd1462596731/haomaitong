<template>
    <div>
        <div class="tendency-cut">
            <van-tabs v-model="active" color="#d1a156" @change="cut()">
                <van-tab title="营业额" name="turnover"></van-tab>
                <van-tab title="交易笔数" name="transaction"></van-tab>
            </van-tabs>
        </div>
        <div class="done_content"
            v-if="(is_money === true && active === 'turnover') || (is_stroke === true && active === 'transaction')">
            <img src="@/assets/img/public/public_icon6.png" alt="">
            <span>暂无数据</span>
        </div>
        <div id="bar_chart" style="width:100%;height:23rem"
            v-show="(is_money === false && active === 'turnover') || (is_stroke === false && active === 'transaction')">
        </div>
    </div>
</template>

<script>
import * as request from '@/api'
export default {
    data() {
        return {
            line_chat_list: [],
            start_time: null,
            end_time: null,
            active: '',
            mach_id: null,
            desk_id: null,
            key: 3,
            id: '',
            all_money: [],
            all_stroke: [],
            activeName: '',
            is_money: false,
            is_stroke: false,
            title: '',
        }
    },
    mounted() {
        this.getOrderReportFunc()
    },
    methods: {
        //切换标签页
        cut() {
            this.line_chat_list = []
            this.getOrderReportFunc()
        },
        //echart数据
        getOrderReportFunc() {
            // this.time = this.start_time+'-'+this.end_time

            request.post_order_report(this.start_time, this.end_time, this.key, this.mach_id, this.desk_id).then(res => {
                if (res.code === this.SUCCESS_CODE) {
                    let chat_list = res.data.data_time;
                    for (let i = chat_list.length - 1; i >= 0; i--) {
                        this.line_chat_list.push(chat_list[i].slice(3, 5) + '日');
                    }
                    var data = res.data.data;
                    this.all_money = [];
                    this.all_stroke = [];
                    for (const key in data) {
                        this.all_money.push(Number(data[key][0]))
                        this.all_stroke.push(Number(data[key][3]))
                        if (this.all_money.findIndex(target => target === 0) == 1) {
                            this.is_stroke = true
                        } else {
                            this.is_stroke = false
                        }
                        if (this.all_stroke.findIndex(target => target === 0) == 1) {
                            this.is_money = true
                        } else {
                            this.is_money = false
                        }
                    }
                    this.all_money = this.all_money.reverse()
                    this.all_stroke = this.all_stroke.reverse()
                    this.echear()
                } else {
                    this.$toast.fail(res.msg)
                }
            })
        },
        echear() {
            let myChart = this.$echarts.init(document.getElementById('bar_chart'))

            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '15%',
                    right: '15%',
                    top: '1%'
                },
                xAxis: {
                    show: false,
                    type: 'value',
                },
                yAxis: {
                    type: 'category',
                    data: this.line_chat_list,
                    axisLine: { show: false },
                    axisLabel: {
                        interval: 0,
                        textStyle: {
                            color: '#515151',
                            fontSize: 13
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [
                    {
                        type: 'bar',
                        data: this.active === 'turnover' ? this.all_money : this.all_stroke,
                        barWidth: 10,   //柱状宽度
                        label: {
                            show: true, //开启显示
                            position: 'right', //在上方显示
                            formatter: this.active === 'turnover' ? '￥{c}' : '{c}(笔)',
                            textStyle: { //数值样式
                                color: 'black',
                                fontSize: 11
                            }
                        },
                        itemStyle: {    //柱状颜色和圆角
                            color: '#f9db63',
                            barBorderRadius: [0, 5, 5, 0],
                        }
                    },

                ]
            };

            myChart.setOption(option)
        }

    }
}
</script>

<style scoped lang="less">
.tendency-cut {
    width: 38%;
}

.done_content {
    width: 100%;
    height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
        width: 5.44rem;
        height: 3.986667rem;
    }

    span {
        font-size: .426667rem;
        color: #666666;
    }
}
</style>