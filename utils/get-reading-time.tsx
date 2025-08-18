import { JSONContent } from '@tiptap/react';

export function getReadingTime(content: JSONContent): number {
	// Convert TipTap JSON to plain text
	function extractText(node: JSONContent): string {
		let text = '';

		if (node.text) text += node.text + ' ';
		if (node.content) {
			for (const child of node.content) {
				text += extractText(child);
			}
		}

		return text;
	}

	const plainText = extractText(content).trim();
	const words = plainText.split(/\s+/).filter(Boolean).length;

	const minutes = Math.ceil(words / 200); // 200 words/min
	return Math.max(2, minutes); // minimum of 1 min
}

