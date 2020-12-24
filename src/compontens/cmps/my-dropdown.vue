<template>
    <view class="">
         <!-- 下拉框 -->
        <u-dropdown height="100" duration="0">
            <!-- @change="selectArea" -->
            <!-- :title="options1[selectIndex1]||'选择医院'" -->
          <!-- <u-dropdown-item
            v-model="value1"
            :title="title1||'请选择医院'"
            :options="options1"
            @change="selectArea"
          ></u-dropdown-item>
          <u-dropdown-item
            v-model="value2"
            :title="value2||'运输方式'"
            :options="options2"
            :disabled="!title1"
            @change="selectUnit"
          ></u-dropdown-item>
          <u-dropdown-item
            v-model="value3"
            :title="title3||'选择月份'"
            @change="selectMonth"
            :options="options3"
          ></u-dropdown-item> -->

            <u-dropdown-item
            v-for="(item,index) in menuList"
            :key="index"
            :value="item.value"
            :title="item.title"
            @change="selectMonth"
            :options="item.option"
          ></u-dropdown-item>

        </u-dropdown>
      </view>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    props:{
        height:{
            type:String,
            value:100
        },
        duration:{
            type:String,
            value:0
        },
        menuList:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    methods:{
        selectMonth(value){
            console.log("valu==",value);
        }
    }
}
</script>
<style lang="scss" scoped>

</style>