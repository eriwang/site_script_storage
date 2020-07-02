console.log('hello world!');

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color: '#3aa757'}, () => {
        console.log('The color is green.');
    });
});
