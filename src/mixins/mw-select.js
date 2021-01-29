let mixins = {
    onLoad(option) {
        // 设置默认医院
        let { departmentIdList, departmentName } = JSON.parse(uni.getStorageSync("userInfo"));
        this.hospitalId = departmentIdList[departmentIdList.length -1];
        this.$store.commit('setCheckedNodes', {});
        for (let i in option) {
            this.$set(this.mwSelectDefaultValue, i, option[i]);
            this.$set(this.$data, i, option[i]);
        }
    },
    data(){
        return {
            mwSelectDefaultValue: {}
        };
    },
    methods: {
        
    },
    created() {
    },
}
export default mixins