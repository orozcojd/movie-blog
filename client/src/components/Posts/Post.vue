<template>
  <div
    class="post-content"
    style="padding: 4em"
  >
    <h1>{{ article.title }} </h1>
    <br>
    <div align="">
      {{ article.author }}
    </div>
    <v-img
      :src="article.img"
      max-height="400"
      contain
    />
    <br>
    <editor-content
      :editor="editor"
    />
    <!-- <p>
      {{ article.body }}
    </p> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ParagraphAlignmentNode from '@/components/Tools/ParagraphAlignment'
import Iframe from '@/components/Tools/Iframe'
import { Editor, EditorContent} from 'tiptap'
import {
	Blockquote,
	CodeBlock,
	HardBreak,
	Heading,
	OrderedList,
	BulletList,
	ListItem,
	TodoItem,
	TodoList,
	Bold,
	Code,
	Italic,
	Link,
	Strike,
	Underline,
	History,
	Image
} from 'tiptap-extensions'

export default {
	name: 'Posts',
	components: {
		EditorContent
	},
	props: {
	},
	data () {
		return {
			article: {},
			editor: new Editor({
				extensions: [
					new Image(),
					new Blockquote(),
					new CodeBlock(),
					new HardBreak(),
					new Heading({ levels: [1, 2, 3] }),
					new BulletList(),
					new OrderedList(),
					new ListItem(),
					new TodoItem(),
					new TodoList(),
					new Bold(),
					new Code(),
					new Italic(),
					new Link(),
					new Strike(),
					new Underline(),
					new History(),
					new ParagraphAlignmentNode(),
					new Iframe()
				],
				content: ``,
				editable: false,
				dropCursor: {
					color: '#f00',
					width: 5,
				},

			})
		}
	},
	computed: {
		...mapGetters([
			'getArticle'
		])
	},
	mounted () {
		this.article = this.getArticle(this.$route.params.id)
		this.setContent()
	},
	methods: {
		setContent () {
			this.editor.setContent(this.article.body, true)
		}
	}
}
</script>

<style lang="scss">
* {
  .post-content &:focus{
    outline: none
	}
}
</style>
