<template lang="">
    <div>
        <!-- 运营角色管理 -->
        <roleIndex type="1" />
    </div>
</template>
<script>
import roleIndex from "./cmps/roleIndex"
export default {
    components:{
        roleIndex
    },
    data(){
        return {
            roleList:[]
        }
    },
    methods:{
        //  获取权限列表
        getRoleList(){
            let params = {
                
            }
        }
    }
}
</script>