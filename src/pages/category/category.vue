 <template>
    <div>
        <section v-if="!showLoading" class="shop_container">
            <!--头部-->
            <header class="shop_detail_header" ref="shopheader" :style="{zIndex: '10'}">
              <section class="description_left">
                  <form class="search_form">
                      <section class="head_goback"  @click="$router.go(-1)">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
                             <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#goback"></use>
                        </svg>
                      </section>
                      <router-link :to="'/search'" tag="div" style="display:flex;width:100%">
                        <input type="search" name="search" placeholder="请输入商品名称" class="search_input" >
                        <input type="submit" name="submit" class="search_submit" >
                     </router-link>
                  </form>
              </section>
            </header>
            <!--一级分类-->
            <section class="change_show_type" ref="chooseType">
              <div class="category_wrapper" id="category_level_one" ref="category_wrapper">
                <ul class="category_first" ref="levelOne" id="levelone">
                  <li v-for="(item,index) in categoryList" :key="index" class="menu_left_li" :class="{activity_menu: item.id == selectLevelOne}" @click="chooseMenuOne(item.id)">
                     {{item.categoryName}}
                  </li>
                </ul>
              </div>
            </section>
            <transition name="fade-choose">
                <section  class="food_container">
                    <section class="menu_container">
                        <!--二级分类-->
                        <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
                            <ul>
                                <li v-for="(item,index) in secondLevel" :key="index" class="menu_left_li" :class="{activity_menu: item.id == selectLevelTwo}" @click="chooseMenu(item.id)">
                                    <span>{{item.categoryName}}</span>
                                </li>
                            </ul>
                        </section>
                        <!--产品列表-->
                        <section class="menu_right" ref="menuFoodList">
                            <ul>
                                <li v-for="(prod,foodindex) in prodsShow" :key="foodindex">
                                    <section class="menu_detail_list">
                                        <!--点击跳转到商品详情页-->
                                        <router-link  :to="{path: '/prodDetail', query:{ prod }}" tag="div" class="menu_detail_link">
                                            <section class="menu_food_img">
                                                <img :src="getImgPath(prod.img)">
                                            </section>
                                            <section class="menu_food_description">
                                                <h3 class="food_description_head">
                                                    <strong class="description_foodname">{{prod.name}}</strong>
                                                </h3>
                                                <p class="food_description_content">规格：{{prod.specification}}</p>
                                                <!--<p class="food_description_content">单位：{{prod.unit}}</p>-->
                                            </section>
                                        </router-link>
                                        <footer class="menu_detail_footer">
                                            <!--价格-->
                                            <section class="food_price">
                                                <span>¥</span>
                                                <span>{{prod.salePrice}}</span>
                                            </section>
                                            <!--购买按钮-->
                                            <buy-cart  :prod='prod' @moveInCart="listenInCart"  @showMoveDot="showMoveDotFun"></buy-cart>
                                        </footer>
                                    </section>
                                </li>
                            </ul>
                        </section>
                    </section>
                    <!--底部购物车-->
                    <bottom-cart></bottom-cart>
                </section>
            </transition>
        </section>
        <transition appear @after-appear = 'afterEnter' @before-appear="beforeEnter" v-for="(item,index) in showMoveDot" :key="index">
            <span class="move_dot" v-if="item">
                <svg class="move_liner">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                </svg>
            </span>
        </transition>
       <loading v-show="showLoading"></loading>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import {prodCategory, getProdByCategory} from '../../service/getData'
    import loading from '../../components/common/loading'
    import buyCart from '../../components/common/buyCart'
    import bottomCart from '../../components/common/bottomCart'
   
    import {loadMore, getImgPath} from '../../components/common/mixin'
    import BScroll from 'better-scroll'

    export default {
        data(){
            return{
                selectLevelOne:null, // 被选中的一级分类
                selectLevelTwo:null, // 被选中的二级分类
                categoryList:[], // 全部产品分类
                secondLevel:[], // 要展示的二级分类
                prodsShow:[], // 要展示的商品
                categoryLevelOne:null, // 一级分类的 scroll对象
                ulwidth:0, // 设置宽度 否则菜单无法滑动
                showLoading: true, //显示加载动画
                receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
                
                prodScroll: null,  //商品列表scroll
                showMoveDot: [], //控制下落的小圆点显示隐藏
                windowHeight: null, //屏幕的高度
                elLeft: 0, //当前点击加按钮在网页中的绝对top值
                elBottom: 0, //当前点击加按钮在网页中的绝对left值
                wrapperMenu: null,
            }
        },
        created(){
            this.INIT_BUYCART();
            this.initData();
        },
        mounted(){
            var th =this
            this.windowHeight = window.innerHeight;
            // setTimeout(function(){
            //     th.setWidth()
            // },1000)
        },
        mixins: [loadMore, getImgPath],
        components: {
            loading,
            buyCart,
            bottomCart
        },
        computed: {
            ...mapState([
                'cartList'
            ]),
            //当前商店购物信息
            shopCart: function (){
                return {...this.cartList};
            }
        },
        methods: {
            ...mapMutations([
               'ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART'
            ]),
            //初始化时获取基本数据
            initData(){
              let th =this
              prodCategory().then(function(res){
                if(!res.data){
                  return
                }
                th.categoryList = res.data.data
                th.selectLevelOne = th.categoryList[0].id
                th.secondLevel = res.data.data[0].children
                th.selectLevelTwo = th.secondLevel[0].id
                return getProdByCategory(th.selectLevelTwo)
              }).then(function(result){
                
                th.prodsShow = result.data.data
             
              }).then(()=>{
                  th.hideLoading();
              })
              //隐藏加载动画
            //   this.hideLoading();
            },
            setWidth(){
                
                let ulWidth = 0;
                
                var arr = this.$refs.levelOne.querySelectorAll('li');
                for(var i = 0;i<arr.length;i++){
                    ulWidth += arr[i].clientWidth;
                }
                this.$refs.levelOne.style.width = ulWidth + 5 + 'px'
                
            },
            //当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
            listenScroll(){
              
                let oldScrollTop;
                let requestFram;

                const listContainer = this.$refs.menuFoodList;
                this.prodScroll = new BScroll(listContainer, {
                    probeType: 3,
                    deceleration: 0.001,
                    bounce: false,
                    swipeTime: 2000,
                    click: true,
                });

                this.wrapperMenu = new BScroll('#wrapper_menu', {
                    click: true,
                });

                this.categoryLevelOne = new BScroll('#category_level_one', {
                    click: true,
                    scrollX: true,
                    scrollY:false,
                    probeType: 3,
                    deceleration: 0.001,
                    bounce: false,
                    swipeTime: 2000,
                });
            },
            // 点击一级菜单
            chooseMenuOne(id){
              this.selectLevelOne = id;
              function selectCategory(item){
                  return item.id == id;
            }
            //  设置一级分类下的第一个二级分类为展示项
              this.secondLevel = this.categoryList.filter(selectCategory)[0].children;
              this.selectLevelTwo = this.secondLevel && this.secondLevel[0].id
              this.chooseMenu(this.selectLevelTwo)
            },
            // 点击二级分类
            chooseMenu(id){
              this.selectLevelTwo = id
              let th = this
              getProdByCategory(id).then(function(result){
                th.prodsShow = result.data.data
              })
            },
            //隐藏动画
            hideLoading(){
                if (process.env.NODE_ENV !== 'development') {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        clearTimeout(this.timer)
                        this.showLoading = false
                    }, 600)
                }else{
                    this.showLoading = false
                }
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
                el.children[0].style.transform = `translate3d(0,0,0)`;
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
                if (!this.receiveInCart) {
                    this.receiveInCart = true;
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
            showLoading:function(value){
                if(!value){
                    this.$nextTick(() => {
                        this.setWidth()
                        this.listenScroll()
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    @keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    @-moz-keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    @-webkit-keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    @-o-keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    .head_goback{
        left: 0.4rem;
        @include wh(0.8rem, 1rem);
        line-height: 1.8rem;
        margin: 0 .4rem;
        svg{
          fill:$blue;
        }
    }
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
    .shop_container{
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 0;
        left: 0;
        height: 100%;
    }

    .shop_detail_header{
        overflow: hidden;
        position: relative;
        .header_cover_img{
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9;
            filter: blur(10px);
        }
        .description_header{
            position: relative;
            z-index: 10;
            background-color: rgba(119,103,137,.43);
            padding: 0.4rem 0 0.4rem 0.4rem;
            width: 100%;
            overflow: hidden;
            .description_top{
                display: flex;
                .description_left{
                    margin-right: 0.3rem;
                    img{
                        @include wh(2.9rem, 2.9rem);
                        display: block;
                        border-radius: 0.15rem;
                    }
                }
                .description_right{
                    flex: 1;
                    .description_title{
                        @include sc(.8rem, #fff);
                        font-weight: bold;
                        width: 100%;
                        margin-bottom: 0.3rem;
                    }
                    .description_text{
                        @include sc(.5rem, #fff);
                        margin-bottom: 0.3rem;
                    }
                    .description_promotion{
                        @include sc(.5rem, #fff);
                        width: 11.5rem;
                    }
                }
                .description_arrow{
                    @include ct;
                    right: 0.3rem;
                    z-index: 11;
                }
            }
            .description_footer{
                @include fj;
                margin-top: 0.5rem;
                padding-right: 1rem;
                p{
                    @include sc(.5rem, #fff);
                    span{
                        color: #fff;
                    }
                    .tip_icon{
                        padding: 0 .04rem;
                        border: 0.025rem solid #fff;
                        border-radius: 0.1rem;
                        font-size: .4rem;
                        display: inline-block;
                    }
                }
                .ellipsis{
                    width: 84%;
                }
                .footer_arrow{
                    @include wh(.45rem, .45rem);
                    position: absolute;
                    right: .3rem;
                }
            }
        }
    }
    .activities_details{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #262626;
        z-index: 200;
        padding: 1.25rem;
        .activities_shoptitle{
            text-align: center;
            @include sc(.8rem, #fff);
        }
        .activities_ratingstar{
            display: flex;
            justify-content: center;
            transform: scale(2.2);
            margin-top: .7rem;
        }
        .activities_list{
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            @include sc(.5rem, #fff);
            li{
                margin-bottom: .2rem;
                .activities_icon{
                    padding: 0 .02rem;
                    display: inline-block;
                    border: 0.025rem solid #fff;
                    border-radius: 0.1rem;
                }
                span{
                    color: #fff;
                    line-height: .6rem;
                }
            }
        }
        .activities_shopinfo{
            p{
                line-height: .7rem;
                @include sc(.5rem, #fff);
            }
        }
        .activities_title_style{
            text-align: center;
            margin-bottom: 1rem;
            span{
                @include sc(.5rem, #fff);
                border: 0.025rem solid #555;
                padding: .2rem .4rem;
                border-radius: 0.5rem;
            }

        }
        .close_activities{
            position: absolute;
            bottom: 1rem;
            @include cl;
        }
    }

    .food_container{
        display: flex;
        flex: 1;
        padding-bottom: 2rem;
    }
    .menu_container{
        display: flex;
        flex: 1;
        overflow-y: hidden;
        position: relative;
        .menu_left{
            background-color: #f8f8f8;
            width: 3.8rem;
            .menu_left_li{
                padding: .7rem .3rem;
                border-bottom: 0.025rem solid #ededed;
                box-sizing: border-box;
                border-left: 0.15rem solid #f8f8f8;
                position: relative;
                img{
                    @include wh(.5rem, .6rem);
                }
                span{
                    @include sc(.6rem, #666);
                }
                .category_num{
                    position: absolute;
                    top: .1rem;
                    right: .1rem;
                    background-color: #ff461d;
                    line-height: .6rem;
                    text-align: center;
                    border-radius: 50%;
                    border: 0.025rem solid #ff461d;
                    min-width: .6rem;
                    height: .6rem;
                    @include sc(.5rem, #fff);
                    font-family: Helvetica Neue,Tahoma,Arial;
                }
            }
            .activity_menu{
                border-left: 0.15rem solid #3190e8;
                background-color: #fff;
                span:nth-of-type(1){
                    font-weight: bold;
                }
            }
        }
        .menu_right{
            flex: 4;
            overflow-y: auto;
            .menu_detail_header{
                width: 100%;
                padding: .4rem;
                position: relative;
                @include fj;
                align-items: center;
                .menu_detail_header_left{
                    width: 11rem;
                    white-space: nowrap;
                    overflow: hidden;
                    .menu_item_title{
                        @include sc(.7rem, #666);
                        font-weight: bold;
                    }
                    .menu_item_description{
                        @include sc(.5rem, #999);
                        width: 30%;
                        overflow: hidden;
                    }
                }
                .menu_detail_header_right{
                    @include wh(.5rem, 1rem);
                    display: block;
                    @include bis('../../images/icon_point.png');
                    background-size: 100% .4rem;
                    background-position: left center;
                }
                .description_tip{
                    background-color: #39373a;
                    opacity: 0.95;
                    @include sc(.5rem, #fff);
                    position: absolute;
                    top: 1.5rem;
                    z-index: 14;
                    width: 8rem;
                    right: .2rem;
                    padding: .5rem .4rem;
                    border: 1px;
                    border-radius: .2rem;
                    span{
                        color: #fff;
                        line-height: .6rem;
                        font-size: .55rem;
                    }
                }
                .description_tip::after{
                    content: '';
                    position: absolute;
                    @include wh(.4rem, .4rem);
                    background-color: #39373a;
                    top: -.5rem;
                    right: .7rem;
                    transform: rotate(-45deg) translateY(.41rem);
                }
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
                    margin-left: 2.4rem;
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
        }
    }

    .change_show_type{
        // display: flex;
        background-color: #fff;
        padding: .2rem 0;
        border-bottom: 1px solid #ebebeb;
        overflow:hidden;
        #category_level_one{
          width: 100%;
          overflow: hidden;
          height: 1.5rem;
          .category_first{
            height: 1.5rem;

            li{
                min-width:3rem;
                text-align: center;
                padding:0.2rem 0.6rem;
                font-size:.6rem;
                line-height:1.5rem ;
                height: 1.5rem;
                display:inline-block;
                float:left;
                &.activity_menu {
                  // border-bottom:0.15rem solid $blue;
                  color:$blue;
                }
              }
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
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    .fade-choose-enter-active, .fade-choose-leave-active {
        transition: opacity .5s;
    }
    .fade-choose-leave, .fade-choose-leave-active {
        display: none;
    }
    .fade-choose-enter, .fade-choose-leave-active {
        opacity: 0;
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
   

</style>
