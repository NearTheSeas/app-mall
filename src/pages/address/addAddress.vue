 <template>
    <div class="address_page">
        <head-top head-title="编辑地址" go-back='true'></head-top>
        <section class="page_text_container">
            <section class="section_list">
                <span class="section_left">联系人</span>
                <section class="section_right">
                    <input type="text" name="name" placeholder="你的名字" v-model="name" class="input_style">
                </section>
            </section>
            <section class="section_list">
                <span class="section_left">联系电话</span>
                <section class="section_right">
                    <div class="phone_add">
                        <input type="text" name="phone" placeholder="你的手机号" v-model="phone" class="input_style">
                        <!-- <img src="../../../images/add_phone.png" height="20" width="20" @click="phone_bk = true"> -->
                    </div>
                    <!-- <input v-if="phone_bk" type="text" name="anntherPhoneNumber" placeholder="备选电话" v-model="anntherPhoneNumber" class="input_style phone_bk"> -->
                </section>
            </section>
            <section class="section_list">
                <span class="section_left">详细地址</span>
                <section class="section_right">
                    <router-link to="/addAddress/selectLocation" tag="input" class="input_style" placeholder="请选择地址" :value="getAddressStr ? getAddressStr : addressStr"></router-link> 
                    <input type="text" id="suggestId" name="address_detail" placeholder="如门牌号等" v-model="address_detail" class="input_style">
                    <!-- <div class="choose_address" v-if="userlocation.lng" >{{userlocation.lng+", "+userlocation.lat}}</div> -->
                </section>
            </section>

            <div v-if="showMap" id="allmap"></div>
        </section>
        <div class="determine" @click="addAddress">确定</div>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from '../../components/header/header'
    import {mapState, mapMutations} from 'vuex'
    import {loginData, getAddress, getUser, addNewAddress} from '../../service/getData'
    import alertTip from '../../components/common/alertTip'
    import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText } from 'element-china-area-data'
    import {MP} from '../../components/common/map'

    // import BaiduMap from 'vue-baidu-map'
    export default {
      data(){
            return{
                name: null, //姓名
                phone: null, //电话
                address_detail: '', //详细地址
                
                showAlert: false, //弹出框
                alertText: null, //弹出框信息
                poi_type: 0, //地址类型
                userlocation:{lng: 116.404, lat: 39.915},
               
                addressStr:null,
                BMap:null,
                map:null,
                local:null,
                showMap: false,
            }
        },
        created(){
            let oldAdd = this.$route.query.address
            if(oldAdd){
                this.name = oldAdd.linkName
                this.phone = oldAdd.phone
                this.userlocation.lng = oldAdd.longitude
                this.userlocation.lat = oldAdd.latitude
                this.address_detail = oldAdd.address
                this.oldprovince = oldAdd.province
                this.oldcity = oldAdd.city
                this.olddistrict = oldAdd.district
                this.showMap =  false
                this.addressStr = oldAdd.province + oldAdd.city +  oldAdd.district
            }
        },
        computed: {
            ...mapState([
                 'province','city','district'
            ]),
            getAddressStr(){
                if(this.province){
                    return this.province.value + this.city.value + this.district.value
                }else if(this.oldprovince){
                    return this.oldprovince + this.oldcity + this.olddistrict
                }
            }
        },
        mounted(){
            
            this.$nextTick(function () {
                MP("I4lS2zXxXCoXwin1mG0Gv4n4UnciC7qw").then( BMap => {
                    this.BMap = BMap
                })
            })
        },
        components: {
            headTop,
            alertTip,
        },
        methods: {
            ...mapMutations([
                'SET_LOCATION',,'CLEAR_SELECTADD'
            ]),
            handleChange (value) {
              var str = ''
              value.forEach(function(item){
                str += CodeToText[item]
              })
              console.log(str)
            },
            handleMap(){
                this.$nextTick(function () {
                    var map = this.map = new this.BMap.Map("allmap")
                    var point = new BMap.Point(116.404, 39.915)
                    map.centerAndZoom(point,16);
                    map.enableScrollWheelZoom();
                    console.log(this.getAddressStr)
                    this.handleMapSearch(this.getAddressStr)
                    this.handleAutocomplete()
                })
            },
            handleMapSearch(searchValue){
                let th = this
                let map = this.map
                function searchCallback(){
                    if( !local.getResults().getPoi(0)){
                        return
                    }
                    var tmp_point= local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    th.userlocation.latitude = tmp_point.lat
                    th.userlocation.longitude = tmp_point.lng
                    
                    map.centerAndZoom(tmp_point, 16);
                    map.addOverlay(new BMap.Marker(tmp_point));    //添加标注
                }
                let local = this.local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: searchCallback
                });
                map.clearOverlays();    //清除地图上所有覆盖物
                
                local.search(searchValue);
            },
            handleAutocomplete(){
                let th = this
                var ac = new this.BMap.Autocomplete({
                    "input" : "suggestId",
                    "location" : th.map
                })
                ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                    var _value = e.item.value;
                    th.address_detail  = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    th.handleMapSearch(th.address_detail);
                });
            },
            //保存地址信息
            addAddress(){
                var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 

                if (!(loginData && loginData.customerName)) {

                    this.showAlert = true;
                    this.alertText = '请登录'
                    return
                }else if(!this.name){
                    this.showAlert = true;
                    this.alertText = '请输入姓名'
                    return
                }else if(!this.phone){
                    this.showAlert = true;
                    this.alertText = '请输入电话号码'
                    return
                }else if(!myreg.test(this.phone)){
                    this.showAlert = true;
                    this.alertText = '电话号码格式有误'
                    return
                }else if(!this.getAddressStr){
                    this.showAlert = true;
                    this.alertText = '请选择地址'
                    return
                }else if(!this.address_detail){
                    this.showAlert = true;
                    this.alertText = '请输入门牌号等详细地址'
                    return
                }
                addNewAddress( this.name,  this.address_detail,   this.userlocation.longitude, this.userlocation.latitude, this.phone, this.province.value, this.city.value, this.district.value).then(res=>{
                  if (res.message) {
                    this.showAlert = true;
                    this.alertText = res.message;
                  }else {
                    this.CLEAR_SELECTADD()
                    this.$router.go(-1);
                  }
                })
                //保存成功返沪上一页，否则弹出提示框
            },
        },
        watch:{
            getAddressStr: function(value){
                this.showMap = true
                this.handleMap()
                return value
            },
            // province: function(){
            //     addressStr = province + city + district
            // }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    .el-cascader.el-cascader--large {
      margin-top: 10px;
    }

    .bm-view {
      width: 100%;
      height: 200px;
    }
    #allmap{
        height: 200px;
        margin:0;
        font-family:"微软雅黑";
    }
    .address_page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 204;
        padding-top: 1.95rem;
        p, span, input{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .page_text_container{
        background-color: #fff;
        padding: 0 .7rem;
    }
    .section_list{
        display: flex;
        border-bottom: 0.025rem solid #f5f5f5;
        .section_left{
            @include sc(.7rem, #333);
            flex: 2;
            line-height: 2.5rem;
        }
        .section_right{
            flex: 5;
            .input_style{
                width: 100%;
                height: 2.5rem;
                @include sc(.7rem, #999);
            }
            .phone_bk{
                border-top: 0.025rem solid #f5f5f5;
            }
            .phone_add{
                @include fj;
                align-items: center;
            }
            .choose_sex{
                display: flex;
                line-height: 2.5rem;
                border-top: 0.025rem solid #f5f5f5;
                .choose_option{
                    @include sc(.7rem, #333);
                    display: flex;
                    align-items: center;
                    margin-right: .8rem;
                    svg{
                        margin-right: .3rem;
                        @include wh(.8rem, .8rem);
                        fill: #ccc;
                    }
                    .choosed{
                        fill: #4cd964;
                    }
                }
            }
            .choose_address{
                @include sc(.7rem, #999);
                line-height: 2.5rem;
                border-bottom: 0.025rem solid #f5f5f5;
            }
        }
    }
    .determine{
        background-color: #4cd964;
        @include sc(.7rem, #fff);
        text-align: center;
        margin: 0 .7rem;
        line-height: 1.8rem;
        border-radius: 0.2rem;
        margin-top: .6rem;
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
