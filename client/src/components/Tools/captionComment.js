import { Node } from 'tiptap';
import { toggleBlockType, setBlockType, textblockTypeInputRule } from 'tiptap-commands';

export default class captionComment extends Node {
	get name() {
		return 'caption_comment';
	}

	/*
			doc: {content: "paragraph+"},
			paragraph: {
				content: "text*",
				toDOM() { return ["p", {class:"light-contrast img-capt" },0] }
			},
*/
	get schema() {
		return {
			content: 'text*',
			marks: '',
			group: 'block',
			defining: true,
			draggable: false,
			parseDOM: [
				{ tag: 'div', preserveWhitespace: 'full' },
			],
			toDOM: () => ['div', { style: 'text-align: start', class: 'light-contrast img-capt neg-margin-top' }, 0],
		};
	}

	commands({ type, schema }) {
		return () => toggleBlockType(type, schema.nodes.paragraph);
	}

	// keys({ type }) {
	// 	return {
	// 		'Shift-Ctrl-c': setBlockType(type),
	// 	}
	// }
	// inputRules({ type }) {
	// 	return [
	// 		textblockTypeInputRule(/^```$/, type),
	// 	]
	// }
}
