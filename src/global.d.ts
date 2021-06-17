declare module "*.xml" {
  const content: any;
  export default content;
}
declare module "*.json" {
  const content: any;
  export default content;
}

declare const runtime: any
declare const colors: any
declare const ui: any
declare const Packages: any
declare const $plugins: any
declare const $debug: any
declare function importClass(params: any)
declare function shell(params: string, root: boolean = false)
declare const com: any
declare const AnchorGraphicHelper: any