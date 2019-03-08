<template>
  <div>
    <!-- Add Links -->
    <editor-menu-bubble
      class="menububble"
      :editor="editor"
      @hide="hideLinkMenu"
    >
      <div
        slot-scope="{ commands, isActive, getMarkAttrs, menu }"
        class="menububble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <form
          v-if="linkMenuIsActive"
          class="menububble__form"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)"
        >
          <input
            ref="linkInput"
            v-model="linkUrl"
            class="menububble__input"
            type="text"
            placeholder="https://"
            @keydown.esc="hideLinkMenu"
          >
          <button
            class="menububble__button"
            type="button"
            @click="setLinkUrl(commands.link, null)"
          >
            <v-icon>remove_circle_outline</v-icon>
          </button>
        </form>
        <template v-else>
          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.link() }"
            @click="showLinkMenu(getMarkAttrs('link'))"
          >
            <span>{{ isActive.link() ? 'Update Link' : 'Add Link' }}</span>
            <v-icon>insert_link</v-icon>
          </button>
        </template>
      </div>
    </editor-menu-bubble>
    <!-- End add Links -->

    <editor-menu-bar :editor="editor">
      <div slot-scope="{ commands, isActive }">
        <button
          @click.prevent="showImagePrompt(commands.image)"
        >
          <v-icon>add_photo_alternate</v-icon>
        </button>
        <button
          style="font-size: 18px"
          :class="{ 'highlight': isActive.heading({ level: 1 }) }"
          @click.prevent="commands.heading({ level: 1 })"
        >
          <strong>H1</strong>
        </button>
        <button
          style="font-size: 18px"
          :class="{ 'highlight': isActive.heading({ level: 2 }) }"
          @click.prevent="commands.heading({ level: 2 })"
        >
          <strong>H2</strong>
        </button>
        <button
          style="font-size: 18px"
          :class="{ 'highlight': isActive.heading({ level: 3 }) }"
          @click.prevent="commands.heading({ level: 3 })"
        >
          <strong>H3</strong>
        </button>        
        <button
          :class="{ 'highlight': isActive.bold() }"
          @click.prevent="commands.bold"
        >
          <v-icon>format_bold</v-icon>
        </button>
        <!-- <button
          :class="{ 'highlight': isActive.fontincrease() }"
          @click="commands.fontincrease"
        >
          <v-icon>format_size</v-icon>
        </button>         -->
        <button
          :class="{ 'highlight': isActive.italic() }"
          @click.prevent="commands.italic"
        >
          <v-icon>format_italic</v-icon>
        </button>
        <button
          :class="{ 'highlight': isActive.strike() }"
          @click.prevent="commands.strike"
        >
          <v-icon>strikethrough_s</v-icon>
        </button>
        <button
          :class="{ 'highlight': isActive.underline() }"
          @click.prevent="commands.underline"
        >
          <v-icon>format_underline</v-icon>
        </button>
        <button
          :class="{ 'highlight': isActive.paragraph({ textAlign: 'left' }) }"
          @click.prevent="commands.paragraph({ textAlign: 'left' })"
        >
          <v-icon>format_align_left</v-icon>
        </button>
        <button
          :class="{ 'highlight': isActive.paragraph({ textAlign: 'center' }) }"
          @click.prevent="commands.paragraph({ textAlign: 'center' })"
        >
          <v-icon>format_align_center</v-icon>
        </button>
        <button
          :class="{ 'highlight': isActive.paragraph({ textAlign: 'right' }) }"
          @click.prevent="commands.paragraph({ textAlign: 'right' })"
        >
          <v-icon>format_align_right</v-icon>
        </button>
        <button
          :class="{ 'highlight': isActive.bullet_list() }"
          @click.prevent="commands.bullet_list"
        >
          <v-icon>format_list_bulleted</v-icon>
        </button>
        <button
          :class="{ 'highlight': isActive.ordered_list() }"
          @click.prevent="commands.ordered_list"
        >
          <v-icon>format_list_numbered</v-icon>
        </button>

        <button
          :class="{ 'highlight': isActive.todo_list() }"
          @click.prevent="commands.todo_list"
        >
          <v-icon>list_alt</v-icon>
        </button>
        <button
          :class="{ 'highlight': isActive.blockquote() }"
          @click.prevent="commands.blockquote"
        >
          <v-icon>format_quote</v-icon>
        </button>
        <!-- <button
          :class="{ 'is-active': isActive.link() }"
          @click="showLinkMenu(getMarkAttrs('link'))"
        >
          <span>{{ isActive.link() ? 'Update Link' : 'Add Link' }}</span>
          <v-icon>insert_link</v-icon>
        </button> -->
        <button
          style="font-size: 18px"
          @click.prevent="commands.undo"
        >
          <v-icon>undo</v-icon>
        </button>
        <button
          style="font-size: 18px"
          @click.prevent="commands.redo"
        >
          <v-icon>redo</v-icon>
        </button>                                       
      </div>
    </editor-menu-bar>
    <br>
    <br>
    <editor-content
      class="editor__content"
      :editor="editor"
    />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble, } from 'tiptap'
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
import ParagraphAlignmentNode from './ParagraphAlignment'
// import FontIncreaseNode from './FontIncrease.js'
import { mapActions, mapMutations, mapState } from 'vuex'
import Iframe from './Iframe'


export default {
	components: {
		EditorMenuBar,
		EditorContent,
		EditorMenuBubble,
	},
	data() {
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
					// new FontIncreaseNode()
				],
				autoFocus: true,
				content: ``,
				onUpdate: ({ getHTML }) => {
					// this.json = getJSON()
					this.html = getHTML()
					this.body = this.html
				},
			}),
			// Links data
			json: '',
			html: '',
			linkUrl: null,
			linkMenuIsActive: false,
		}
	},
	computed: {
		...mapState([
			'article'
		]),
		body: {
			get() {
				return this.article.body
			},
			set(value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'body',
					value: value
				})
			}
		},
	},
	mounted() {
		// set content editor on load
		this.setContent()
	},
	methods: {
		...mapActions([
			'updateArticleContent'
		]),
		...mapMutations([
			'UPDATE_ARTICLE_CONTENT'
		]),
		setContent () {
			this.editor.setContent(this.body, true)
		},
		showImagePrompt(command) {
			const src = prompt('Enter the url of your image here')
			if (src !== null) {
				command({ src })
			}
		},
		showLinkMenu(attrs) {
			this.linkUrl = attrs.href
			this.linkMenuIsActive = true
			this.$nextTick(() => {
				this.$refs.linkInput.focus()
			})
		},
		hideLinkMenu() {
			this.linkUrl = null
			this.linkMenuIsActive = false
		},
		setLinkUrl(command, url) {
			command({ href: url })
			this.hideLinkMenu()
			this.editor.focus()
		},
	},
}
</script>

<style lang="scss" >
/* Highlights focused editor component */
  .highlight{
    background-color:pink;
    border-radius: 5px;
  }
/* Limits image size to 400px */
img {
  height: 400px
}
/* To do List */
ul[data-type="todo_list"] {
  padding-left: 0;
}
li[data-type="todo_item"] {
  display: flex;
  flex-direction: row;
}
.todo-checkbox {
  border: 2px solid pink;
  height: 0.9em;
  width: 0.9em;
  box-sizing: border-box;
  margin-right: 10px;
  margin-top: 0.3rem;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  border-radius: 0.2em;
  background-color: transparent;
  transition: 0.4s background;
}
.todo-content {
  flex: 1;
}
li[data-done="true"] {
  text-decoration: line-through;
}
li[data-done="true"] .todo-checkbox {
  background-color: pink;
}
li[data-done="false"] {
  text-decoration: none;
}

/* End to-do list */

/* iframe */
.iframe {
  &__embed {
    width: 50%;
    width: 100%;
    height: 20rem;
    border: 0;
  }
  &__input {
    display: block;
    width: 100%;
    font: inherit;
    border: 0;
    border-radius: 5px;
    background-color: rgba(black, 0.1);
    padding: 0.3rem 0.5rem;
  }
}
/* End iframe */
</style>
