declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare interface Window {
  __APP_ENV__?: Record<string, string>;
}
