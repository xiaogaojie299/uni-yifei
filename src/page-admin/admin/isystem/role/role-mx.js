import {sysRoleList} from "@/utils/api.js"
const mixins = {
    data(){
        return {
            roleList:[]
        }
    },
    methods: {
    //     init(type=2){
    //         let params = {
    //             type
    //         }
    //         sysRoleList(params).then(({result,code})=>{
    //            if(code==200){
    //             //    this.roleList = result;
    //             console.log(result);
    //             // this.roleList =[...result];
    //             this.$set(this.roleList,0,result[0]);
    //             // result.forEach((item,index)=>{
    //             //     this.$set(this.roleList,index,item)
    //             // })
    //             // location.reload();
    //             console.log(this.roleList);
    //         }
    //        })
    //    }
    },
    onShow(){
    },
    created() {
    },
}
export default mixins