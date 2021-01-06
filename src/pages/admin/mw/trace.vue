<template>
<!-- :default-value="[0,0,0]" -->
	<u-select v-model="show" mode="mutil-column-auto" :default-value="[0,1,1]" :list="list1" @confirm="confirm"></u-select>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				list: [
					[
						{
							value: '1',
							label: '江'
						},
						{
							value: '2',
							label: '湖'
						}
					],
					[
						{
							value: '3',
							label: '夜'
						},
						{
							value: '4',
							label: '雨'
						}
					],
					
                ],
                list1: [
					{
						value: 1,
						label: '中国',
						children: [
							{
								value: 2,
								label: '广东',
								children: [
									{
										value: 3,
										label: '深圳'
									},
									{
										value: 4,
										label: '广州'
									}
								]
							},
							{
								value: 5,
								label: '广西',
								children: [
									{
										value: 6,
										label: '南宁'
									},
									{
										value: 7,
										label: '桂林'
									}
								]
							}
						]
					}]
			}
		},
		methods: {
			// 回调参数为包含多个元素的数组，每个元素分别反应每一列的选择情况
			confirm(e) {
				console.log(e);
			}
		}
	}
</script>