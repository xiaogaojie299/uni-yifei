<template>
    <view class="">
        <!-- :default-value="defaultValue" -->
        <u-select v-model="show" default-value="[1,2,3]" mode="mutil-column-auto" :list="list" @confirm="confirm"></u-select>
    </view>
</template>
<script>
export default {
    data(){
        return {
            show:false
        }
    },
    props:{
        list:{
            type:Array,
            default:()=>{
                return []
            }
        },
        defaultValue:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    methods:{
        confirm(e){
            console.log(e[e.length-1]);
            this.$emit("selectRow",e[e.length-1])
        },
        openShow(){
            this.show=true;
        },
        closeShow(){
             this.show=false;
        }
    }
}
</script>
<style lang="scss" scoped>
    
</style>