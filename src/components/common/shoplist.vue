<template>
	<div class="shoplist_container">
		<ul  v-if="shopListArr.length" type="1" class="shop_ul">
			<!--遍历主推品-->
      <li class="shop_li" v-for="item in shopListArr" tag='li' :key="item.id">
				<!--跳转产品详情-->
      	<router-link :to="{path: '/prodDetail', query:{ prod:item}}" >
           <section>
            <img :src="getImgPath(item.img)" class="shop_img">
          </section>
        </router-link>
        <hgroup class="shop_right">
          <header class="shop_detail_header">
            <h4 class="shop_title ellipsis">{{item.name}}</h4>
          </header>
          <h5 class="prod_price_num">
            <section class="prod_price_num_left">
              <section class="price_section">
                <span class="price_num">￥{{item.salePrice}}</span>
              </section>
            </section>
            <section class="prod_price_num_right" >
              <span class="delivery_style delivery_right" @click="addToCart( item.id, item.name, item.salePrice, item.unit,  item.img, $event)">
                <svg width="100%" height="100%">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
                </svg>
              </span>
            </section>
          </h5>
        </hgroup>
      </li>
		</ul>
		<aside class="return_top" @click="backTop" v-if="showBackStatus">
			<svg class="back_top_svg">
				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
			</svg>
		</aside>
		<div ref="abc" style="background-color: red;"></div>
		<transition name="loading">
			<loading v-show="showLoading"></loading>
		</transition>
	</div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import {loginData, hotSales} from '../../service/getData'
import {showBack, animate} from '../../config/mUtils'
import {loadMore, getImgPath} from './mixin'
import loading from './loading'

export default {
	data(){
		return {
			shopListArr:[], // 店铺列表数据
			showBackStatus: false, //显示返回顶部按钮
			showLoading: true, //显示加载动画
      showMoveDot: [true], //控制下落的小圆点显示隐藏
		}
	},
	mounted(){
		// if(loginData){
			this.initData();
		// }
	},
	components: {
		loading
	},
	props: [
		
  ],
	mixins: [loadMore, getImgPath],
	computed: {
	
	},
	methods: {
    ...mapMutations([
        'ADD_CART','REDUCE_CART',
    ]),
		initData(){
			//获取数据
			hotSales().then((res)=>{
        // console.log(res);
        this.shopListArr = [...res.data.data];
        this.hideLoading();
      }).catch((thrown) =>{
        console.log('shoplist get data error')
				this.hideLoading();
      });
			
			//开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
			showBack(status => {
				this.showBackStatus = status;
			});
		},
	
		//返回顶部
		backTop(){
			animate(document.body, {scrollTop: '0'}, 400,'ease-out');
		},
	
		//开发环境与编译环境loading隐藏方式不同
		hideLoading(){
			if (process.env.NODE_ENV !== 'development') {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					clearTimeout(this.timer);
					this.showLoading = false;
				}, 500)
			}else{
				this.showLoading = false;
			}
		},
    //加入购物车，计算按钮位置。
    addToCart( id, name, salePrice, unit,  img, event){
        this.ADD_CART({ id, name, salePrice, unit, img});
        let elLeft = event.target.getBoundingClientRect().left;
        let elBottom = event.target.getBoundingClientRect().bottom;
        // this.showMoveDot.push(true);
				console.log(this.showMoveDot)
        this.$emit('showMoveDotEvent', this.showMoveDot, elLeft, elBottom);
    }
	},
	watch: {

		//监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
		// confirmSelect: function (value){
		// 	this.listenPropChange();
		// 	this.$emit('DidConfrim');
		// }
	}
}
</script>
<style lang="scss" scoped>
	@import 'src/style/mixin';
	.shoplist_container{
		background-color: #fff;
		padding-bottom: 2rem;
	}
  .shop_ul{
    overflow:hidden;
  }
	.shop_li{
    float: left;
		width: 50%;
		border-bottom: 0.025rem solid #f1f1f1;
		padding: 0.5rem 0.4rem;
    > a > section{
      text-align:center;
      padding-bottom:.25rem;
    }
	}
	.shop_img{
		@include wh(6rem, 6rem);
		vertical-align:middle;
		margin-bottom: 0.4rem;
	}
	.shop_right{
		flex: auto;
		.shop_detail_header{
			@include fj;
			align-items: center;
			.shop_title{
				width: 8.5rem;
				color: #333;
				padding-top: .01rem;
				@include font(0.6rem, 0.6rem, 'PingFangSC-Regular');
				font-weight: 700;
			}
			.premium::before{
				content: '新品';
        color:#fff;
				display: inline-block;
				font-size: 0.4rem;
				line-height: .6rem;
				background-color: $blue;
				padding: 0 0.1rem;
				border-radius: 0.1rem;
				margin-right: 0.2rem;
				vertical-align: top;
			}
			.shop_detail_ul{
				display: flex;
				.supports{
					@include sc(0.5rem, #999);
					border: 0.025rem solid #f1f1f1;
					padding: 0.04rem;
					border-radius: 0.08rem;
					margin-left: 0.05rem;
				}
			}
		}
		.prod_price_num{
			@include fj(space-between);
			margin-top: 0.52rem;
			.prod_price_num_left{
				@include fj(flex-start);
				.price_section{
					display: flex;
					.price_num{
						@include sc(0.6rem, #ff6000);
						margin: 0 ;
            height: 1rem;
            line-height: 1rem;
					}
				}
				.order_section{
						@include sc(0.6rem, #666);
				}
			}
			.prod_price_num_right{
				display: flex;
				align-items: center;
				.delivery_style{
					font-size: 0.6rem;
					padding: 0.04rem 0.08rem 0;
					border-radius: 0.08rem;
					margin-left: 0.08rem;
					border: 1px;
				}
				.delivery_left{
					color: #fff;
					background-color: $blue;
					border: 0.025rem solid $blue;
				}
				.delivery_right{
					color: $blue;
          @include wh(1rem,1rem);
          svg{
            fill:$blue;
          }
					// border: 0.025rem solid $blue;
				}
			}
		}

	}
	.loader_more{
		@include font(0.6rem, 3);
		text-align: center;
	    color: #999;
	}
	.empty_data{
		@include sc(0.5rem, #666);
		text-align: center;
		line-height: 2rem;
	}
	.return_top{
		position: fixed;
		bottom: 3rem;
		right: 1rem;
		.back_top_svg{
			@include wh(2rem, 2rem);
		}
	}
	.loading-enter-active, .loading-leave-active {
		transition: opacity 1s
	}
	.loading-enter, .loading-leave-active {
		opacity: 0
	}
</style>
