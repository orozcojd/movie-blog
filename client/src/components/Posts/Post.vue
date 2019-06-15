<template>
  <div
    v-if="loaded"
    class="post-content"
    fluid
  >
    <vue-headful
      :title="article.title"
      :description="article.description"
    />
    <v-layout justify-center>
      <v-flex
        xs12
        sm10
        md8
        xl6
        offset-md1
      >
        <v-card class="post-card content-font">
          <v-card-text>
            <v-layout justify-start>
              <v-flex
                xs12
                sm10
              >
                <div
                  align="left"
                >
                  <a
                    href="#"
                    @click.prevent="navigateTo({
                      _id: article.realm,
                      name: articleRealm
                    })"
                  >
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
				
                <!-- <br> -->
                <strong>
                  <div
                    align="left"
                    class="mb-small"
                  >
                    <a
                      @click="$router.push({
                        name: 'about-contributor',
                        params: {
                          id: article.contributorId,
                          contributor: article.author.toLowerCase().split(' ').join('-')
                        }},
                      )"
                    >
                      {{ article.author }}
                    </a>
                  </div>
                  <div
                    align="left"
                    class="mb-med light-contrast"
                  >
                    {{ articleDate }}
                  </div>
                </strong>
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
                  class="light-contrast mb-med"
                >
                  <p>
                    {{ article.imgCred }}
                  </p>
                </div>
                <!-- <br> -->
              </v-flex>
            </v-layout>
            <v-layout justify-start>
              <v-flex
                xs12
                sm10
              >
                <editor-content
                  class="post-body content-font"
                  :editor="editor"
                  align="left"
                />
                <strong>
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
                        @click.prevent="navigateTo({
                          _id: tag,
                          name: convertTagIdToName(tag)
                        })"
                      >{{ upperCaseString(convertTagIdToName(tag)) }}</a>
                    </li>
                  </ul>
                </strong>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <div
      class="after-article"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
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
		...mapMutations([
			'PUSH_VIEWED',
		]),
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

<style scoped>
@import url('../../assets/style/poststyle.scss');
</style>
<style>
@import url('../../assets/style/tiptap.scss');
 .content-font {
  font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
}
 blockquote {
  font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
}
.ProseMirror-focused {
	outline: none !important;
}
.post-body img {
  width: 100%;
  height: auto;
}
img {
  margin-bottom: .25em;
}
.mb-xs {
  margin-bottom: .25em;
}
</style>
