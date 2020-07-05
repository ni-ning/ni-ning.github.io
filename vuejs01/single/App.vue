<template>
	<div>
		<p>{{greeting}} World!</p>
	</div>
</template>


<script>
	export default {
		data(){
			return {
				greeting: "Hello"
			}
		}
	}
</script>


<style scoped>
	p {
		fond-size: 20px;
		text-align: center;
		color: red;
	}
</style>
