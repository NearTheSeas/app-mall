 <template>
    <div class="order_page">
        <head-top head-title="订单列表" go-back='true'></head-top>
        <ul class="order_list_ul" v-load-more="loaderMore" v-if="orderList" type="1">
            <li class="order_list_li" v-for="item in orderList" :key="item.id">
                <!-- <img :src="item.restaurant_image_url" class="restaurant_image"> -->
                <section class="order_item_right">
                    <section @click="showDetail(item)">
                        <header class="order_item_right_header">
                            <section class="order_header">
                                <h4 >
                                    <span class="ellipsis">{{item.linkName}} </span>
                                  <!--   <svg fill="#333" class="arrow_right">
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                                    </svg> -->
                                </h4>
                                <!-- <p class="order_time">{{item.createTime | getDate}}</p> -->
                                <p class="order_time">{{item.createTime | getDate}}</p>
                            </section>
                            <p class="order_status">
                                {{item.orderState}}
                            </p>
                            <!--<span class="ellipsis" v-for="prod in item.saleOrderItemList">{{prod.productsName}}</span>-->
                        </header>
                        <section class="order_basket">
                            <p class="order_name ellipsis">{{item.saleOrderItemList[0].productsName}}{{item.saleOrderItemList.length > 1 ? ' 等' + item.saleOrderItemList.length + '件商品' : ''}}</p> 
                            <p class="order_amount">总价：¥{{item.totalAmount.toFixed(2)}}</p>
                            <div class="order_again">
                            <!-- <compute-time v-if="!item.payTime " :time="item.createTime"></compute-time> -->
                            <!--<router-link  :to="{path: 'orderDetail', query: { id: item.id}}" tag="span" class="buy_again" >订单详情</router-link>-->
                            <!-- <router-link  :to="{path: '/shop', query: { id: item.id}}" tag="span" class="buy_again" v-else>去结算</router-link> -->
                        </div>
                        </section>
                    </section>
                </section>
            </li>
        </ul>
        <p v-else class="empty_data">没有更多了</p>
        <foot-guide></foot-guide>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
        <footer class="loader_more" v-show="preventRepeat">正在加载更多商品...</footer>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import headTop from '../../components/header/header'
    import computeTime from '../../components/common/computeTime'
    import loading from '../../components/common/loading'
    import {loadMore} from '../../components/common/mixin'
    import footGuide from '../../components/footer/footGuide'
    import {getOrderList, loginData} from '../../service/getData'


    export default {
      data(){
            return{
                orderList: null, //订单列表
                pageNo: 1,
                preventRepeat: false,  //防止重复获取
                showLoading: true, //显示加载动画
            }
        },
        mounted(){
            this.initData();
        },
        mixins: [loadMore],
        components: {
            headTop,
            footGuide,
            loading,
            computeTime,
        },
        computed: {
            userInfo(){
              return loginData
            }
        },
        filters: {
            getDate: function (value) {
              if (!value) return ''
              var d = new Date(value)
              return d.getFullYear() + '-' + (d.getMonth() + 1)+ '-' + d.getDate()
            }
        },
        methods: {
             ...mapMutations([
               'SAVE_ORDER'
            ]),
            //初始化获取信息
            initData(){
                // if (loginData && loginData.customerName) {
                getOrderList(this.pageNo).then(res=>{
                  console.log(res.data.data.rows)
                  this.orderList = [...res.data.data.rows];
                  this.hideLoading();
                })
                // }
            },
            //加载更多
            loaderMore(){
                if (this.preventRepeat) {
                    return
                }
                this.preventRepeat = true;
                this.showLoading = true;
                this.pageNo += 1;
                //获取信息
                getOrderList(this.pageNo).then(res=>{
                  this.orderList = [...this.orderList, ...res.data.data.rows];
                  this.hideLoading();
                  if (res.data.data.rows.length < 10) {
                      return
                  }
                })
                this.preventRepeat = false;
            },
            //显示详情页
            showDetail(item){
                // this.SAVE_ORDER(item);
                this.preventRepeat = false;
                // this.$router.push('/order/orderDetail',params:{id:item.id});
                this.$router.push({ path: '/order/orderDetail', query: { id:item.id}});

            },
            //生产环境与发布环境隐藏loading方式不同
            hideLoading(){
                if (process.env.NODE_ENV !== 'development') {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        clearTimeout(this.timer);
                        this.showLoading = false;
                    }, 400)
                }else{
                    this.showLoading = false;
                }
            },
        },
        watch: {
            userInfo: function (value) {
                if (value && value.customerName) {
                    this.initData();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .order_page{
        background-color: #f1f1f1;
        padding-bottom: 1.95rem;
        p, span, h4{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .order_list_ul{

        padding-top: 1.95rem;
        .order_list_li{
            background-color: #fff;
            display: flex;
            margin-bottom: 0.5rem;
            padding: .6rem .6rem 0;
            .restaurant_image{
                @include wh(2rem, 2rem);
                margin-right: 0.4rem;
            }
            .order_item_right{
                flex: 5;
                .order_item_right_header{
                    border-bottom: 0.025rem solid #f5f5f5;
                    padding-bottom: .3rem;
                    @include fj;
                    .order_header{
                        h4{
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            @include sc(.75rem, #333);
                            line-height: 1rem;
                            width: 9rem;

                            .arrow_right{
                                @include wh(.4rem, .4rem);
                                fill: #ccc;
                                margin-right: .2rem;
                            }
                        }
                        .order_time{
                            @include sc(.55rem, #999);
                            line-height: .8rem;
                        }
                    }
                    .order_status{
                        @include sc(.6rem, #333);
                    }
                }
                .order_basket{
                    @include fj;
                    line-height: 2rem;
                    border-bottom: 0.025rem solid #f5f5f5;
                    .order_name{
                        @include sc(.6rem, #666);
                        width: 10rem;
                    }
                    .order_amount{
                        @include sc(.6rem, #f60);
                        font-weight: bold;
                    }
                }
                .order_again{
                    text-align: right;
                    line-height: 1.6rem;
                    .buy_again{
                        @include sc(.55rem, #3190e8);
                        border: 0.025rem solid #3190e8;
                        padding: .1rem .2rem;
                        border-radius: .15rem;
                    }
                }
            }
        }
    }
    .loading-enter-active, .loading-leave-active {
        transition: opacity .7s
    }
    .loading-enter, .loading-leave-active {
        opacity: 0
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
