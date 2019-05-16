<template>
  <v-container
    v-if="loaded"
    class="post-content"
    fluid
  >
    <v-layout
      align-center
      justify-center
      class="article-layout"
    >
      <v-flex
        xs12
        md11
      >
        <div
          align="left"
        >
          <a>
            <strong>
              {{ upperCaseString(articleRealm) }}
            </strong>
          </a>
        </div>
        <h1
          class="post-title"
          align="left"
        >
          {{ article.title }}
        </h1>
        <br>
        <strong>
          <div
            align="left"
            class="mb-small"
          >
            <span>Author: </span>
            {{ article.author }}
          </div>
          <div
            align="left"
            class="mb-med"
          >
            {{ articleDate }}
          </div>
        </strong>
        <div
          align="left"
        >
          <v-img
            id="post-img"
            :src="article.img"
            max-height="600"
          />
          <label
            for="post-img"
          >
            {{ article.imgCred }}
          </label>
        </div>
        <br>
        <editor-content
          class="post-body"
          :editor="editor"
          align="left"
        />
        <strong>
          <ul
            v-if="!!article.tags && article.tags.length"
            align="left"
            class="tag-list"
          >
            <li
              v-for="(tag, index) in article.tags"
              :key="index"
              class="tag"
            >
              <a>{{ upperCaseString(convertTagIdToName(tag._id)) }}</a>
            </li>
          </ul>
        </strong>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-btn
        @click="goBack()"
      >
        Back
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
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
	name: 'AdminPostPreview',
	components: {
		EditorContent
	},
	data () {
		return {
			loaded: false,
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
		...mapState([
			'tags',
			'article'
		]),
		articleDate() {
			let date = new Date(this.article.updatedAt).toLocaleString('en-us', 
				{ 
					month: 'long',
					weekday: 'long',
					day: 'numeric',
					year: 'numeric',
					hour: 'numeric',
					minute: 'numeric'
				})
			return (this.article ? date : null)
		},
		articleRealm() {
			return (this.article ? this.convertTagIdToName(this.article) : null)
		}
	},
	async mounted() {
		if(Object.keys(this.article).length === 0 && this.article.constructor === Object) {
			await this.fetchArticle(this.$route.params.id)
		}
		await this.setContent()
		this.loaded = true
	},
	methods: {
		...mapActions([
			'fetchArticle'
		]),
		convertTagIdToName (id) {
			const foundTag = this.tags.find(tag => tag._id === id)
			return (foundTag ? foundTag.name.trim() : null)
		},
		upperCaseString(str) {
			if(str !== null && str !== undefined){
				let strArr = str.split('-')
				let upperArr = []
				for(let i = 0; i < strArr.length; i++) {
					let str = strArr[i]
					upperArr.push(str.charAt(0).toUpperCase() + str.slice(1))
				}
				return upperArr.join(' ')
			}
			return null
		},
		async setContent () {
			await this.editor.clearContent(true)
			await this.editor.setContent(this.article.body, true)
		},
		goBack () {
			this.$router.go(-1)
		}
	}
}
</script>

<style scoped>
  @import url('../../assets/style/poststyle.scss');
</style>
