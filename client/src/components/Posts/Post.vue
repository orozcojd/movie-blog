<template>
  <div
    v-if="loaded"
    id="content-post"
    fluid
  >
    <vue-headful
      :title="article.title"
      :description="article.description"
    />
    <card-view>
      <v-layout justify-start>
        <div class="post-card content-font">
          <div
            align="left"
          >
            <a
              class="hover-bold"
              href="#"
              @click.prevent="navigateTo({
                _id: article.realm,
                name: articleRealm
              })"
            >
              <small>
                {{ upperCaseString(articleRealm) }}
              </small>
            </a>
            |
            <a
              class="hover-bold"
              @click="$router.push({
                name: 'about-contributor',
                params: {
                  id: article.contributorId,
                  contributor: article.author.toLowerCase().split(' ').join('-')
                }},
              )"
            >
              <small> 
                {{ article.author }}
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
            class="light-contrast mb-med neg-marg-xs"
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
              v-if="article.tags.length"
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
                  @click.prevent="navigateTo({
                    _id: tag,
                    name: convertTagIdToName(tag)
                  })"
                >{{ upperCaseString(convertTagIdToName(tag)) }}</a>
              </li>
            </ul>
          </small>
        </div>
      </v-layout>
    </card-view>
    <div
      class="after-article"
    />
  </div>
</template>

<script>
import CardView from '@/components/Layouts/CardView'
import { mapState, mapMutations } from 'vuex'
import ParagraphAlignmentNode from '@/components/Tools/ParagraphAlignment'
import Iframe from '@/components/Tools/Iframe'
import { Editor, EditorContent} from 'tiptap'
import captionComment from '@/components/Tools/captionComment'
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
		EditorContent,
		CardView
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
			// article: {},
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
					new captionComment(),
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
		...mapState('posts',['tags']),
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
			return date
		},
		articleRealm() {
			if(this.article.realm)
				return this.convertTagIdToName(this.article.realm)
			return null
		}
	},
	async mounted () {
		await this.setContent()
		this.loaded = true
	},
	methods: {
		...mapMutations('posts', ['PUSH_VIEWED']),
		convertTagIdToName (id) {
			if(this.tags.length){
				const tag = this.tags.find(tag => tag._id === id)
				if(tag)
					return tag.name.trim()
			}
		},
		upperCaseString(str) {
			if(!str)
				return
			let strArr = str.split('-')
			let upperArr = []
			for(let i = 0; i < strArr.length; i++) {
				let str = strArr[i]
				upperArr.push(str.charAt(0).toUpperCase() + str.slice(1))
			}
			return upperArr.join(' ')
		},
		async setContent () {
			await this.editor.clearContent(true)
			await this.editor.setContent(this.article.body, true)
		},
		navigateTo (tag) {
			this.$router.push({
				name: 'tag-view',
				params: {
					tagName: tag.name,
					id: tag._id
				},
			})
		}
	}
}
</script>
<style>
@import url('../../assets/style/poststyle.scss');
@import url('../../assets/style/tiptap.scss');
</style>
<style scoped>
	a {		
  color: black;		
  text-decoration: none;		
}
</style>
