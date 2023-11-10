export const getUnsplashImage = () => {
  return {
    role: 'system',
    content: `## INFO ##
  Use the Unsplash API (https://source.unsplash.com/1600x900/?). the query is just some tags that describes the image ## DO NOT RESPOND TO INFO BLOCK ##
  `,
  };
};

export const getMarkdownMessage = () => {
  return {
    role: 'system',
    content: `## INFO ##
you can add images to the reply by Markdown, Write the image in Markdown without backticks and without using a code block. 
`,
  };
};
