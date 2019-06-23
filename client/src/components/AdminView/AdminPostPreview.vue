<template>
  <v-container
    v-if="loaded"
    class="post-content"
    fluid
  >
    <vue-headful
      :title="headTitle"
    />
    <!-- <v-layout justify-center>
      <v-flex
        xs12
        sm10
        xl6
        offset-md1
      >
        <v-card class="post-card">
          <v-card-text>
            <v-layout justify-start>
              <v-flex
                xs12
                sm10
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
              </v-flex>
            </v-layout>
            <v-layout justify-start>
              <v-flex
                xs12
                sm10
                md9
                lg8
              >
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
                      <a>{{ displayTag(tag) }}</a>
                    </li>
                  </ul>
                </strong>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout> -->
    <card-view>
      <v-layout justify-start>
        <v-flex
          xs12
          md11
          xl10
        >
          <div
            align="left"
          >
            <a
              class="hover-bold"
              href="#"
            >
              <small>
                {{ upperCaseString(articleRealm) }}
              </small>
            </a>
            |
            <a
              class="hover-bold"
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
            class="light-contrast mb-med"
          >
            <p>
              {{ article.imgCred }}
            </p>
          </div>
        </v-flex>
      </v-layout>
      <v-layout justify-start>
        <v-flex
          xs12
          md10
          xl9
        >
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
        </v-flex>
      </v-layout>
    </card-view>
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
import CardView from '@/components/Layouts/CardView'
import { mapState, mapActions } from 'vuex'
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
		EditorContent,
		CardView
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
		articleRealm() {
			console.log(this.article)
			return (this.article ? this.convertTagIdToName(this.article.realm._id) : null)
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
		displayTag(tag) {
			return tag._id ? this.upperCaseString(this.convertTagIdToName(tag._id)) : this.upperCaseString(this.convertTagIdToName(tag))
		},
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
			this.$router.push({name: 'admin-edit-post'})
			console.log(this.article)
		}
	}
}
</script>

<style>
	@import url('../../assets/style/poststyle.scss');
	@import url('../../assets/style/tiptap.scss');
</style>
