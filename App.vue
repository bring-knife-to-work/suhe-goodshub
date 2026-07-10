<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 初始化购物车
			this.$store.commit('cart/INIT_CART')
			// 初始化用户信息
			this.$store.commit('user/INIT_USER')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 全局样式 */
	page {
		background-color: #f5f5f5;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
		color: #333;
		font-size: 28rpx;
	}
	
	/* 页面容器通用内边距 */
	.page-container {
		padding: 20rpx;
	}
	
	/* 卡片样式 */
	.card {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}
	
	/* 主按钮 */
	.btn-primary {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background: linear-gradient(135deg, #ff4d4f, #ff7875);
		color: #fff;
		font-size: 32rpx;
		border-radius: 44rpx;
		border: none;
	}
	
	.btn-primary:active {
		opacity: 0.85;
	}
	
	/* 列表空状态 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 0;
		color: #999;
		font-size: 28rpx;
	}
	
	.empty-state .empty-icon {
		font-size: 120rpx;
		margin-bottom: 20rpx;
	}
	
	/* 分割线 */
	.divider {
		height: 1rpx;
		background: #eee;
		margin: 20rpx 0;
	}
</style>
