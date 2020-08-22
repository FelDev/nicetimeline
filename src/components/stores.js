import { writable } from 'svelte/store';

export const description = writable("");
export const title = writable("");
export const changesSaved = writable(false );



// let appState = localStorage.getItem("appState")
// console.log('@appState: ', appState);

// if (appState == null) {
//     appState = {
//         lastTime: 3, // seconds
//         increase: 0,    // seconds
//         dailyIncreaseIsOn: true, // boolean for now, hours eventually?
//         lastSession: null  // JS Date Object
//     }
// 	localStorage.setItem("appState", JSON.stringify(appState))
// } else {
// 	appState = JSON.parse(appState)
// }

// export const store = writable(appState);

// console.log('@appState: ', appState);
// let hhStartTimeInit = 0;
// let mmStartTimeInit = 0;
// let ssStartTimeInit = 3;
// let hhDailyIncreaseInit = 0;
// let mmDailyIncreaseInit = 0;
// let ssDailyIncreaseInit = 5;
// let dailyIncreaseIsOnInit = appState.dailyIncreaseIsOn;

// if (appState.lastTime != null) {
//     if (mustIncrease()) {
//         appState.lastTime += appState.increase
//         let dateObj = new Date(appState.increase * 1000);
//         hhDailyIncreaseInit = dateObj.getUTCHours();
//         mmDailyIncreaseInit = dateObj.getUTCMinutes();
//         ssDailyIncreaseInit = dateObj.getSeconds();
        
//     }
//     let dateObj = new Date(appState.lastTime * 1000);
//     hhStartTimeInit = dateObj.getUTCHours();
//     mmStartTimeInit = dateObj.getUTCMinutes();
//     ssStartTimeInit = dateObj.getSeconds();

// }

// export const hhStartTime = writable(hhStartTimeInit);
// export const mmStartTime = writable(mmStartTimeInit);
// export const ssStartTime = writable(ssStartTimeInit);

// export const hhDailyIncrease = writable(hhDailyIncreaseInit);
// export const mmDailyIncrease = writable(mmDailyIncreaseInit);
// export const ssDailyIncrease = writable(ssDailyIncreaseInit);

// export const timerStarted = writable(false)

// export const dailyIncreaseIsOn = writable(dailyIncreaseIsOnInit)

// export const lastSittingTime = writable(0)

// export const currentScreen = writable("BurgerMenu")


// function mustIncrease() {
//     if (!appState.dailyIncreaseIsOn) {
//         return false;
//     }
//     if ((Date.now() - appState.lastSession) > (1000 * 30 )) { // Hardcoded 30 seconds for now. could be an hour eventually... 1000 * 60 * 60
//         return true;
//     }
//     return false;
// }


// mayyyybe... https://higsch.me/2019/06/22/2019-06-21-svelte-local-storage/

// store.subscribe(val => localStorage.setItem("firstVisit", "false"));

// createWritableStore("needsTuto", "true")

// const createWritableStore = (key, startValue) => {
//     const { subscribe, set } = writable(startValue);
    
//       return {
//         subscribe,
//         set,
//         useLocalStorage: () => {
//             const json = localStorage.getItem(key);
//             if (json) {
//                 set(JSON.parse(json));
//             }
            
//             subscribe(current => {
//                 localStorage.setItem(key, JSON.stringify(current));
//             });
//         }
//     };
//   }
  
//   export const count = createWritableStore('count', 0);