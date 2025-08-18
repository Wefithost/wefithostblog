import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './style.css';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';

import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
interface ArticleViewerProps {
	content?: JSONContent;
	className?: string;
	editable?: boolean;
}
export default function ArticleViewer({
	content,
	className,
	editable = false,
}: ArticleViewerProps) {
	const extensions = [
		Color.configure({ types: [TextStyle.name, ListItem.name] }),
		//   @ts-expect-error: types unknown
		TextStyle.configure({ types: [ListItem.name] }),
		StarterKit.configure({
			bulletList: {
				keepMarks: true,
				keepAttributes: false,
			},
		}),
		Link.configure({
			openOnClick: true,
			linkOnPaste: true,
			autolink: true,
			HTMLAttributes: {
				target: '_blank',
				rel: 'noopener noreferrer',
				class: 'text-blue-500 underline',
			},
		}),
		Image,
	];

	const editor = useEditor({
		editable: editable, // 🔒 Read-only
		content: content,
		extensions: extensions,
		editorProps: {
			attributes: {
				class: className as string,
			},
		},
		immediatelyRender: false,
	});
	useEffect(() => {
		if (editor && content) {
			editor.commands.setContent(content, false);
		}
	}, [content, editor]);

	if (!editor) return null;

	return <EditorContent editor={editor} />;
}

