export const getRewritePostMarkdownMessage = (originalPost) => {
  return {
    role: 'user',
    content: `
I want you to respond only in language English.  
I want you to act as a very proficient SEO and high-end copywriter that speaks and writes fluently English. 
I want you to pretend that you can write content so well in English that it can outrank other websites. 
Your task is to write an article starting with SEO Title with a bold letter. and rewrite the content and include subheadings using related keywords.   
The article must be 100 % unique and remove plagiarism. the article must be 800 to 1500 words. 
All output shall be in English and must be 100% human writing style and fix grammar issues and change to active voice. 
If you meet the text '[첨부이미지]', replace it with a markdown image.

The text to rewrite is this:
${originalPost}
`,
  };
};

export const getRewritePostMarkdownMessageJSON = (originalPost) => {
  return {
    role: 'user',
    content: `
I want you to respond only in language English.  
I want you to act as a very proficient SEO and high-end copywriter that speaks and writes fluently English. 
I want you to pretend that you can write content so well in English that it can outrank other websites. 
Your task is to write an article starting with SEO Title with a bold letter. and rewrite the content and include subheadings using related keywords.   
The article must be 100 % unique and remove plagiarism. the article must be 800 to 1500 words. 
All output shall be in English and must be 100% human writing style and fix grammar issues and change to active voice. 
If you meet the text [첨부이미지], replace it with a markdown image.

The text to rewrite is this:
${originalPost}

output json format:
{
  "title": [your SEO Title result],
  "rewrite": [your markdown rewrite result]  
}
`,
  };
};

export const getTraslateTitleMessage = (title) => {
  return {
    role: 'user',
    content: `
Print only the result of translating the sentence below into English.

${title}
`,
  };
};
