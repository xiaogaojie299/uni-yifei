let mixins = {
    onLoad(option) {
        console.log(this.mwSelectDefaultValue);
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