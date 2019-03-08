import { toggleBlockType, setBlockType } from 'tiptap-commands'
import { Node } from 'tiptap'

export default class FontIncreaseNode extends Node {

	get name() {
		return 'fontincrease'
	}

	get schema() {
		return {
			attrs: {
				fontIncrease: {
					default: 19,
				},
			},
			content: 'inline*',
			group: 'block',
			draggable: false,
			parseDOM: [{
				tag: 'p',
				getAttrs: node => ({
					fontIncrease: node.style.fontIncrease,
				}),
			}],
			toDOM: node => ['p', { style: `font-size: ${node.attrs.fontIncrease}px` }, 0],
		}
	}
	commands({ type, schema }) {
		return attrs => setBlockType(type, schema.nodes.fontincrease, attrs)
	}

}
