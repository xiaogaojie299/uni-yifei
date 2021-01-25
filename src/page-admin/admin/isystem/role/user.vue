<template lang="">
    <div>
        <!-- 用户角色管理 -->
        <roleIndex type="2" />
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