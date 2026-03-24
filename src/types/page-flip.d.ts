declare module 'page-flip' {
  export class PageFlip {
    constructor(element: HTMLElement, settings: object);
    loadFromHTML(items: NodeList | HTMLElement[]): void;
    on(event: string, callback: (e: unknown) => void): void;
    flip(page: number): void;
    flipPrev(): void;
    flipNext(): void;
    turnToPage(page: number): void;
    destroy(): void;
  }
}
