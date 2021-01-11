<template lang="">
    <view class="container">

        <view class="my-box">
		<u-radio-group v-model="value" :wrap="true" width="100rpx"  @change="radioGroupChange">
            
			<u-radio
				@change="radioChange" 
				v-for="(item, index) in list" :key="index" 
				:name="item.name"
				:disabled="!item.disabled"
			>
            <view class="header flex-center my-box h-100">
				{{item.name}}
                <input v-if="index==1" disabled placeholder="选择单位名称" @tap="openSelect" :value="iptValue" />
                <img v-if="index==1" src="@/static/images/down_arrow.png" />
                    <!-- <view class="unit">你好</view> -->
                </view>
			</u-radio>
		</u-radio-group>
	</view>
    <u-picker v-model="show" :default-selector="[index]" @confirm="confirm" title="单位部门" :range="unitList" range-key="itemText" mode="selector"></u-picker>
    </view>
</template>
<script>
import {unitData} from "@/utils/api"
import leftree from "./cmps/left-tree"
import {actions,mutations} from "vuex"
export default {
    data(){
        return {
           list:[
                    {
                        name: '区域',
                        disabled: false,
                        orgType:1,
                        value:"1"
                    },
                    {
                        name: '单位',
                        disabled: false,
                        orgType:2
                    },
                    {
                        name: '部门',
                        disabled: false,
                        orgType:3
                    },
                    {
                        name: '科室',
                        disabled: false,
                        orgType:4
                    }
            ],
            value:"",           // 单选框中的 value
            unitList:[],        // 弹出框数据
            show:false,      // 弹出框的显示和隐藏
            index:0,        //弹出框选择的index下标
            iptValue:"",         // input 框中显示的值
            orgType:null        // 判断新增用户选择的父节点 1,2,3,4
        }
    },
    provide() {
        return {
        };
  },
    components:{
        leftree,
    },
    computed:{
        isSubmit(){
            return this.parent.label && this.name
        }
    },
    methods:{
        openSelect(){
            this.show = true;
        },
        // 选中某个单选框时，由radio时触发
		radioChange(e) {
            console.log(e);
            let selectValue={};
            selectValue.name =e;
            switch (e){
                case "区域" :selectValue.value =1;
                    break;
                case "单位" :selectValue.value =2
                    break;
                case "部门" :selectValue.value =3
                    break;
                default:    
                selectValue.value =4
            }
           console.log(selectValue);
           this.$store.commit('setUnitValue',selectValue)
            // uni.setStorageSync("unitValue",JSON.stringify(selectValue));
		},
		// 选中任一radio时，由radio-group触发
		radioGroupChange(e) {
        },
        confirm(index){
            this.index = index;
            this.iptValue = this.unitList[index].itemText;
        }
    },
    watch:{
        
    },
    onLoad(options){
        /* 
            canDelete: true
            departName: "测试123"
            id: 17947
            isWarehouse: 0
            key: 17947
            level: 118
            orgType: 2
            parentId: 40
            treeCode: "0000170002"
        this.name = node.label;
        switch( node.data.orgType){
            case 1:
            this.orgType = "区域";
            break 
            case 2:
            this.orgType = "单位";
            break;
            case 3:
            this.orgType = "部门";
            break;
            default: 
            this.orgType = "科室";
        }
        let params = {
            id: node.parentId
        }
        getParent(params).then(res=>{
        })
        */
       unitData().then(res=>{
           console.log(res.result);
           this.unitList = res.result;
       })
       this.orgType = options.orgType;
       this.list.forEach(((item,idnex)=>{
           if(options.orgType==1 || options.orgType==1){
                this.list[0].disabled = true;
                   this.list[1].disabled = true
           }else if(options.orgType==3){
               this.list[2].disabled = true;
           }else{
                this.list[3].disabled = true;
           }
       }))
    }
}
</script>
<style lang="scss" scoped>
        .container{
            .header{
                // line-height: 100rpx;
                position: relative;
                input{
                    position: absolute;
                    display: inline-block;
                    border: 1px solid #dddddd;
                    border-radius: 20rpx;
                    width: 300rpx;
                    height: 60rpx;
                    left:100rpx;
                    z-index: 1000;
                    padding-left:20rpx;
                    // top:50%;
                }
                img{
                    position: absolute;
                    left:360rpx;
                    border:1px solid red;
                    width: 22rpx;
                    height:18rpx;
                }   
                
            }
            .footer-btn {
                    bottom: 0;
                    position: fixed;
                    width: 100vw;
                    height: 100rpx;
                    background: #b2b2b2;
                    font-size: 32rpx;
                    font-family: PingFang-SC-Medium, PingFang-SC;
                    font-weight: 500;
                    color: #ffffff;
                }
                .allow{
                // background: $my-main-color;
                background: $my-main-color !important;
                }
        }
        
</style>