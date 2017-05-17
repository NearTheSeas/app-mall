<template>
  	<div class="page">
        <!--<head-top signin-up='home'>
            <span slot='logo' class="head_logo"  @click="reload"></span>
        </head-top>-->
        <section class="group_province_container" v-if="showProvince">
            <ul class="letter_classify">
                <li v-for="(item, index) in provinceList" :key="index"  class="letter_classify_li" @click="selectProvince(item)">
                    <h4 class="city_title">{{item.value}}</h4>
                </li>
            </ul>
        </section>
        <transition name="fade">
             <section class="groupCityContainer " v-if="showCity" ref="groupCityContainer">
                <ul class="letter_classify">
                    <li v-for="(item, index) in cityList" :key="index"  class="letter_classify_li" @click.once="selectCity(item)">
                        <h4 class="city_title">{{item.value}}</h4>
                    </li>
                </ul>
            </section>
        </transition>
         <transition name="fade">
             <section class="groupAreaContainer " v-if="showArea" ref="groupAreaContainer">
                <ul class="letter_classify">
                    <li v-for="(item, index) in areaList" :key="index"  class="letter_classify_li" @click.once="selectArea(item)">
                        <h4 class="city_title">{{item.value}}</h4>
                    </li>
                </ul>
            </section>
        </transition>
    </div>
</template>

<script>
import headTop from '../../components/header/header'
import { getLocationData, getStreet } from '../../service/getData'
import {mapState, mapMutations} from 'vuex'
import BScroll from 'better-scroll'

export default {
    data(){
        return{
            locationData : null,
            source: null,
            provinceList: [],
            cityList:[],
            areaList: [],
            province: null,
            city: null,
            district: null,
            showProvince: false,
            showCity: false,
            showArea: false
        }
    },
    created(){
        this.init()
    },
	mounted(){
         
    },
    components:{
        headTop
    },
    computed:{
        //将获取的数据按照A-Z字母开头排序
        // sortgroupcity(){
        //     return locationData
        // }
    },
    methods:{
         ...mapMutations([
            'SET_LOCATION'
        ]),
        reload(){
            window.location.reload();
        },
        init(){
            getLocationData().then(res=>{
                var th = this
                this.source = res
                
                Object.keys(res[86]).forEach(function(item){
                    var obj = {}
                    obj.key = item
                    obj.value = th.source[86][item]
                    th.provinceList.push(obj)
                })
                this.showProvince = true
               
            }).then(()=>{
                 new BScroll('.group_province_container', {
                  probeType: 3,
                  deceleration: 0.001,
                  bounce: false,
                  swipeTime: 2000,
                  click: true,
                })
            })
        },
        selectProvince(item){
            var th = this
            this.province = item;
            // console.log('当前选中省份为' + item.value)
            Object.keys(th.source[item.key]).forEach(function(item){
                var obj = {}
                obj.key = item
                obj.value = th.source[th.province.key][item]
                th.cityList.push(obj)
            })
            this.showProvince = false
            this.showCity = true

            this.$nextTick(function(){
               
                // new BScroll('.groupCityContainer', {
                new BScroll(this.$refs['groupCityContainer'], {
                    probeType: 3,
                    deceleration: 0.001,
                    bounce: false,
                    swipeTime: 2000,
                    click: true,
                })
            })
        },
        selectCity(item,key){
            var th = this
            this.city = item;
            console.log('当前选中市为' + item.value)
            Object.keys(th.source[th.city.key]).forEach(function(item){
                var obj = {}
                obj.key = item
                obj.value = th.source[th.city.key][item]
                th.areaList.push(obj)
            })
            this.showCity = false
            this.showArea = true
            this.$nextTick(function(){
                
                // new BScroll('.groupAreaContainer', {
                new BScroll(this.$refs['groupAreaContainer'], {
                    probeType: 3,
                    deceleration: 0.001,
                    bounce: false,
                    swipeTime: 2000,
                    click: true,
                })
            })
            
        },
        selectArea(item,key){
            var th = this
            this.district = item;
            
            this.SET_LOCATION({province:this.province, city:this.city, district:this.district})
            this.$router.go(-1)
            // getStreet(item.key).then(res=>{
            //     console.log(res)
            // })
        }
    },
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 204;
    }
   .pagfe,
   .group_province_container,
   .groupAreaContainer,
   .groupCityContainer{
     height:100vh;
   }
//    .groupCityContainer,
   
//    .groupAreaContainer{
//         padding: 2.1rem 0;
//         position: absolute;
//         top:0;
//         left:0;
//         right:0;
//         bottom:0;
//    }
    .citylistul{
        li{
            float: left;
            text-align: center;
            color: $blue;
            border-bottom: 0.025rem solid $bc;
            border-right: 0.025rem solid $bc;
            @include wh(25%, 1.75rem);
            @include font(0.6rem, 1.75rem);
        }
        li:nth-of-type(4n){
            border-right: none;
        }
    }
    .city_title{
        color: #666;
        font-weight: 400;
        text-indent: 0.45rem;
        border-top: 2px solid $bc;
        border-bottom: 1px solid $bc;
        @include font(0.55rem, 1.45rem, "Helvetica Neue");
        span{
            @include sc(0.475rem, #999);
        }
    }
    
    .letter_classify_li{
        // margin-bottom: 0.4rem;
        background-color: #fff;
        border-bottom: 1px solid $bc;
        .groupcity_name_container{
            li{
                color: #666;
            }
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }

</style>
