 <template>
  <div class="rating_page">
        <head-top :head-title="prod.name" go-back='true'></head-top>
        <section class="header_img">
            <img :src="getImgPath(prod.img)" class="food_img">
            <div class="cover"></div>
            <!--<p class="description">{{description}}</p>-->
        </section>
        <section class="detail_container">
            <section class="detail_left">
                <p>{{prod.name}}</p>
                <p>
                    <!-- <span>月售 {{month_sales}}单</span> -->
                    <span>售价 ¥{{prod.salePrice}}</span>
                    <!-- <span v-if="foods.specfoods.length">起</span> -->
                </p>
                 <p>
                    <span>单位 {{prod.unit}}</span>
                </p> 
                <p>
                    <span>规格 {{prod.specification}}</span>
                </p>  
                <p>
                    <span>条码 {{prod.barcode}}</span>
                </p>
                <p>
                    <span>备注 {{prod.remarks}}</span>
                </p>
            </section>
            <buy-cart :prod='prod' @moveInCart="$emit('moveInCart')"></buy-cart>
        </section>
        <bottom-cart></bottom-cart>
    </div>
</template>

<script>
    import headTop from '../../components/header/header'
    import {getImgPath} from '../../components/common/mixin'
    
    import buyCart from '../../components/common/buyCart'
    import bottomCart from '../../components/common/bottomCart'

    export default {
        data(){
            return{
                prod:null
            }
        },
        created(){
            this.prod = this.$route.query.prod
        },
        mixins: [getImgPath],
        components: {
            headTop,
            buyCart,
            bottomCart
        },
        props:[],
        methods: {
            showChooseList(foodScroll){
                console.log(foodScroll);
                this.$emit('showChooseList', foodScroll)
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

  .rating_page{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 10;
    padding-top: 1.95rem;
    // padding-bottom:2rem;
    p, span{
        font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
    .header_img{
        position: relative;
        .food_img{
            width: 100%;
            display: block;
        }
        .cover{
            box-shadow: 0px -74px 100px #ddd inset;
            position: absolute;
            @include wh(100%, 100%);
            top: 0;
            left: 0;
        }
        .description{
            position: absolute;
            @include sc(.6rem, #666);
            line-height: .8rem;
            bottom: .2rem;
            padding: 0 .4rem;
        }
    }
    .detail_container{
        padding: .5rem;
        padding-bottom: 2.6rem;
        background-color:#fff; 
        @include fj;
        align-items: center;
        .detail_left{
            p:nth-of-type(1){
                @include sc(.7rem, #333);
                margin-bottom: .2rem;
            }
            p{
                span{
                    @include sc(.6rem, #666);
                }
            }
        }
    }

</style>
