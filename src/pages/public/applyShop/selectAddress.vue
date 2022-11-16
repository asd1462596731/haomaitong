<template>
  <div id="changeAddress" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="input_box">
      <van-field v-model="inputVal" placeholder="请输入所在地区" id="input_hook" class="box_input" />
      <a class="box_btn" id="btn_hook" href="javascript:;" @click.stop="mapSearchFunc">搜索</a>
    </div>
    <div class="address_list" :style="`padding-top: ${head_rem}rem;`">
      <div class="list_item" v-for="item in result" :key="item.uid" @click="selectAddressFunc(item)">
        <div class="item_info">
          <div class="info_top">{{item.name}}</div>
          <div class="info_bottom">{{item.addressDesc}}</div>
        </div>
        <div class="item_distannce">{{item.distance}}</div>
      </div>
      <div class="list_item noBorder" v-show="result.length == 0">
        <p class="item_nodata">
          未搜索到位置信息
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      meta: this.$route.meta,
      value: '',
      result: [],
      mapHeight: 0,
      map: null,
      annotationId: null,
      UIInput: null,
      UIListView: null,
      searchHeight: 40,
      headerBorderHeight: 1,
      addressTitle: '',
      addressSubTitle: '',
      inputHeaderMargin: 10, // 搜索框与header距离
      inputOffsetMargin: 15, // 搜索框距离左边的距离
      center: {
        lon: 0,
        lat: 0
      },
      distanceList: [],
      addressInfoList: [],
      listHeight: 8,
      cityVal: '郑州',
      inputVal: '',
      mapBtnId: -1,
      changeIng: true
    }
  },
  computed: {
    ...mapGetters(['apply_info', 'choose_address_name'])
  },
  created () {
    this.$nextTick(() => {
      this.initMap()
    })
  },
  methods: {
    // 点击选择地址
    selectAddressFunc (obj) {
      let data = {
        longitude: obj.coord.lon,
        latitude: obj.coord.lat,
        merchant_address: obj.address
      }
      let addressObj = {
        province: obj.province,
        city: obj.city ? obj.city : '',
        district: obj.district ? obj.district : '',
        address: obj.address ? obj.address : ''
      }
      this.set_address_name(obj.name)
      this.set_address_select_algin(true)
      let info = {...this.apply_info, ...data}
      this.set_apply_info(info)
      this.set_apply_info_address(addressObj)
      this.map.hide()
      this.goBack()
    },
    // 初始化地图
    initMap () {
      this.map = this.$app.require('aMap')
      this.map.updateMapViewPrivacy({
        privacyAgree: 'didAgree',
        privacyShow: 'didShow',
        containStatus: 'didContain'
      })
      this.map.updateSearchPrivacy({
        privacyAgree: 'didAgree',
        privacyShow: 'didShow',
        containStatus: 'didContain'
      })
      this.openMap()
    },
    openMap () {
      let width = this.$app.winWidth
      let headerH = this.remToPx(this.head_rem) / this.dpr
      let cellH = this.remToPx(1.733333) / this.dpr
      let height = this.remToPx(6) / this.dpr
      let _this = this
      this.map.open({
        rect: {
          x: 0,
          y: headerH + cellH,
          w: width,
          h: height
        },
        center: {
          lon: 113.666486,
          lat: 34.752254
        },
        zoomLevel: 13,
        showUserLocation: true,
        fixedOn: this.$app.frameName,
        fixed: true
      }, function (ret) {
        if (ret.status) {
          _this.openLocationBtn()
          _this.getLocaPermission()
        } else {
          _this.showMsgError('地图加载失败，请检查网络后重试')
        }
      })
      this.map.addEventListener({
        name: 'viewChange'
      }, (ret) => {
        if (ret) {
          if (_this.changeIng) {
            return false
          }
          _this.changeIng = true
          _this.setCenterAndPoint(ret, 2)
        }
      })
    },
    getLocaPermission () {
      // 先获取是否有定位权限
      let resultList = this.$app.hasPermission({
        list: ['location']
      })
      let result = resultList[0]
      let granted = result.granted
      let _this = this
      // 如果没有定位权限开始获取定位权限
      if (!granted) {
        this.$app.requestPermission({
          list: ['location'],
          code: 1
        }, function (ret, err) {
          _this.requestCallBack(ret)
        })
      } else {
        this.userLocation()
      }
    },
    requestCallBack (res) {
      if (res) {
        let never = res.never
        let granted = res.list[0].granted
        if (granted) {
          // 定位开启成功开始进行定位
          this.userLocation()
        } else {
          this.showMsgError('注意：不打开定位权限会影响部分功能')
        }
      } else {
        this.showMsgError('定位权限加载失败，请稍后重试')
      }
    },
    // 打开按钮
    openLocationBtn () {
      let width = this.$app.winWidth
      let headerH = this.remToPx(this.head_rem) / this.dpr
      let cellH = this.remToPx(1.733333) / this.dpr
      let height = this.remToPx(6) / this.dpr
      let _this = this

      let y = headerH + cellH + height - 50
      this.mapButton = this.$app.require('UIButton')
      this.mapButton.open({
        rect: {
          x: 15,
          y: y,
          w: 35,
          h: 35
        },
        bg: {
          normal: 'widget://res/position.png'
        }
      }, (ret) => {
        if (ret) {
          _this.mapBtnId = ret.id
          if (ret.eventType == 'click') {
            _this.map.setZoomLevel({
              level: 13
            })
            _this.getLocaPermission()
          }
        }
      })
    },
    // 定位
    userLocation () {
      this.map.getLocation((ret, err) => {
        if (ret.status) {
          // 设置中心点
          this.map.setCenter({
            coords: {
              lon: ret.lon,
              lat: ret.lat
            }
          })
          this.center.lon = ret.lon
          this.center.lat = ret.lat
          // 显示自己位置
          this.map.showUserLocation({
            isShow: false
          })
          if (this.choose_address_name === '') {
            this.mapHotPointSearch()
          } else {
            this.inputVal = this.choose_address_name
            this.mapSearchFunc()
          }
        } else {
          this.showMsgError('定位失败请检查网络或权限后重试')
        }
      })
    },
    // 热点查询
    mapHotPointSearch () {
      let _this = this
      this.showProgress('搜索中')
      this.map.getNameFromCoords({
        lon: this.center.lon,
        lat: this.center.lat
      }, (ret, err) => {
        if (ret.status) {
          _this.inputVal = ret.township
          _this.cityVal = ret.city
          _this.mapSearchFunc()
        } else {
          _this.hideProgress()
          _this.$toast.fail(JSON.stringify(err))
        }
      })
    },
    // 地图搜索事件
    mapSearchFunc () {
      let _this = this
      this.showProgress('搜索中')
      this.map.searchInCity({
        city: _this.cityVal,
        keyword: _this.inputVal,
        pageIndex: 0,
        offset: 50,
        sortrule: 0
      }, (ret) => {
        if (ret.status) {
          _this.searchCallBack(ret)
        } else {
          _this.hideProgress()
          _this.result = []
        }
      })
    },
    // 搜索回调
    searchCallBack (ret) {
      let arr = ret.pois
      let obj = arr[0]
      if (obj) {
        this.setCenterAndPoint(obj, 1)
      }
      let _this = this
      this.result = []
      this.distanceList = []
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        let obj = {
          name: item.name,
          coord: {
            lon: item.lon,
            lat: item.lat
          },
          uid: item.uid,
          address: item.address,
          province: item.province,
          city: item.city,
          district: item.district,
          addressDesc: `${item.province}${item.city ? item.city : ''}${item.district ? item.district : ''}${item.address ? item.address : ''}`
        }
        _this.result.push(obj)
        _this.calculatedDistance(i, (arr.length - 1), {
          startLon: item.lon,
          startLat: item.lat,
          endLon: _this.center.lon,
          endLat: _this.center.lat
        })
      }
      this.hideProgress()
    },
    setCenterAndPoint (obj, type) {
      let _this = this
      if (type === 1) {
        this.changeIng = true
        this.map.setCenter({
          coords: {
            lon: obj.lon,
            lat: obj.lat
          }
        })
        this.map.removeAnnotations()
        this.map.addAnnotations({
          annotations: [{
            id: obj.lon,
            lon: obj.lon,
            lat: obj.lat,
            w: 30,
            h: 30
          }],
          draggable: false
        }, (ret) => {
        })
        setTimeout(() => {
          _this.changeIng = false
        }, 1500)
      } else if (type === 2) {
        this.center.lon = obj.lon
        this.center.lat = obj.lat
        this.mapHotPointSearch()
      }
    },
    // 计算距离
    calculatedDistance (index, length, options) {
      this.distanceList = []
      let _this = this
      this.map.getDistance({
        start: {
          lon: options.startLon,
          lat: options.startLat
        },
        end: {
          lon: options.endLon,
          lat: options.endLat
        }
      }, (ret) => {
        if (ret.status) {
          let distance = ret.distance
          if (distance > 1500) {
            distance = `${(distance / 1000).toFixed(1)}km`
          } else {
            distance = `${parseInt(distance)}m`
          }
          let obj = {
            distance: distance,
            index: index
          }
          _this.distanceList.push(obj)
          if (index == length) {
            this.distanceToRemark()
          }
        }
      })
    },
    distanceToRemark () {
      let arr = this.distanceList
      let _this = this
      arr.forEach((item) => {
        let obj = _this.result[item.index]
        obj.distance = item.distance
        _this.$set(_this.result, item.index, obj)
      })
    },
    ...mapMutations({
      set_address_select_algin: 'SET_ADDRESS_SELECT_ALGIN',
      set_apply_info: 'SET_APPLY_INFO',
      set_address_name: 'SET_ADDRESS_NAME',
      set_apply_info_address: 'SET_APPLY_INFO_ADDRESS'
    })
  },
  destroyed () {
    if (this.map) {
      this.map.hide()
    }
    this.mapButton.close({
      id: this.mapBtnId
    })
    this.$app.closeFrame({
      name: 'searchPage'
    })
  }
}
</script>
