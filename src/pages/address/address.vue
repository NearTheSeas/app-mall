 <template>
  	<div class="rating_page">
        <head-top head-title="编辑地址" go-back='true'>
        	<!-- <span slot="edit" class="edit" @click="editThing">{{editText}}</span> -->
        </head-top>
        <section class="address">
        	<ul class=" deliverable_address">
        		
                <!--<router-link to="/chooseAddress/addAddress" tag="li" v-for="(item,index) in addressList" :key="index" @click.prevent="editAddress(item)">-->
                <li v-for="(item,index) in addressList" :key="index" @click="setEditAddress(item)">
                    <svg class="choosed_address" >
                        <!-- <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use> -->
                    </svg>
                    <div>
                        <header>
                            <span>{{item.linkName}}</span>
                            <span>{{item.phone}}</span>
                        </header>
                        <div class="address_detail ellipsis">
                            <span v-if="item.tag" :style="{backgroundColor: iconColor(item.tag)}">{{item.tag}}</span>
                            <p>{{item.address}}</p>
                        </div>
                    </div>
                </li>
                <!--</router-link>-->
        	</ul>
          
            <router-link to='/addAddress'>
                <div class="addsite">
                    <span>新增地址</span>
                    <span class="addsvg">
                        <svg fill="#d8d8d8">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                        </svg>
                    </span>
                </div>
            </router-link>
        </section>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from '../../components/header/header'
    import {getImgPath} from '../../components/common/mixin'
    import {mapState, mapActions, mapMutations} from 'vuex'
    import {getAddress, deleteAddress} from '../../service/getData'

    export default {
      data(){
            return{
                deletesite:false, //是否编辑状态
                editText:'编辑',
                addressList:[], //地址列表
            }
        },
        mounted(){
            this.initData()
            this.CLEAR_SELECTADD()
        },
        mixins: [getImgPath],

        components: {
            headTop,
        },
        computed:{
            ...mapState([
                'userInfo','removeAddress'
            ]),
        },
        props:[],
        methods: {
            ...mapActions([
                'saveAddress'
            ]),
             ...mapMutations([
                'CLEAR_SELECTADD'
            ]),
            //初始化信息
            initData(){
                this.addressList = [];
                getAddress().then(res=>{
                    this.addressList = res.data.data
                })
            },
            //编辑
            editThing(){
                if(this.editText == '编辑'){
                    this.editText='完成';
                    this.deletesite=true;
                }else{
                    this.editText='编辑';
                    this.deletesite=false;
                }
            },
            //删除地址
            deleteSite(index, item){
                if (this.userInfo && this.userInfo.user_id) {
                    deleteAddress(this.userInfo.user_id, item.id);
                    this.removeAddress.splice(index, 1);
                }
            },
            setEditAddress(address){
                // this.EDIT_ADDRESS(address)
                this.$router.push({path:'/addAddress',query:{address}})
            }
        },
        watch: {
            userInfo: function (value) {
                if (value && value.user_id) {
                    this.initData();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
.scroll_container{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding-top: 1.95rem;
        overflow-y: auto;
    }
    .list_cotainer{
        padding-bottom: 5rem;
    }
    .add_icon_footer{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2.5rem;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 204;
        span{
            @include sc(.7rem, $blue);
            margin-left: .3rem;
        }
    }
    .deliverable_address{
        background-color: #fff;
        li{
            display: flex;
            align-items: center;
            border-bottom: 0.025rem solid #f5f5f5;
            padding: .7rem;
            line-height: 1rem;
            .choosed_address{
                @include wh(.8rem, .8rem);
                fill: #4cd964;
                margin-right: .4rem;
                opacity: 0;
            }
            .default_address{
                opacity: 1;
            }
            header{
                @include sc(.7rem, #333);
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
                    @include sc(.6rem, #777);
                }
            }
        }
    }
    .rating_page{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f2f2f2;
        z-index: 202;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .edit{
    	right: 0.4rem;
        @include sc(0.7rem, #fff);
        @include ct;
    }
    .address{
    	width:100%;
    	margin-top:.4rem;
    	border-top:1px solid #d9d9d9;
    	border-bottom:1px solid #d9d9d9;
    	.addresslist{
    		background:#fff;
    		li{
    			border-bottom:1px solid #d9d9d9;
    			padding:.4rem;
    			@include fj(space-between);
    			p{
    				line-height:.9rem;
    				@include sc(.6rem,#333);
    				span{
    					display:inline-block;
    					@include sc(.6rem,#333);
    				}
    			}
    			.deletesite{
    				display:flex;
    				align-items:center;
    				span{
    					display:block;
    					@include sc(.8rem,#999)
    				}
    			}
    		}
    		li:nth-of-type(1){
    			background:#FFF8C3;
    		}
    	}
    	.addsite{
    		margin-top:.4rem;
    		background:#fff;
    		padding:.2rem .4rem;
    		border-top:1px solid #d9d9d9;
    		@include fj(space-between);
    		span{
    			display:block;
    			@include sc(.7rem,#333);
    			line-height:1.4rem;
    		}
    		.addsvg{
    			@include wh(.66667rem,1.4rem);
    			svg{
    				@include wh(100%,100%);
    			}
    		}
    	}
    }
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
}
</style>
