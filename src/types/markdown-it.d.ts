declare module 'markdown-it' {
  export interface Options {
    html?: boolean;
    xhtmlOut?: boolean;
    breaks?: boolean;
    linkify?: boolean;
    typographer?: boolean;
    [key: string]: unknown;
  }

  class MarkdownIt {
    constructor(options?: Options);
    render(markdown: string): string;
    use(plugin: unknown): this;
  }

  export default MarkdownIt;
}
declare module '@mdit/plugin-katex';
