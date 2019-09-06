<template>
  <div class="post-card content-font">
    <div class="load-animation">
      <div class="white-mask realm-right" />
      <h1 class="white-mask title-top" />
      <div class="white-mask title-right" />
      <div class="white-mask title-bottom" />
      <div class="white-mask date-top" />
      <div class="white-mask date-right" />
    </div>
  </div>
</template>

<script>
export default {
	name: 'LoadingPost',
	data () {
		return {
		}
	},
	computed: {

	},
	mounted() {
		
	},
	methods: {
	}
}
</script>

<style>
@import url('../../assets/style/poststyle.scss');
@import url('../../assets/style/tiptap.scss');
</style>
<style scoped>
.white-mask {
  background-color: #ffff;
  position: absolute;
}
.white-mask.realm-right {
  top: 0;
  left: 20%;
  right: 0;
  width: 80%;
  height: 1.7em;

}
.white-mask.title-top {
  width: 100%;
  height: .7em;
  top: -2%;
}
/* .white-mask.title-right {
  width: 40%;
  height: .7em;
  top: -2%;
  left: 20%
} */
.white-mask.title-right {
  width: 20%;
  height: 5.5em;
  top: 11%;
  left: 80%
}
.white-mask.title-bottom {
  top: 45%;
  width: 100%;
  height: 1em;
}
.white-mask.date-top {
  top: 55%;
  width: 100%;
  height: 1em;
}
.white-mask.date-right {
  top: 50%;
  width: 80%;
  height: 1em;
  left: 20%;
  right: 0;
}
.loading-preview {
    background: #fff;
    border: 1px solid;
    border-color: #e5e6e9 #dfe0e4 #d0d1d5;
    border-radius: 3px;
    margin: 0.5em 1em 2em 2em;
    height: 300px
}
@keyframes loadkeyfram{
    0%{
        background-position: -368px 0
    }
    100%{
        background-position: 400px 0
    }
}

.load-animation {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: loadkeyfram;
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #d6cde5, #bdc3e5, #e3e7ee);
    background-size: 800px 104px;
    height: 16em;
    position: relative;
}

</style>
