<template lang="">
    <div>
        <!-- 运营角色管理 -->
        <roleIndex ref="childMethod" type="1" />
    </div>
</template>
<script>
import roleIndex from "./cmps/roleIndex";
import mixins from "./role-mx";
export default {
  mixins: [mixins],
  components: {
    roleIndex,
  },

  data() {
    return {
      roleList: [],
    };
  },
  watch:{
  },
  onLoad(){
  },
  onShow() {
      try{  // 迫不得已用的$refs  混入 试图不刷新 ... 强刷也不行... 
        this.reload();
      }catch(e){
          //TODO handle the exception
      }
    },
  methods: {
    //  获取权限列表
    reload() {
      this.$nextTick(()=>{
            this.$refs.childMethod.getRoleList();
        })
    },
  },
};
</script>