<template>
    <section id='foot_guide'>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position:absolute;width:0;height:0">
        <defs>
          <symbol id="home" viewBox="0 0 32 32">
            <title>home</title>
            <path d="M16 1l-16 16 3 3 3-3v13h8v-6h4v6h8v-13l3 3 3-3-16-16zM16 14c-1.105 0-2-0.895-2-2s0.895-2 2-2c1.105 0 2 0.895 2 2s-0.895 2-2 2z"></path>
          </symbol>

          <symbol id="activehome" viewBox="0 0 32 32">
            <title>home</title>
            <path fill="#0095FF" d="M16 1l-16 16 3 3 3-3v13h8v-6h4v6h8v-13l3 3 3-3-16-16zM16 14c-1.105 0-2-0.895-2-2s0.895-2 2-2c1.105 0 2 0.895 2 2s-0.895 2-2 2z"></path>
          </symbol>

          <symbol id="carts" viewBox="0 0 1024 1024" width="28" height="28">
            <!--<path d="M768 576c13.6 0 24.8-8.8 29.6-22.4l97.6-318.4c6.4-20.8-8-43.2-29.6-43.2H252.8l-18.4-64L216 64H64v64h104.8l18.4 64 100 361.6c1.6 4.8 4 8.8 7.2 12l-52 83.2c-6.4 5.6-10.4 14.4-10.4 23.2 0 17.6 14.4 32 32 32h568v-64H323.2l40-64H768z" p-id="4099"></path><path d="M320 832m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="4100"></path><path d="M768 832m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="4101"></path>-->
            <!--<path d="M246.4 912a2.1 2.1 0 1 0 134.4 0 2.1 2.1 0 1 0-134.4 0Z" p-id="1041"></path>
            <path d="M716.8 912a2.1 2.1 0 1 0 134.4 0 2.1 2.1 0 1 0-134.4 0Z" p-id="1042"></path>
            <path d="M905.6 764.8l-537.6 0c-28.8 0-57.6-25.6-64-54.4l-96-566.4c-9.6-54.4-60.8-96-115.2-96l-22.4 0c-12.8 0-25.6 12.8-25.6 25.6 0 12.8 12.8 25.6 25.6 25.6l22.4 0c28.8 0 57.6 25.6 64 54.4l96 566.4c9.6 54.4 60.8 96 115.2 96l537.6 0c12.8 0 25.6-12.8 25.6-25.6C931.2 777.6 921.6 764.8 905.6 764.8z" p-id="1043"></path>
            <path d="M880 179.2l-572.8 0c-12.8 0-25.6 12.8-25.6 25.6 0 12.8 12.8 25.6 25.6 25.6l572.8 0c25.6 0 38.4 16 32 41.6l-70.4 281.6c-6.4 32-41.6 57.6-73.6 60.8l-396.8 28.8c-12.8 0-25.6 12.8-22.4 28.8 0 12.8 12.8 25.6 28.8 22.4l396.8-28.8c54.4-3.2 105.6-48 118.4-99.2l70.4-281.6C976 230.4 937.6 179.2 880 179.2z" p-id="1044"></path>-->

            <path d="M832 256H640V160.8c0-17.6-14.4-32.8-32.8-32.8H416c-17.6 0-32.8 14.4-32.8 32.8V256H192l-64 576c0 35.2 28.8 64 64 64h640c35.2 0 64-28.8 64-64l-64-576z m-384-64h128v64H448v-64z m326.4 128l56.8 512H192l56.8-512" p-id="3222"></path>
            <path d="M447.2 352.8H384V416h63.2v-63.2zM640 352.8h-63.2V416H640v-63.2z" p-id="3223"></path>
          </symbol>

          <symbol viewBox="0 0 40 40" id="msite"><g fill="none" fill-rule="evenodd" stroke="#666" stroke-width="2"><path d="M31.426 23.095l2.678 5.742 2.943-1.372a3.173 3.173 0 0 0 1.537-4.212l-1.339-2.871-5.819 2.713z"></path><path d="M29.074 31.161c-1.224-.49-2.404-.32-3.49.185-6.383 2.977-13.938.286-16.875-6.01-2.936-6.297-.14-13.815 6.243-16.792 5.211-2.43 11.203-1.083 14.825 2.919l-12.263 5.718c-1.596.745-2.295 2.624-1.561 4.198.734 1.574 2.625 2.246 4.22 1.503l8.422-3.928 9.953-4.641a18.78 18.78 0 0 0-.941-2.453C33.202 2.416 21.869-1.62 12.294 2.844 2.718 7.309-1.474 18.586 2.93 28.03c4.404 9.445 15.737 13.482 25.313 9.017 1.069-.499 2.067-.879 3.438-1.744 0 0-1.382-3.651-2.607-4.142z"></path></g></symbol>

          <symbol xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 40 40" id="msiteActive"><defs><linearGradient id="index.18edf5a_c" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#2BAEFF"></stop><stop offset="100%" stop-color="#0095FF"></stop></linearGradient><linearGradient id="index.18edf5a_d" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#29ADFF"></stop><stop offset="100%" stop-color="#0095FF"></stop></linearGradient><path id="index.18edf5a_a" d="M30.426 22.095l2.678 5.742 2.943-1.372a3.173 3.173 0 0 0 1.537-4.212l-1.339-2.871-5.819 2.713z"></path><mask id="index.18edf5a_e" width="9.455" height="10.456" x="-1" y="-1"><path fill="#fff" d="M29.426 18.382h9.455v10.456h-9.455z"></path><use xlink:href="#index.18edf5a_a"></use></mask><path id="index.18edf5a_b" d="M28.074 30.161c-1.224-.49-2.404-.32-3.49.185-6.383 2.977-13.938.286-16.875-6.01-2.936-6.297-.14-13.815 6.243-16.792 5.211-2.43 11.203-1.083 14.825 2.919l-12.263 5.718c-1.596.745-2.295 2.624-1.561 4.198.734 1.574 2.625 2.246 4.22 1.503l8.422-3.928 9.953-4.641a18.78 18.78 0 0 0-.941-2.453C32.202 1.416 20.869-2.62 11.294 1.844 1.718 6.309-2.474 17.586 1.93 27.03c4.404 9.445 15.737 13.482 25.313 9.017 1.069-.499 2.067-.879 3.438-1.744 0 0-1.382-3.651-2.607-4.142z"></path><mask id="index.18edf5a_f" width="38.769" height="39.241" x="-.7" y="-.7"><path fill="#fff" d="M-.521-.675h38.769v39.241H-.521z"></path><use xlink:href="#index.18edf5a_b"></use></mask></defs><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)"><use fill="url(#index.18edf5a_c)" xlink:href="#index.18edf5a_a"></use><use stroke="url(#index.18edf5a_d)" stroke-width="2" mask="url(#index.18edf5a_e)" xlink:href="#index.18edf5a_a"></use></g><g transform="translate(1 1)"><use fill="url(#index.18edf5a_c)" xlink:href="#index.18edf5a_b"></use><use stroke="url(#index.18edf5a_d)" stroke-width="1.4" mask="url(#index.18edf5a_f)" xlink:href="#index.18edf5a_b"></use></g></g></symbol>

          <symbol xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 40 40" id="find"><defs><path id="discover-regular.8ef537f_a" d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20z"></path><mask id="discover-regular.8ef537f_b" width="40" height="40" x="0" y="0" fill="#fff"><use xlink:href="#discover-regular.8ef537f_a"></use></mask></defs><g fill="none" fill-rule="evenodd"><use stroke="#666" stroke-width="4" mask="url(#discover-regular.8ef537f_b)" xlink:href="#discover-regular.8ef537f_a"></use><path stroke="#666" stroke-width="2" d="M12.79 28.126c-1.515.68-2.169.016-1.462-1.484l3.905-8.284c.47-.999 1.665-2.198 2.66-2.675l8.484-4.064c1.497-.717 2.153-.08 1.46 1.435l-3.953 8.64c-.46 1.006-1.647 2.186-2.655 2.64l-8.44 3.792z"></path><path fill="#666" d="M15.693 24.636c-.692.276-1.02-.06-.747-.746l2.21-4.946c.225-.505.721-.602 1.122-.202l2.563 2.563c.394.394.31.893-.203 1.122l-4.945 2.209z"></path></g></symbol>

          <symbol viewBox="0 0 40 40" id="findActive"><defs><linearGradient id="discover.5811137_a" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#2BAEFF"></stop><stop offset="100%" stop-color="#0095FF"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><path fill="url(#discover.5811137_a)" d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20z"></path><path fill="#FFF" d="M12.79 28.126c-1.515.68-2.169.016-1.462-1.484l3.905-8.284c.47-.999 1.665-2.198 2.66-2.675l8.484-4.064c1.497-.717 2.153-.08 1.46 1.435l-3.953 8.64c-.46 1.006-1.647 2.186-2.655 2.64l-8.44 3.792z"></path><path fill="url(#discover.5811137_a)" d="M6.482 5.44c-.684-.294-.678-.764 0-1.055L11.54 2.45c.517-.198.936.085.936.65v3.625c0 .558-.412.852-.936.65L6.48 5.44z" transform="rotate(-45 34.258 3.92)"></path></g></symbol>

          <symbol xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 38 38" id="order"><defs><rect id="order-regular.41c17f8_a" width="38" height="38" rx="2"></rect><mask id="order-regular.41c17f8_b" width="38" height="38" x="0" y="0" fill="#fff"><use xlink:href="#order-regular.41c17f8_a"></use></mask></defs><g fill="none" fill-rule="evenodd"><use stroke="#666" stroke-width="4" mask="url(#order-regular.41c17f8_b)" xlink:href="#order-regular.41c17f8_a"></use><rect width="24" height="2" x="7" y="8" fill="#666" rx="1"></rect><rect width="20" height="2" x="7" y="17" fill="#666" rx="1"></rect><rect width="8" height="2" x="7" y="26" fill="#666" rx="1"></rect></g></symbol>

          <symbol viewBox="0 0 38 38" id="orderActive"><defs><linearGradient id="order.070ae2a_a" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#2BAEFF"></stop><stop offset="100%" stop-color="#0095FF"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><rect width="38" height="38" fill="url(#order.070ae2a_a)" rx="2"></rect><rect width="24" height="2" x="7" y="8" fill="#FFF" rx="1"></rect><rect width="20" height="2" x="7" y="17" fill="#FFF" rx="1"></rect><rect width="8" height="2" x="7" y="26" fill="#FFF" rx="1"></rect></g></symbol>

          <symbol xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 38 38" id="profile"><defs><path id="profile-regular.c151d62_a" d="M10 11.833V8.999A8.999 8.999 0 0 1 19 0c4.97 0 9 4.04 9 8.999v2.834l-.013.191C27.657 16.981 23.367 21 19 21c-4.616 0-8.64-4.02-8.987-8.976L10 11.833z"></path><mask id="profile-regular.c151d62_c" width="18" height="21" x="0" y="0" fill="#fff"><use xlink:href="#profile-regular.c151d62_a"></use></mask><path id="profile-regular.c151d62_b" d="M0 32.675C0 26.763 10.139 22 19.027 22 27.916 22 38 26.763 38 32.757v3.312C38 37.136 37.098 38 35.997 38H2.003C.897 38 0 37.137 0 36.037v-3.362z"></path><mask id="profile-regular.c151d62_d" width="38" height="16" x="0" y="0" fill="#fff"><use xlink:href="#profile-regular.c151d62_b"></use></mask></defs><g fill="none" fill-rule="evenodd" stroke="#666" stroke-width="4"><use mask="url(#profile-regular.c151d62_c)" xlink:href="#profile-regular.c151d62_a"></use><use mask="url(#profile-regular.c151d62_d)" xlink:href="#profile-regular.c151d62_b"></use></g></symbol>

          <symbol viewBox="0 0 38 38" id="profileActive"><defs><linearGradient id="profile.dbc5ebf_a" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#2BAEFF"></stop><stop offset="100%" stop-color="#0095FF"></stop></linearGradient></defs><path fill="url(#profile.dbc5ebf_a)" fill-rule="evenodd" d="M10 11.833V8.999A8.999 8.999 0 0 1 19 0c4.97 0 9 4.04 9 8.999v2.834l-.013.191C27.657 16.981 23.367 21 19 21c-4.616 0-8.64-4.02-8.987-8.976L10 11.833zM0 32.675C0 26.763 10.139 22 19.027 22 27.916 22 38 26.763 38 32.757v3.312C38 37.136 37.098 38 35.997 38H2.003C.897 38 0 37.137 0 36.037v-3.362z"></path></symbol>
        </defs>
      </svg>
        <section @click = "gotoAddress({path: '/home'})" class="guide_item">
          <svg class="icon_style">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="$route.path.indexOf('home') !== -1? '#activehome' : '#home'"></use>
            </svg>
            <span>首页</span>
        </section>
        <section @click = "gotoAddress({path: '/category/'})" class="guide_item">
          <svg class="icon_style">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="$route.path.indexOf('search') !== -1? '#findActive' : '#find'"></use>
            </svg>
            <span>分类</span>
        </section>
        <section @click = "gotoAddress('/cart')" class="guide_item cart" :class="{'active': ($route.path.indexOf('cart') !== -1)}" ref="cartContainer">
          <svg class="icon_style" style="margin-bottom:.1rem">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#carts'"></use>
            </svg>
            <span>购物车</span>
            <span class="cart_num" v-if="cartNum">{{cartNum}}</span>
        </section>
        <section @click = "gotoAddress('/profile')" class="guide_item">
          <svg class="icon_style">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="$route.path.indexOf('profile') !== -1? '#profileActive' : '#profile'"></use>
            </svg>
            <span>我的</span>
        </section>
    </section>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    export default {
      data(){
            return{
              cartNum : 0
            }
        },
        created(){

        },
        mounted(){
          this.initCartNum();
        },
        computed: {
            ...mapState([
                'geohash', 'cartList'
            ]),
            shopCart: function (){
                return {...this.cartList};
            },
        },
        methods: {
          ...mapMutations([
             'INIT_BUYCART'
          ]),
          gotoAddress(path){
            this.$router.push(path)
          },
          initCartNum(){
            let cart =this.shopCart
            let num = 0
            Object.keys(cart).forEach(function(item,index){
                num += cart[item]['num']
            })
            this.cartNum = num
              // let newArr = [];
              // let cartFoodNum = 0;
              // this.totalPrice = 0;
              // this.cartProdList = [];
              // this.cartList.forEach((item, index) => {
              //   console.log(item);
              //     if (this.shopCart&&this.shopCart[item.foods[0].category_id]) {

              //     }else{
              //         newArr[index] = 0;
              //     }
              // })
              // this.totalPrice = this.totalPrice.toFixed(2);
              // this.categoryNum = [...newArr];
            },
        },
        watch: {
          shopCart: function (value){
                this.initCartNum();
            },
        }
    }

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    #foot_guide{
        background-color: #fff;
        position: fixed;
        z-index: 100;
        left: 0;
        right: 0;
        bottom: 0;
        @include wh(100%, 1.95rem);
        display: flex;
        box-shadow: 0 -0.026667rem 0.053333rem rgba(0,0,0,.1);
    }
    .guide_item{
      flex: 1;
      display: flex;
      text-align: center;
      flex-direction: column;
      align-items: center;
      position:relative;

      &.active svg{
        fill:#3190e8;
      }
      .icon_style{
        @include wh(.8rem, .8rem);
        margin-bottom: .2rem;
        margin-top: .3rem;
        fill: #666;
      }
      .icon_style{
        @include wh(1rem, 1rem);
      }
      span{
        @include sc(.45rem, #666);
      }
      .cart_num{
          position: absolute;
          top: .1rem;
          right: 1rem;
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

</style>
