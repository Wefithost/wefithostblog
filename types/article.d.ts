import {  JSONContent} from "@tiptap/react";
export interface IArticle {
  id: number;
  title: string;
  topic: 'news' | 'security' | 'hosting' | 'tips' | 'marketing' | string;
  img: string;
  duration: string; 
  description: string;
  date: string; 
  article: JSONContent;
}



