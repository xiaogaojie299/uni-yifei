<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			Promise.prototype.finally = function(callback){
				let P = this.constructor;
				return this.then(
					value => {
						P.resolve(callback()).then(() => value)
					},
					reason => {
						P.resolve(callback()).then(() => { throw reason })
					}
				)
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
