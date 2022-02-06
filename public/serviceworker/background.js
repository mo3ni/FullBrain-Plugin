/*global chrome*/

// /**
//  * On popup window load even Send the response and send window
//  */

const API_KEY = "AIzaSyDnzgVcXqXvt6dVzGXhIu1pkF76HmNq8dI";
const token = "";
// chrome.runtime.onInstalled.addListener(function(details){
//     console.log(details);
//     if(details.reason === "install"){
//         chrome.identity.getAuthToken({interactive: true}, function(token) {
//             console.log(token);
//         });
//     }
// });

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) =>{
        console.log(request);
        // chrome.storage.local.get(['ajs_user_id'], function(items) {
        //     console.log('Settings retrieved', items);
        //   });
        if (request.message === "sendMeURL"){
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (currentTab) => {
                sendResponse({
                    webInfo: JSON.stringify(currentTab[0])
                });
            });
            return true;
        }else if (request.message === "sendUserData"){
            chrome.cookies.get({ url: 'https://www.fullbrain.org', name: 'ajs_user_id' },
            function (cookie) {
                if (cookie) {
                    sendResponse({
                        getUserData: JSON.stringify(cookie)
                    });
                }
                else {
                    console.log('Can\'t get cookie! Check the name!');
                }
            });
            return true;
        }
    }
);

//   https://gilfink.medium.com/building-a-chrome-extension-using-react-c5bfe45aaf36

