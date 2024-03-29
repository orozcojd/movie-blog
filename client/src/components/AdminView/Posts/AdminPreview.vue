<template>
  <v-container
    v-if="loaded"
    class="post-content"
    fluid
  >
    <vue-headful
      :title="headTitle"
    />
    <card-view>
      <v-layout justify-start>
        <div class="post-card content-font">
          <div
            align="left"
          >
            <a
              class="hover-bold"
            >
              <small>
                {{ upperCaseString(realm) }}
              </small>
            </a>
            |
            <a
              class="hover-bold"
            >
              <small> 
                {{ upperCaseString(article.author) }}
              </small>
            </a>
          </div>
          <h1
            class="post-title"
            align="left"
          >
            {{ article.title }}
          </h1>
				
          <small>
            <div
              align="left"
              class="mb-med mt-sm light-contrast"
            >
              Updated {{ articleDate }}
            </div>
          </small>
          <div
            class="mb-xs"
          >
            <v-img
              id="post-img"
              :src="article.img"
              max-height="600"
            />
          </div>
          <div
            class="light-contrast neg-marg-xs mb-med"
          >
            <p>
              {{ article.imgCred }}
            </p>
          </div>
          <editor-content
            class="post-body content-font"
            :editor="editor"
            align="left"
          />
          <small>
            <ul
              v-if="article.tags && article.tags.length"
              align="left"
              class="tag-list"
            >
              <li
                v-for="(tag, index) in article.tags"
                :key="index"
                class="tag"
              >
                <a
                  class="hover-bold"
                >{{ upperCaseString(tag) }}</a>
              </li>
            </ul>
          </small>
        </div>
      </v-layout>
    </card-view>
    <slot />
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import ParagraphAlignmentNode from '@/components/Tools/ParagraphAlignment'
import Iframe from '@/components/Tools/Iframe'
import captionComment from '@/components/Tools/captionComment'
import { Editor, EditorContent } from 'tiptap'
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
		EditorContent,
		CardView: () => import('@/components/Layouts/CardView')
	},
	props: {
		article: {
			type: Object,
			required: true
		}
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
					new captionComment(),
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
		...mapState('posts', ['tags']),

		headTitle() {
			return this.article.title ? `Admin Preview - ${this.article.title}` : 'Admin Create Article - Unsolocited.mp3'
		},
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
		realm() {
			return typeof this.article.realm === 'object' ? this.article.realm.name : this.article.realm
		}

	},
	async mounted() {
		await this.setContent()
		this.loaded = true
	},
	methods: {
		upperCaseString(str) {
			if(str) {
				str = typeof str === 'object' ? str.name : str
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
		}
	}
}
</script>

<style>
	@import url('../../../assets/style/poststyle.scss');
	@import url('../../../assets/style/tiptap.scss');
	.post-title {
			font-family: 'Poppins', sans-serif;
			margin: 0.2em 0;
	}
</style>
