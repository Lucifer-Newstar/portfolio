import { createContentOverrides, defaultSiteContent } from '../frontend/src/content/siteContent.js';

const full = JSON.stringify(defaultSiteContent);
const overrides = JSON.stringify(createContentOverrides(defaultSiteContent));

console.log(`full=${Buffer.byteLength(full)}`);
console.log(`overrides=${Buffer.byteLength(overrides)}`);
