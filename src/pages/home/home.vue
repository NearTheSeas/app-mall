<template>
    <div>
      <head-top signin-up='msite'>
        <!--当用户为MC时 显示物流车-->
          <div v-if="shwoDelivery" class="link_location" slot="logo"  @click="delivery">
             <svg width="100%" height="100%">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#delivery"></use>
            </svg>
          </div>
        <!--点击店铺名称 跳转首页-->
        <router-link to="/home" slot="msite-title" class="msite_title">
          <span class="title_text ellipsis">{{msietTitle}}</span>
        </router-link>
      </head-top>
      <!--轮播广告-->
      <nav class="msite_nav">
        <div class="swiper-container" >
            <div class="swiper-wrapper">
                <div class="swiper-slide banner_images_container" v-for="(banner, index) in banners" :key="index">
                  <router-link :to="{path: banner.path, query: {title: banner.title}}" :key="banner.id" class="banner_activity" v-bind:style="{ backgroundImage: 'url('+ banner.url + ')' ,height: bannerHeight + 'px'}" >
                    <!-- <img :src="imgBaseUrl + banner.image_url"> -->
                  </router-link>
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
      </nav>
      <div class="shop_list_container">
        <header class="shop_header">
          <svg class="shop_icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
          </svg>
          <span class="shop_header_title">主推品</span>
        </header>
        <!--主推品列表-->
        <shop-list  @moveInCart="listenInCart" @showMoveDotEvent="showMoveDotFun"></shop-list>
      </div>
      <!--底部菜单栏-->
      <foot-guide></foot-guide>
      <!--加入购物车动画-->
      <transition appear @after-appear = 'afterEnter' @before-appear="beforeEnter" v-for="(item,index) in showMoveDot" :key="index">
        <span class="move_dot" v-if="item">
            <svg class="move_liner">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
            </svg>
        </span>
      </transition>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import headTop from '../../components/header/header'
import footGuide from '../../components/footer/footGuide'
import shopList from '../../components/common/shoplist'
import {loginData, getBanner} from '../../service/getData'
import '../../plugins/swiper.min.js'
import '../../plugins/swiper.min.css'

export default {
    data () {
        return {
          msietTitle: loginData.shopName, // msiet页面头部标题
          // hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
          bannerHeight:'',
          banners:[], // 轮播广告
          shopListArr:[],
          showDeivery:false,
          showMoveDot: [], //控制下落的小圆点显示隐藏
          elLeft: 0, //当前点击加按钮在网页中的绝对top值
          elBottom: 0, //当前点击加按钮在网页中的绝对高度值
          windowHeight: null, //屏幕的高度
          receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
        }
    },
    beforeMount(){
      
      // 计算高度及宽度
      let width = document.documentElement.clientWidth
      this.bannerHeight = 168 / 375 * width
    },
    mounted(){
      this.initData()
      this.windowHeight = window.innerHeight;
    },
    components: {
      headTop,
      shopList,
      footGuide,
    },
    created: function() {
      this.INIT_BUYCART();
    },
    computed: {
      shwoDelivery(){
        
        return loginData.isMC ? true : false
      }
    },
    methods: {
       ...mapMutations([
          'INIT_BUYCART'
        ]),
        delivery(){
          // 调用安卓功能
          android.intent()
        },
        initData(){
          //获取导航食品类型列表
          getBanner().then(res => {
            this.banners = res.data.data
          }).then(() => {
            //初始化swiper
            new Swiper('.swiper-container', {
              pagination: '.swiper-pagination',
              loop: true
            });
          })

        },
       //显示下落圆球
       showMoveDotFun(showMoveDot, elLeft, elBottom){
          this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
          this.elLeft = elLeft;
          this.elBottom = elBottom;
       },
       beforeEnter(el){
          el.style.transform = `translate3d(0,${37 + this.elBottom - this.windowHeight}px,0)`;
          el.children[0].style.transform = `translate3d(${this.elLeft - 30}px,0,0)`;
          el.children[0].style.opacity = 0;
       },
       afterEnter(el){
          el.style.transform = `translate3d(0,0,0)`;
          el.children[0].style.transform = `translate3d(9rem,0,0)`;
          el.style.transition = 'transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
          el.children[0].style.transition = 'transform .55s linear';
          this.showMoveDot = this.showMoveDot.map(item => false);
          el.children[0].style.opacity = 1;
          el.children[0].addEventListener('transitionend', () => {
              this.listenInCart();
          })
          el.children[0].addEventListener('webkitAnimationEnd', () => {
              this.listenInCart();
          })
       },
       //监听圆点是否进入购物车
       listenInCart(){
        //  console.log(this.$refs.cartContainer)
            if (!this.receiveInCart) {
                this.receiveInCart = true;
                // console.log(this.$refs.cartContainer)
                // this.$refs.cartContainer.addEventListener('animationend', () => {
                //     this.receiveInCart = false;
                // })
                // this.$refs.cartContainer.addEventListener('webkitAnimationEnd', () => {
                //     this.receiveInCart = false;
                // })
            }
        },
    },
    watch: {

    }
}

</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';
  .link_location {
    left: .8rem;
    @include wh(1rem, 1rem);
    @include ct;
    svg {
      fill:#fff;
    }
  }

  .msite_title{
    @include center;
        width: 50%;
        color: #fff;
        text-align: center;
        // margin-left: -0.5rem;
        .title_text{
            @include sc(0.8rem, #fff);
            text-align: center;
            display: block;
        }
  }

  .msite_nav{
    padding-top: 1.95rem;
    background-color: #fff;
    border-bottom: 0.025rem solid $bc;
    .swiper-container{
      .swiper-pagination{
        bottom: 0.2rem;
      }
    }
  }
  .banner_images_container{
    display:flex;
    flex-wrap: wrap;
    .banner_activity{
      width: 100%;
      background-size: cover;
      @include fj(center);
    }
  }
  .shop_list_container{
    margin-top: .4rem;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
    .shop_header{
      .shop_icon{
        fill: #999;
        margin-left: 0.6rem;
        vertical-align: middle;
        @include wh(0.6rem, 0.6rem);
      }
      .shop_header_title{
        color: #999;
        @include font(0.55rem, 1.6rem);
      }
    }
  }
  .move_dot{
        position: fixed;
        bottom: 30px;
        left: 30px;

        svg{
            @include wh(.9rem, .9rem);
            fill: #3190e8;
        }
    }

</style>
