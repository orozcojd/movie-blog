<template>
  <v-container
    class="post-content"
    style="padding: 1em 4em 4em 4em"
    fluid
  >
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        md11
      >
        <div
          class="post-category"
          align="left"
        >
          {{ article.category }}
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
        <v-img
          :src="article.img"
          max-height="600"
          contain
        />
        <br>
        <editor-content
          class="post-body"
          :editor="editor"
        />
        <!-- <p>
      {{ article.body }}
    </p> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
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
			'article'
		]),
		...mapGetters([
			'getArticle'
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
		}
	},
	async mounted () {
		/* later change to - if not found in store fetch */
		let id = this.$route.params.id
		// if article not found in store, fetch it
		if(id){
			let article = this.getArticle(id)
			if(article) {
				// if article set article state to article found in articles array
				this.setSingleArticle(article)
			}
			else {
				// else fetch then set article state
				await this.fetchArticle(id)
			}
		}
		else {
			this.SET_SINGLE_ARTICLE({});
		}
		// this.loaded = true
		this.setContent()
		let viewed = {
			title: this.article.title,
			id: this.article._id,
			img: this.article.img
		}
		this.PUSH_VIEWED(viewed)
	},
	methods: {
		...mapActions([
			'fetchArticle',
			'setSingleArticle'
		]),
		...mapMutations([
			'PUSH_VIEWED',
			'SET_SINGLE_ARTICLE'
		]),
		setContent () {
			this.editor.setContent(this.article.body, true)
		}
	}
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Proza+Libre');
@import url('https://fonts.googleapis.com/css?family=Abel');

@import url('https://fonts.googleapis.com/css?family=Marcellus+SC');
@import url('https://fonts.googleapis.com/css?family=Kreon');
@import url('https://fonts.googleapis.com/css?family=Marcellus');
@import url('https://fonts.googleapis.com/css?family=Lato');
@import url('https://fonts.googleapis.com/css?family=Roboto');
@import url('../../assets/style/tiptap.scss');

/* Remove outline from editor when focused */
* {
  .post-content &:focus{
    outline: none
	}
}

@media only screen and (max-width: 400px) {
	.post-content {
		padding-left: 15px !important;
		padding-right: 15px !important;
	}
	.post-title {
		// font-family: 'Marcellus SC', serif;
		font-size: 1.75rem !important;
		padding-left: 5px !important;
		padding-right: 5px !important;
	}
	// .mb-small {
	// 	margin-bottom: .5em;
	// }
	// .mb-med {
	// 	margin-bottom: 2em;
	// }
	// .post-author {
	// 	margin-bottom: .5em;
	// }
	.post-body {
		font-size: 1.7rem !important;
		// font-family: 'Abel', sans-serif;
	}
}
/* export to file */
.post-title {
  font-family: 'Marcellus SC', serif;
	font-size: 2.75rem;
}
.mb-small {
	margin-bottom: .5em;
}
.mb-med {
	margin-bottom: 2em;
}
.post-author {
	margin-bottom: .5em;
}
.post-body {
	font-size: 2rem;
	font-family: 'Abel', sans-serif;
}

// @import url('../../assets/style/post.css');
</style>
