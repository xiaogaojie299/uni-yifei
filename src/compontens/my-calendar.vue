<template lang="">
    <view>
		<view class="">
			测试{{timerShow}}
		</view>
		<u-calendar v-model="timerShow" month-arrow-color="#000" mode="range" @change="change"></u-calendar>
	</view>
</template>
<script>
import mixins from "@/mixins/mx-calendar"
	export default {
		mixins:[mixins],
		data() {
			return {
				
			}
        },
	}
</script>