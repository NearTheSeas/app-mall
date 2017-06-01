<template>
    <div class="paddingTop">
        <head-top head-title="购物车" goBack="true"></head-top>

        <section>
            <!-- <h4 class="title_restaurant">商家</h4> -->
            <ul class="list_container">
               <li v-for="(prod,foodindex) in cartProdList" :key="foodindex">
                    <section class="menu_detail_list">
                    <div class="menu_detail_link">
                        <section class="menu_food_img">
                         <router-link  :to="{path: 'category/prodDetail', query:{image_path:prod.image_path,  name: prod.name, rating: prod}}" tag="div" class="menu_detail_link">
                            <img :src="getImgPath(prod.img)">
                        </router-link>
                        </section>
                        <section class="menu_food_description">
                            <h3 class="food_description_head">
                                <strong class="description_foodname">{{prod.name}}</strong>
                            </h3>
                            <footer class="menu_detail_footer">
                                <section class="food_price">
                                    <span>¥</span>
                                    <span>{{prod.salePrice}}</span>
                                </section>
                                <buy-cart  :prod='prod' @moveInCart="listenInCart" @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buy-cart>
                            </footer>
                        </section>
                    </div>

                    </section>
                </li>
            </ul>
        </section>
        <section class="buy_cart_container">
                <section  class="cart_icon_num">
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
        <foot-guide></foot-guide>
    </div>
</template>

<script>
import headTop from '../../components/header/header'
import footGuide from '../../components/footer/footGuide'
import {imgBaseUrl} from '../../config/env'
import {getStore, setStore} from '../../config/mUtils'
import {mapState, mapMutations} from 'vuex'
import {loadMore, getImgPath} from '../../components/common/mixin'
import buyCart from '../../components/common/buyCart'

export default {
    data(){
        return {
            cartProdList: [], // 搜索返回的结果
            imgBaseUrl, // 图片域名地址
            emptyResult: false, // 搜索结果为空时显示
            showMoveDot: [], //控制下落的小圆点显示隐藏
            receiveInCart: false,
            totalPrice :0
        }
    },
    created(){
        this.INIT_BUYCART();
    },
    mounted(){

    },
    mixins: [loadMore, getImgPath],
    computed: {
        ...mapState([
            'cartList'
        ]),
        //当前购物信息
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
        },
    },
    components:{
        headTop,
        footGuide,
        buyCart
    },
    methods:{
         ...mapMutations([
            'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART'
        ]),
        //点击提交按钮，搜索结果并显示，同时将搜索内容存入历史记录
        //  this.emptyResult = !this.restaurantList.length;
        // }
        initCart(){
          let newArr = [];
            let cartProdNum = 0;
            let th = this;
            this.totalPrice = 0;
            this.cartProdList = [];

            let cart =this.shopCart
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
                  th.cartProdList[cartProdNum].img = cart[item].img;
                  cartProdNum ++;
                }
            })
            console.log(th.cartProdList)
            this.cartNum = num
            this.totalPrice = this.totalPrice.toFixed(2);
            this.categoryNum = [...newArr];
        },
        listenInCart(){
            if (!this.receiveInCart) {
                this.receiveInCart = true;
                this.$refs.cartContainer.addEventListener('animationend', () => {
                    this.receiveInCart = false;
                })
                this.$refs.cartContainer.addEventListener('webkitAnimationEnd', () => {
                    this.receiveInCart = false;
                })
            }
        },
        showMoveDotFun(showMoveDot, elLeft, elBottom){
            this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
            this.elLeft = elLeft;
            this.elBottom = elBottom;
        },
         showChooseList(foods){
            if (foods) {
                this.choosedFoods = foods;
            }
            this.showSpecs = !this.showSpecs;
            this.specsIndex = 0;
        },
         //显示提示，无法减去商品
        showReduceTip(){
            this.showDeleteTip = true;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                this.showDeleteTip = false;
            }, 3000);
        },
    },
    watch: {
        //showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作
        showLoading: function (value){
            if (!value) {
                this.$nextTick(() => {

                })
            }
        },
        shopCart: function (value){
            this.initCart();
        },
        //购物车列表发生变化
        cartProdList: function (value){
            if(!value.length){
                this.showCartList = false;
            }
        }
    }
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    .search_form{
        background-color: #fff;
        padding: 0.5rem;
        display: flex;
        input{
            height: 1.5rem;
        }
        .search_input{
            flex: 4;
            border: 0.025rem solid $bc;
            @include sc(0.65rem, #333);
            border-radius: 0.125rem;
            background-color: #f2f2f2;
            font-weight: bold;
            padding: 0 0.25rem;
        }
        .search_submit{
            flex: 1;
            border: 0.025rem solid $blue;
            margin-left: .2rem;
            @include sc(0.65rem, #fff);
            border-radius: 0.125rem;
            background-color: $blue;
            font-weight: bold;
            padding: 0 0.25rem;
        }
    }
    .title_restaurant{
        font-size: 0.6rem;
        line-height: 2rem;
        text-indent: 0.5rem;
        font-weight: bold;
        color: #666;
    }
    .list_container{
        background-color: #fff;
        padding-bottom:4rem;
        min-height: 100vh;
    }
    .list_li{
        display: flex;
        justify-content: 'center';
        padding: 0.5rem;
        border-bottom: 0.025rem solid $bc;
        .item_left{
            margin-right: 0.25rem;
            .restaurant_img{
                @include wh(1.7rem, 1.7rem);
            }
        }
        .item_right{
            font-size: 0.55rem;
            flex: 1;
            .item_right_text{
                padding-bottom: 0.25rem;
                border-bottom: 0.025rem solid $bc;
                p{
                    line-height: .9rem;
                }
                .pay_icon{
                    margin-bottom: -0.08rem;
                }
            }
            .item_right_detail{
                margin-top: 0.25rem;
                li{
                    font-size: 0;
                    span{
                        font-size: .5rem;
                        vertical-align: middle;
                        display: inline-block;
                        margin-bottom: 0.2rem;
                    }
                    .activities_icon{
                        @include sc(.5rem, #fff);
                        font-weight: bold;
                        padding: .04rem;
                        border-radius: 0.15rem;
                        margin-right: 0.125rem;
                    }
                    .only_phone{
                        color: #FF6000;
                    }
                }
            }
        }
    }
    .search_history{
        .history_list{
            background-color: #fff;
            border-bottom: 0.025rem solid $bc;
            @include font(0.7rem, 2rem);
            padding: 0 0.3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .history_text{
                display: inline-block;
                width: 80%;
            }
            .delete_icon{
                @include wh(1rem, 1rem);
            }
        }
        .clear_history{
            background-color: #fff;
            color: $blue;
            @include font(.7rem, 2rem);
            font-weight: bold;
            text-align: center;
        }
    }
    .search_none{
        margin: 0 auto;
        @include font(0.65rem, 1.75rem);
        color: #333;
        background-color: #fff;
        text-align: center;
        margin-top: 0.125rem;
    }
    .menu_detail_list{
        background-color: #fff;
        padding: .6rem .4rem;
        border-bottom: 1px solid #f8f8f8;
        position: relative;
        overflow: hidden;
        .menu_detail_link{
            display:flex;
            .menu_food_img{
                margin-right: .4rem;
                img{
                    @include wh(2rem, 2rem);
                    display: block;
                }
            }
            .menu_food_description{
                width: 100%;
                .food_description_head{
                    @include fj;
                    margin-bottom: .2rem;
                    .description_foodname{
                        @include sc(.7rem, #333);
                    }
                    .attributes_ul{
                        display: flex;
                        li{
                            font-size: .3rem;
                            height: .6rem;
                            line-height: .35rem;
                            padding: .1rem;
                            border: 1px solid #666;
                            border-radius: 0.3rem;
                            margin-right: .1rem;
                            transform: scale(.8);
                            p{
                                white-space: nowrap;
                                line-height: .4rem;
                            }
                        }
                        .attribute_new{
                            position: absolute;
                            top: 0;
                            left: 0;
                            background-color: #4cd964;
                            @include wh(2rem, 2rem);
                            display: flex;
                            align-items: flex-end;
                            transform: rotate(-45deg) translate(-.1rem, -1.5rem);
                            border: none;
                            border-radius: 0;
                            p{
                                @include sc(.4rem, #fff);
                                text-align: center;
                                flex: 1;
                            }
                        }
                    }
                }
                .food_description_content{
                    @include sc(.5rem, #999);
                    line-height: .6rem;
                }
                .food_description_sale_rating{
                    line-height: .8rem;
                    span{
                        @include sc(.5rem, #333);
                    }
                }
                .food_activity{
                    line-height: .4rem;
                    span{
                        font-size: .3rem;
                        border: 1px solid currentColor;
                        border-radius: 0.3rem;
                        padding: .08rem;
                        display: inline-block;
                        transform: scale(.8);
                        margin-left: -0.35rem;

                    }
                }
            }
        }
        .menu_detail_footer{
            padding:0 .2rem;
            font-size: 0;
            margin-top: .3rem;
            @include fj;
            .food_price{
                span{
                    font-family: 'Helvetica Neue',Tahoma,Arial;
                }
                span:nth-of-type(1){
                    @include sc(.5rem, #f60);
                    margin-right: .05rem;
                }
                span:nth-of-type(2){
                    @include sc(.7rem, #f60);
                    font-weight: bold;
                    margin-right: .3rem;
                }
                span:nth-of-type(3){
                    @include sc(.5rem, #666);
                }
            }
        }
    }
    .buy_cart_container{
        position: fixed;
        background-color: #3d3d3f;
        bottom: 1.95rem;
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
</style>
