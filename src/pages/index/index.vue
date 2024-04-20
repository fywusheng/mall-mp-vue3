<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view class="home" id="home">
    <!-- 头部导航栏 -->
    <navigation-bars
      :alpha="0"
      :backgroundColor="'linear-gradient(270deg, #FF5121 0%, #FF692D 60%, #FF7936 100%);'"
    >
      <template v-slot:title1>
        <view class="navigation-bar flex-h flex-c-s">
          <image
            class="image"
            src="http://192.168.1.187:10088/static/songhui/common/logo.jpg"
            mode="scaleToFill"
          />
          <text class="navigation-bar__title fs-32 c-white flex-1">松辉云康</text>
        </view>
      </template>
    </navigation-bars>

    <!-- 搜索和城市 -->
    <view class="new-header" :style="{ top: navigationBarHeight + 'px' }">
      <view class="flex flex-row items-center mr-20rpx ml-32rpx" style="flex: 1">
        <view class="left-view mr-32rpx items-center flex" @click="handleCityClick">
          <text class="city-name font-size-36rpx c-white">
            {{ city.name || '定位中' }}
          </text>
          <image
            class="city-icon ml-8rpx"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-white.png"
          />
        </view>
        <view class="search-bar flex flex-row flex-1 items-center pl-32rpx bg-white">
          <text class="search-bar__text flex-1 text-gray" @click="handleVoiceSearchClick">
            搜索商品
          </text>
        </view>
        <view class="_right">
          <image
            class="search-bar__voice ml-16rpx"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/home/notice.png"
            @click="handlerClickPop(1)"
          />
        </view>
      </view>
    </view>
    <view class="_height" :style="{ height: navigationBarHeight + 54 + 'px' }"></view>

    <!-- 轮播图 -->
    <view class="banner-wrapper">
      <swiper
        class="banner-swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="4000"
        :duration="500"
        @change="hanldeBannerChange"
      >
        <swiper-item class="item" v-for="(item, index) in banners" :key="index">
          <image
            class="image"
            mode="scaleToFill"
            :src="item.bannerUrl"
            @click="handleBannerClick(index)"
            @error="handleBannerLoadFail(index)"
          />
        </swiper-item>
      </swiper>
    </view>

    <!-- 商品分类 -->
    <view v-if="parts.length > 0" class="part-wraper">
      <view class="part" :class="{ 'one-line': parts.length < 8 }">
        <view class="item" v-for="(v, i) in parts" :key="i" @click="typeList(v, i)">
          <image class="img" mode="scaleToFill" :src="v.iconUrl" />
          <view class="name">{{ v.name }}</view>
        </view>
      </view>
    </view>

    <!-- 积分兑换 -->
    <view class="benefit ml-32rpx mr-32rpx mt-24rpx mb-48rpx" @click="goPath(0)">
      <view class="benefit-top title-top flex-h flex-c-b" @click="goPath(0)">
        <view class="title-top-left flex-h flex-c-c">
          <view class="title-top-left-text _line">
            <view class="_leftLine"></view>
            积分兑换
          </view>
          <view class="_more">更多</view>
        </view>
        <view></view>
      </view>
      <view class="jf_bg">
        <view class="item">
          <view class="_item" v-for="(v, i) in pointList" :key="i" @click="goPath(0)">
            <image mode="scaleToFill" class="img" :src="v.mainImgUrl" />
            <view class="title">{{ v.name }}</view>
            <view class="btn">积分免费领</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 商品推荐 -->
    <view class="benefit ml-32rpx mr-32rpx mt-24rpx">
      <view class="benefit-top title-top flex-h flex-c-b">
        <view class="title-top-left flex-h flex-c-c">
          <view class="title-top-left-text _line">
            <view class="_leftLine"></view>
            精品推荐
          </view>
        </view>
        <view></view>
      </view>
      <view class="recommed">
        <view class="_block" v-for="(v, i) in prodList" :key="i" @click="goItemClick(v)">
          <image mode="scaleToFill" class="icon" :src="v.mainImgUrl" />
          <image
            class="icon bgempt"
            v-if="v.soldOut === 0"
            src="http://192.168.1.187:10088/static/home/empt.png"
          />
          <view class="name">{{ v.name }}</view>
          <!-- <view class="jf">积分抵扣￥{{ v.creditPoints }}</view> -->
          <view class="_p">
            <text class="fs-32 label">{{ member ? '会员到手价' : '到手价' }}</text>
            <text>￥{{ member ? v.memberPrice : v.finalPrice }}</text>
          </view>
        </view>
      </view>
      <!-- <uni-load-more :status="status" /> -->
      <!-- top -->
      <view class="top-layout">
        <!-- <button class="menu" @click="goBuy">
          <image
            class="icon icon-service"
            src="http://192.168.1.187:10088/static/images/common/bug.png"
          />
        </button> -->
        <div class="menu" @click="toTop">
          <image
            class="icon icon-top"
            src="http://192.168.1.187:10088/static/images/common/top.png"
          />
        </div>
      </view>
      <!-- <view class="top-layout">
        <view class="menu" @click="toTop">
          <image
            class="icon-top"
            src="http://192.168.1.187:10088/static/common/top.png"
          />
        </view>
      </view> -->
    </view>
  </view>
</template>

<script lang="ts" setup>
const { statusBarHeight } = uni.getSystemInfoSync()
const navigationBarHeight = ref(statusBarHeight + 44)

const parts = ref([])
const city = ref(uni.getStorageSync('city'))
const banners = ref([])
const pointList = ref('0')
const prodList = ref([])

onMounted(() => {
  uni.removeStorageSync('current_city')
  getLocation()
  // this.getCateGoryList()
  // this.recommend1(21)
  // 监听城市选择回调
  // uni.$on('didSelectCity', this.handleSelectCity)
})
// 获取定位
const getLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      console.log(res, '定位成功')
      uni.setStorageSync('location', res)
      // 调用高德地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
      // api.regeoMap(
      //   {
      //     location: res.longitude + ',' + res.latitude,
      //   },
      //   {
      //     success: (res) => {
      //       let city = {}
      //       // 当城市是省直辖县时返回为空，以及城市为北京、上海、天津、重庆四个直辖市时，该字段返回为[],否则为城市名称（字符串）
      //       if (res.regeocode.addressComponent.city.length === 0) {
      //         city = {
      //           code: res.regeocode.addressComponent.adcode.substr(0, 2) + '0100',
      //           name: res.regeocode.addressComponent.province,
      //           realCode: res.regeocode.addressComponent.adcode.substr(0, 2) + '0000',
      //         }
      //       } else {
      //         city = {
      //           code: res.regeocode.addressComponent.adcode.substr(0, 4) + '00',
      //           name: res.regeocode.addressComponent.city,
      //         }
      //       }
      //       this.handleSelectCity(city)
      //     },
      //   },
      // )
    },
    fail: (error) => {
      console.log(error, '定位失败')
      // 定位失败默认北京市
      // const city = { code: 110100, name: '北京市' }
      // this.handleSelectCity(city)
    },
  })
}
</script>

<style lang="scss" scoped>
.home {
  z-index: 1;
  min-height: 100vh;
  padding-bottom: 222rpx;
  background: #fff;

  ._height {
    background: linear-gradient(270deg, #ff5121 0%, #ff692d 60%, #ff7936 100%);
  }

  .navigation-bar {
    width: 100%;
    height: 100%;

    .image {
      width: 48rpx;
      height: 48rpx;
      margin: 0 14rpx 0 30rpx;
    }

    .navigation-bar__title {
      height: 44rpx;
      font-size: 32rpx;
      font-weight: 400;
      line-height: 44rpx;
      color: #fff;
    }
  }

  .pop {
    position: fixed;
    top: 220rpx;
    right: 30rpx;
    z-index: 100;
    width: 232rpx;
    padding-top: 20rpx;
    background-color: #616266;
    border-radius: 16rpx;
    box-shadow: 0rpx 8rpx 24rpx 0rpx rgb(0 0 0 / 12%);

    .line {
      display: flex;
      justify-content: center;
      height: 50rpx;
      margin-bottom: 38rpx;
      line-height: 50rpx;

      ._img {
        width: 40rpx;
        height: 40rpx;
        margin-top: 7rpx;
        margin-right: 24rpx;
      }

      .name {
        width: 108rpx;
        font-size: 36rpx;
        font-weight: 400;
        color: #fff;
      }
    }
  }

  .new-header {
    // padding-bottom: 14rpx;
    position: fixed;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    width: 100%;
    height: 54px;
    background: linear-gradient(270deg, #ff5121 0%, #ff692d 60%, #ff7936 100%);
    transform: scale(1);

    .left-view,
    .right-view {
      flex-shrink: 0;
      max-width: 180rpx;
    }

    .city-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .city-icon {
      width: 16rpx;
      min-width: 16rpx;
      height: 10rpx;
    }

    .search-bar {
      box-sizing: border-box;
      height: 80rpx;
      border-radius: 40rpx;

      &__icon {
        width: 32rpx;
        height: 32rpx;
        border-radius: 16rpx;
      }

      &__line {
        width: 2rpx;
        height: 24rpx;
        background: #c9c9c9;
      }

      &__voice {
        width: 48rpx;
        height: 48rpx;
      }
    }

    ._right {
      line-height: 30rpx;
    }
  }

  .banner-wrapper {
    width: 100%;
    height: 300rpx;
    // position: relative;
    // margin-top: 39rpx;
    .common-services {
      position: relative;
      height: 240rpx;
      padding-bottom: 22rpx;

      .background-image {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .item {
        z-index: 9;

        &__icon {
          width: 96rpx;
          height: 96rpx;
        }
      }

      .white-box {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 22rpx;
        background-color: #f5f5f5;
        border-radius: 28px 28px 0 0;
      }
    }

    .banner-swiper {
      width: 100%;
      //height: 424rpx;
      height: 300rpx;
      // position: absolute;
      // top: 219rpx;
      // left: 0;
      .item {
        // height: 424rpx;
        height: 300rpx;

        .image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .benefit-top {
    margin-bottom: 30rpx;

    .title-top-left {
      display: flex;
      justify-content: space-between;
      width: 100%;

      ._more {
        font-size: 32rpx;
        font-weight: 400;
        color: #999;
      }
    }
  }

  ._leftLine {
    width: 8rpx;
    height: 38rpx;
    margin-right: 16rpx;
    background: #ff9500;
    border-radius: 4rpx;
  }

  ._line {
    display: flex;
    font-size: 40rpx;
    font-weight: 600;
    line-height: 43rpx;
    color: #333;
  }

  .benefit {
    background: #fff;

    .f-s-32 {
      font-size: 32rpx;
    }

    .m-r-28 {
      margin-right: 28rpx;
    }

    .more {
      font-size: 32rpx;
      font-weight: 400;
      color: #999;
    }

    .jf_bg {
      position: relative;
      height: 278rpx;
      background-image: url('http://192.168.1.187:10088/static/home/jf_bj.png');
      background-repeat: no-repeat;
      background-size: contain;

      .item {
        position: absolute;
        top: 18rpx;
        left: 245rpx;
        display: flex;
        text-align: center;

        .img {
          width: 100rpx;
          height: 100rpx;
          margin-top: 18rpx;
        }

        ._line {
          display: flex;

          ._new {
            font-size: 32rpx;
            font-weight: 500;
            color: #f50;
          }

          ._old {
            font-size: 26rpx;
            font-weight: 400;
            color: #999;
            text-decoration: line-through;
          }
        }

        .price {
          width: 200rpx;
          height: 34rpx;
          font-size: 24rpx;
          font-weight: 400;
          line-height: 34rpx;
          color: #ff2600;
          border: 2rpx solid #ff2600;
          border-radius: 4rpx;
        }

        ._item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 68%;
          margin-right: 15rpx;
          background: #fff;
          border-radius: 8rpx;
          box-shadow: 0rpx 0rpx 10rpx 0rpx rgb(226 0 0 / 50%);

          .title {
            width: 200rpx;
            margin-top: 10rpx;
            overflow: hidden;
            font-size: 32rpx;
            font-weight: 400;
            color: #333;
            text-overflow: ellipsis;
            white-space: nowrap !important;
          }

          .btn {
            width: 162rpx;
            height: 42rpx;
            margin: 10rpx auto 14rpx;
            font-size: 30rpx;
            font-weight: 400;
            line-height: 42rpx;
            color: #fff;
            background: linear-gradient(127deg, #fd831e 0%, #ffac28 100%);
            border-radius: 8rpx;
            box-shadow: 0rpx 4rpx 10rpx 0rpx rgb(98 172 219 / 18%);
          }
        }
      }
    }

    .shop-content {
      display: grid;
      grid-template-rows: 156rpx 156rpx;
      grid-template-columns: 332rpx 332rpx;
      grid-gap: 22rpx 24rpx;

      .img-item {
        .image {
          width: 332rpx;
          height: 156rpx;
        }
      }
    }
  }

  .recommed {
    // padding: 32rpx;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    min-height: 500rpx;

    ._block {
      position: relative;
      width: 332rpx;
      margin-bottom: 25rpx;
      background: #fff;
      border-radius: 16px;

      .icon {
        width: 332rpx;
        height: 340rpx;
        border-radius: 16rpx;

        &.bgempt {
          position: absolute;
          top: 0;
          left: 0;
        }
      }

      .name {
        display: -webkit-box;
        margin-top: 18rpx;
        margin-left: 18rpx;
        overflow: hidden;
        // height: 85rpx;
        font-size: 36rpx;
        font-weight: 400;
        color: #333;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .jf {
        display: -webkit-box;
        width: fit-content;
        max-width: 270rpx;
        height: 48rpx;
        padding-right: 12rpx;
        padding-left: 10rpx;
        margin-top: 50rpx;
        margin-left: 18rpx;
        overflow: hidden;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 48rpx;
        color: #ff2600;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: normal !important;
        border: 2rpx solid #ff2600;
        border-radius: 4rpx;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      ._p {
        display: flex;
        height: 50rpx;
        margin: 8rpx 0;
        margin-left: 18rpx;
        font-size: 40rpx;
        font-weight: 500;
        line-height: 50rpx;
        color: #f50;

        .label {
          margin-left: 8rpx;
        }

        .getPrice {
          font-size: 28rpx;
          font-weight: 500;
          color: #f50;
        }
      }
    }
  }

  .part-wraper {
    width: 100vw;
    padding: 32rpx 46rpx;

    .part {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 658rpx;
      overflow: auto;
      background: #fff;
      border-radius: 24rpx;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 25%;
        margin-bottom: 46rpx;
        text-align: center;

        &:nth-child(8),
        &:nth-child(5),
        &:nth-child(6),
        &:nth-child(7) {
          margin-bottom: 0;
        }

        .img {
          width: 108rpx;
          height: 108rpx;
          margin-bottom: 16rpx;
        }

        .name {
          display: -webkit-box;
          overflow: hidden;
          font-size: 36rpx;
          font-weight: 400;
          color: #333;
          text-overflow: ellipsis;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }

      &.one-line {
        flex-wrap: nowrap;

        .item {
          flex-shrink: 0;
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
