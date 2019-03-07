import { setBlockType } from 'tiptap-commands'
import { Node } from 'tiptap'

export default class ParagraphNode extends Node {

	get name() {
		return 'paragraph'
	}

	get schema() {
		return {
			attrs: {
				textAlign: {
					default: 'left',
				},
			},
			content: 'inline*',
			group: 'block',
			draggable: false,
			parseDOM: [{
				tag: 'p',
				getAttrs: node => ({
					textAlign: node.style.textAlign,
				}),
			}],
			toDOM: node => ['p', { style: `text-align: ${node.attrs.textAlign}` }, 0],
		}
	}

	command({ type, attrs }) {
		return setBlockType(type, attrs)
	}

}