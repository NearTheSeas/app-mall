<template>
    <div class="confirmOrderContainer">
        <section v-if="!showLoading">
            <head-top head-title="确认订单" goBack="true" signin-up='confirmOrder'></head-top>
            <!--地址栏-->
            <router-link :to='{path: "/chooseAddress", query: {}}' class="address_container">
                <div class="address_empty_left">
                    <svg class="location_icon">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
                    </svg>
                    <div class="add_address" v-if="!choosedAddress">请添加一个收获地址</div>
                    <div v-else class="address_detail_container">
                        <header>
                            <span>{{choosedAddress.linkName}}</span>
                            <span>{{choosedAddress.phone}}</span>
                        </header>
                        <div class="address_detail">
                            <p>{{choosedAddress.address}}</p>
                        </div>
                    </div>
                </div>
                <svg class="address_empty_right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
            </router-link>
            <!--支付部分-->
            <section class="pay_way container_style">
                <header class="header_style">
                    <span>支付方式</span>
                    <div class="more_type" @click="showPayWayFun">
                        <span>{{payWay.name}}</span>
                        <svg class="address_empty_right">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                        </svg>
                    </div>
                </header>
            </section>
            <!--产品列表-->
            <section class="food_list">
                <ul class="food_list_ul">
                    <li v-for="item in orderDetail" :key="item.id" class="food_item_style">
                        <p class="food_name ellipsis">{{item.name}}</p>
                        <div class="num_price">
                            <span>x {{item.num}}</span>
                            <span>¥{{item.salePrice}}</span>
                        </div>
                    </li>
                </ul>
                <div class="food_item_style total_price">
                    <p class="food_name ellipsis">订单 ¥{{totalPrice | fixNum}}</p>
                    <div class="num_price">
                        <span>待支付 ¥{{totalPrice | fixNum}}</span>
                    </div>
                </div>
            </section>
            <!--备注-->
            <section class="pay_way container_style">
                <router-link :to='{path: "/confirmOrder/remark", query: {}}' class="header_style">
                    <span>订单备注</span>
                    <div class="more_type">
                        <span class="ellipsis">{{inputText}}</span>
                        <svg class="address_empty_right">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                        </svg>
                    </div>
                </router-link>
            </section>
            <!-- 无法下单产品 -->
            <section class="food_list" v-if="unableSubmit.length >0 ">
                <ul class="food_list_ul">
                    <li v-for="item in unableSubmit" :key="item.id" class="food_item_style">
                        <p class="food_name ellipsis red">{{item.name}}</p>
                        <div class="num_price">
                            <span></span>
                            <span class='red'>{{item.msg}}</span>
                        </div>
                    </li>
                </ul>
            </section>
            <!--支付-->
            <transition name="fade">
                <div class="cover" v-if="showPayWay" @click="showPayWayFun"></div>
            </transition>
            <transition name="slid_up">
                <div class="choose_type_Container" v-if="showPayWay">
                    <header>支付方式</header>
                    <ul>
                        <li v-for="item in payTypes" :key="item.id" :class="{choose: payWay.value == item.value}">
                            <span>{{item.name}}<span v-if="!item.is_online_payment">{{item.description}}</span></span>
                            <svg class="address_empty_right" @click="choosePayWay(item)">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                            </svg>
                        </li>
                    </ul>
                </div>
            </transition>
            <section class="confrim_order">
                <p>待支付 ¥{{totalPrice  | fixNum}}</p>
                <p @click="confrimOrder">确认下单</p>
            </section>
        </section>
        <loading v-if="showLoading"></loading>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'
    import headTop from '../../components/header/header'
    import alertTip from '../../components/common/alertTip'
    import loading from '../../components/common/loading'
    import {submitOrder, validateOrder, checkout, getAddress, placeOrders} from '../../service/getData'

    export default {
        data(){
            return {
                totalPrice:0, // 总价
                showLoading: true, //显示加载动画
                payTypes:[{id:1, name:'微信',value:'WEIXIN'},{id:2, name:'支付宝',value:'ALIPAY'} , {id:3, name:'货到付款',value:'COD'} ], // 支付方式
                payWay: {id:1, name:'微信',value:'WEIXIN'}, //付款方式
                orderDetail: null,//数据返回值
                unableSubmit:[], // 库存不足产品
                showPayWay: false,//显示付款方式
                showAlert: false, //弹出框
                alertText: null, //弹出框内容
                preventRepeat: false
            }
        },
        created(){
            //获取当前商铺购物车信息
            this.initData();
        },
         filters: {
            fixNum: function (value) {
              return value.toFixed(2)
            }
        },
        mounted(){
          
        },
        components: {
            headTop,
            alertTip,
            loading
        },
        computed: {
            ...mapState([
                'cartList', 'remarkText', 'inputText',  'choosedAddress',
            ])
        },
        methods: {
            ...mapMutations([
                 'ADD_CART', 'CHOOSE_ADDRESS', 'CLEAR_CART'
            ]),
            //初始化数据
            initData(){
                let newArr = new Array;
                let cartProdNum = 0;
                var th = this;
                let cart = this.cartList
                Object.keys(cart).forEach(function(item){
                    if(cart[item].num> 0){
                        th.totalPrice += cart[item]['num'] * cart[item]['salePrice'];
                        newArr.push({
                            id: cart[item].id,
                            name: cart[item].name,
                            salePrice: cart[item].salePrice,
                            num: cart[item].num,
                            unit: cart[item].unit,
                            img: cart[item].img
                        })
                    }
                })

                if(!this.choosedAddress){
                    this.initAddress();
                }

                //检验订单是否满足条件
                validateOrder({ "items": newArr}).then(res=>{
                    if(res.data.code == '000'){
                        th.orderDetail = newArr;
                    }else{
                        // [{id:0, msg:'库存不足'}]
                        // console.log(res.data)
                        let tmp = res.data.data
                        th.totalPrice = 0
                       
                        tmp.forEach(function(obj){
                            delItem(newArr, obj)
                        })

                        function delItem(arr, obj){
                            arr.forEach(function(item,key){
                                // console.log(newArr)
                                if(item.id === obj.id){
                                    item.msg = obj.msg
                                    console.log(item)
                                    th.unableSubmit.push(item)
                                    newArr.splice( key , 1)
                                }else{
                                    th.totalPrice += item['num'] * item['salePrice'];
                                }
                            })
                        }
                        th.orderDetail = newArr;
                    }
                })
                this.showLoading = false;
            },
            //获取地址信息，第一个地址为默认选择地址
            initAddress(){
                var th = this
                getAddress().then(res=>{
                   if ( res.data.data instanceof Array) {
                       res.data.data.forEach(function(item,index){
                            if(item.isDefault){
                                th.CHOOSE_ADDRESS({address: item, index});
                            }
                       })
                    }
                })
            },
            //显示付款方式
            showPayWayFun(){
                this.showPayWay = !this.showPayWay;
            },
            //选择付款方式
            choosePayWay( item){
                this.showPayWay = !this.showPayWay;
                this.payWay = item;
            },
            //确认订单
            confrimOrder(){
             
                if(this.preventRepeat){
                    return 
                }
                this.preventRepeat = true
                var th = this
                let data = {
                  "linkId":this.choosedAddress.linkId,
                  "payType":this.payWay.value,
                  "remark":this.inputText,
                  "items": this.orderDetail
                }
                if(this.orderDetail.length <=0 ){
                    th.showAlert = true;
                    th.alertText = '抱歉，无法下单';
                    return
                }
                submitOrder(data).then(res=>{
                   
                    if(res.data.code === '000'){
                        th.showAlert = true;
                        th.alertText = '下单成功';
                        th.CLEAR_CART();
                        th.unableSubmit.forEach(function(item){
                            th.ADD_CART({ ...item})
                        })
                        setTimeout(function(){
                            th.$router.push({path:'/home'})
                        }, 1500)
                    }else{
                        th.showAlert = true;
                        th.alertText = '下单失败';
                        th.preventRepeat = false;
                    }
                })
            },
        },
        watch: {
           
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .confirmOrderContainer{
        padding-top: 1.95rem;
        padding-bottom: 3rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .container_style{
        background-color: #fff;
        margin-top: .4rem;
        padding: 0 .7rem;
    }
    .address_container{
        min-height: 3.5rem;
        @include fj;
        align-items: center;
        padding: 0 0.6rem;
        background: url(../../images/address_bottom.png) left bottom repeat-x;
        background-color: #fff;
        background-size: auto .12rem;
        .address_empty_left{
            display: flex;
            align-items: center;
            .location_icon{
                @include wh(.8rem, .8rem);
                fill: $blue;
                margin-right: .2rem;
            }
            .add_address{
                @include sc(.7rem, #333);
            }
            .address_detail_container{
                margin-left: .2rem;
                header{
                    @include sc(.65rem, #333);
                    span:nth-of-type(1){
                        font-size: .8rem;
                        font-weight: bold;
                    }
                }
                .address_detail{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    span{
                        @include sc(.5rem, #fff);
                        border-radius: .15rem;
                        background-color: #ff5722;
                        height: .6rem;
                        line-height: .6rem;
                        padding: 0 .2rem;
                        margin-right: .3rem;
                    }
                    p{
                        @include sc(.55rem, #777);
                    }
                }
            }
        }
    }
    .address_empty_right{
        @include wh(.6rem, .6rem);
        fill: #999;
    }
    .delivery_model{
        border-left: .2rem solid $blue;
        min-height: 4rem;
        @include fj;
        align-items: center;
        .deliver_text{
            @include sc(.8rem, #333);
            font-weight: bold;
            padding-left: .3rem;
        }
        .deliver_time{
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            p:nth-of-type(1){
                @include sc(.7rem, $blue);
            }
            p:nth-of-type(2){
                @include sc(.5rem, #fff);
                background-color: $blue;
                width: 2.4rem;
                margin-top: .5rem;
                text-align: center;
                border-radius: 0.12rem;
                padding: .1rem;
            }
        }
    }
    .pay_way{
        .header_style{
            @include fj;
            line-height: 2rem;
            span:nth-of-type(1){
                @include sc(.7rem, #666);
            }
            .more_type{
                span:nth-of-type(1){
                    @include sc(.6rem, #aaa);
                    width: 10rem;
                    display: inline-block;
                    text-align: right;
                    vertical-align: middle;
                }
                svg{
                    @include wh(.5rem, .5rem);
                    fill: #ccc;
                }
            }
        }
        .hongbo{
            @include fj;
            border-top: 0.025rem solid #f5f5f5;
            span{
                @include sc(.6rem, #aaa);
                line-height: 2rem;
                svg{
                    @include wh(.5rem, .5rem);
                    vertical-align: middle;
                    fill: #ccc;
                }
            }
            span:nth-of-type(2){
                color: #aaa;
            }
        }
        .support_is_available{
            span{
                color: #666;
            }
        }
    }
    .food_list{
        background-color: #fff;
        margin-top: .4rem;
        header{
            padding: .7rem;
            border-bottom: 0.025rem solid #f5f5f5;
            img{
                @include wh(1.2rem, 1.2rem);
                vertical-align: middle;
            }
            span{
                @include sc(.8rem, #333);
            }
        }
        .food_list_ul{
            padding-top: .5rem;
        }
        .food_item_style{
            @include fj;
            line-height: 1.8rem;
            padding: 0 .7rem;
            .red {
                color:red;
            }
            span,p{
                @include sc(.65rem, #666);
            }
            .food_name{
                width: 11rem;
            }
            .num_price{
                flex: 1;
                @include fj;
                align-items: center;
                span:nth-of-type(1){
                    color: #f60;
                }
            }
        }
        .total_price{
            border-top: 0.025rem solid #f5f5f5;
        }
    }
    .confrim_order{
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2rem;
        p{
            line-height: 2rem;
            @include sc(.75rem, #fff);
        }
        p:nth-of-type(1){
            background-color: #3c3c3c;
            flex: 5;
            padding-left: .7rem;
        }
        p:nth-of-type(2){
            flex: 2;
            background-color: #56d176;
            text-align: center;
        }
    }
    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0,0,0,.3);
        z-index: 203;
    }
    .choose_type_Container{
        min-height: 10rem;
        background-color: #fff;
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 204;
        header{
            background-color: #fafafa;
            @include sc(.7rem, #333);
            text-align: center;
            line-height: 2rem;
        }
        ul{
            li{
                @include fj;
                padding: 0 .7rem;
                line-height: 2.5rem;
                align-items: center;
                span{
                    @include sc(.7rem, #ccc);
                }
                svg{
                    @include wh(.8rem, .8rem);
                    fill: #eee;
                }
            }
            .choose{
                span{
                    color: #333;
                }
                svg{
                    fill: #4cd964;
                }
            }
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    .slid_up-enter-active, .slid_up-leave-active {
        transition: all .3s;
    }
    .slid_up-enter, .slid_up-leave-active {
        transform: translate3d(0,10rem,0)
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
