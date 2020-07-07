import chrome from 'chrome';

chrome.runtime.onInstalled.addListener(() => {
    console.log('extension installed.');
});
