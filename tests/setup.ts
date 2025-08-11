
// Import JSDOM
import { JSDOM } from 'jsdom';

// Setup JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost/',
    // Enable canvas support in JSDOM
    pretendToBeVisual: true
});

// Define a simple requestAnimationFrame mock
global.requestAnimationFrame = (cb: FrameRequestCallback): number => {
    return setTimeout(cb, 0);
};

(global as any).document = dom.window.document;
(global as any).window = dom.window;
(global as any).navigator = dom.window.navigator;
