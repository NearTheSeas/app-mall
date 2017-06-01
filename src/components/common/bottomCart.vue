<template>
  <section>
    <section class="buy_cart_container">
          <section @click="toggleCartList" class="cart_icon_num">
              <div class="cart_icon_container" :class="{cart_icon_activity: totalPrice > 0, move_in_cart:receiveInCart}" ref="cartContainer">
                  <span v-if="totalNum" class="cart_list_length">
                      {{totalNum}}
                  </span>
                  <svg class="cart_icon">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
                  </svg>
              </div>
              <div class="cart_num">
                  <div>¥ {{totalPrice}}</div>
              </div>
          </section>
          <section class="gotopay" :class="{gotopay_acitvity: totalNum > 0}">
              <span class="gotopay_button_style" v-if="totalNum <= 0">购物车为空</span>
              <router-link :to="{path:'/confirmOrder'}" class="gotopay_button_style" v-else >去结算</router-link>
          </section>
      </section>
      <transition name="toggle-cart">
        <section class="cart_food_list" v-show="showCartList&&cartProdList.length">
            <header>
                <h4>购物车</h4>
                <div @click="clearCart">
                    <svg>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
                    </svg>
                    <span class="clear_cart">清空</span>
                </div>
            </header>
            <section class="cart_food_details" id="cartFood">
                <ul>
                    <li v-for="(item, index) in cartProdList" :key="index" class="cart_food_li">
                        <div class="cart_list_num">
                            <p class="ellipsis">{{item.name}}</p>
                            <p class="ellipsis">{{item.unit}}</p>
                        </div>
                        <div class="cart_list_price">
                            <span>¥</span>
                            <span>{{item.salePrice || 0}}</span>
                        </div>
                        <section class="cart_list_control">
                            <span @click="removeOutCart(item.id)">
                                <svg>
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                                </svg>
                            </span>
                            <span class="cart_num">{{item.num}}</span>
                            <svg class="cart_add" @click="addToCart( item.id, item.name, item.salePrice, item.unit, item.img)">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                            </svg>
                        </section>
                    </li>
                </ul>
            </section>
        </section>
      </transition> 
      <transition name="fade">
          <div class="screen_cover" v-show="showCartList&&cartProdList.length" @click="toggleCartList"></div>
      </transition>
    </section>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import loading from '../../components/common/loading'
  import buyCart from '../../components/common/buyCart'

  export default {
    data(){
      return {
        // toggleCartList:false,
        totalPrice: 0,
        receiveInCart:false,
        cartProdList: [], 
        showCartList:false
      }
    },
    created(){
      this.INIT_BUYCART();
    },
    computed: {
      ...mapState([
          'cartList'
      ]),
      shopCart: function (){
        return {...this.cartList};
      },
      //购物车中总共商品的数量
      totalNum: function (){
        let num = 0;
        this.cartProdList.forEach(item => {
            if(item.num){
              num += item.num
            }
        })
        return num
      }        
    },
    components: {
        loading,
        buyCart,
    },
    methods: {
      ...mapMutations([
        'ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART'
      ]),
      initCategoryNum(){
          let newArr = [];
          let cartProdNum = 0;
          let th = this;
          let cart =this.shopCart
          this.totalPrice = 0;
          this.cartProdList = [];

          let num = 0

          Object.keys(cart).forEach(function(item,index){

              if(cart[item]['num'] > 0){
                num += cart[item]['num']
                th.totalPrice += cart[item]['num'] * cart[item]['salePrice'];
                th.cartProdList[cartProdNum] = {};
                th.cartProdList[cartProdNum].id = cart[item].id;

                th.cartProdList[cartProdNum].num = cart[item].num;
                th.cartProdList[cartProdNum].salePrice = cart[item].salePrice;
                th.cartProdList[cartProdNum].name = cart[item].name;
                th.cartProdList[cartProdNum].util = cart[item].util;
                cartProdNum ++;
              }
          })
          this.cartNum = num

          this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
          this.categoryNum = [...newArr];
      },
      addToCart(id, name, salePrice, unit, img){
        this.ADD_CART({id, name, salePrice, unit, img});
      },
      removeOutCart(id){
        this.REDUCE_CART({id});
      },
      toggleCartList(){
          this.cartProdList.length ? this.showCartList = !this.showCartList : true;
      },
      clearCart(){
          this.toggleCartList();
          this.CLEAR_CART();
      },
    },
    watch: {
      shopCart: function (value){
        this.initCategoryNum();
      }
    }
  }
</script>
<style lang="scss" scoped>
   @import '../../style/mixin';
    .buy_cart_container{
        position: fixed;
        background-color: #3d3d3f;
        bottom: 0;
        left: 0;
        z-index: 13;
        display: flex;
        @include wh(100%, 2rem);
        .cart_icon_num{
            flex: 1;
            .cart_icon_container{
                display: flex;
                background-color: #3d3d3f;
                position: absolute;
                padding: .4rem;
                border: 0.18rem solid #444;
                border-radius: 50%;
                left: .5rem;
                top: -.7rem;
                .cart_icon{
                    @include wh(1.2rem, 1.2rem);
                }
                .cart_list_length{
                    position: absolute;
                    top: -.25rem;
                    right: -.25rem;
                    background-color: #ff461d;
                    line-height: .7rem;
                    text-align: center;
                    border-radius: 50%;
                    border: 0.025rem solid #ff461d;
                    min-width: .7rem;
                    height: .7rem;
                    @include sc(.5rem, #fff);
                    font-family: Helvetica Neue,Tahoma,Arial;
                }
            }
            .move_in_cart{
                animation: mymove .5s ease-in-out;
            }
            .cart_icon_activity{
                 background-color: #3190e8;
            }
            .cart_num{
                @include ct;
                left: 3.5rem;

                div{
                    color: #fff;
                }
                div:nth-of-type(1){
                    font-size: .8rem;
                    font-weight: bold;
                    margin-bottom: .1rem;
                }
                div:nth-of-type(2){
                    font-size: .4rem;
                }
            }
        }
        .gotopay{
            position: absolute;
            right: 0;
            background-color: #535356;
            @include wh(5rem, 100%);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            .gotopay_button_style{
                @include sc(.7rem, #fff);
                font-weight: bold;
            }
        }
        .gotopay_acitvity{
            background-color: #4cd964;
        }
    }
    .cart_food_list{
      position: fixed;
      width: 100%;
      padding-bottom: 2rem;
      z-index: 12;
      bottom: 0;
      left: 0;
      background-color: #fff;
      header{
        @include fj;
        align-items: center;
        padding: .3rem .6rem;
        background-color: #eceff1;
        svg{
            @include wh(.6rem,.6rem);
            vertical-align: middle;
        }
        h4{
            @include sc(.7rem, #666);
        }
        .clear_cart{
            @include sc(.6rem, #666);
        }
      }
      .cart_food_details{
          background-color: #fff;
          max-height: 20rem;
          overflow-y: auto;
          .cart_food_li{
              @include fj;
              padding: .6rem .5rem;
              .cart_list_num{
                  width: 55%;
                  p:nth-of-type(1){
                      @include sc(.7rem, #666);
                      font-weight: bold;
                  }
                  p:nth-of-type(2){
                      @include sc(.4rem, #666);
                  }
              }
              .cart_list_price{
                  font-size: 0;
                  span:nth-of-type(1){
                      @include sc(.6rem, #f60);
                      font-family: Helvetica Neue,Tahoma;

                  }
                  span:nth-of-type(2){
                      @include sc(.7rem, #f60);
                      font-family: Helvetica Neue,Tahoma;
                      font-weight: bold;
                  }
              }
              .cart_list_control{
                  display: flex;
                  align-items: center;
                  span{
                      display: flex;
                      align-items: center;
                      justify-content: center;
                  }
                  svg{
                      @include wh(.9rem, .9rem);
                      fill: #3190e8;
                  }
                  .specs_reduce_icon{
                      fill: #999;
                  }
                  .cart_num{
                      @include sc(.65rem, #666);
                      min-width: 1rem;
                      text-align: center;
                      font-family: Helvetica Neue,Tahoma;
                  }
              }
          }
      }
    }
    .screen_cover{
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0,0,0,.3);
          z-index: 11;
       }
       .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    .toggle-cart-enter-active, .toggle-cart-leave-active {
        transition: all .3s ease-out;
    }
    .toggle-cart-enter, .toggle-cart-leave-active {
        transform: translateY(100%);
    }
</style>