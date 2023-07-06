var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import axios from "axios";
export var isAuthenticated = function (uid, link) { return uid ? link : "/login/?from=".concat(link); };
export var addBodyClass = function (className) {
    document.body.classList.add(className);
};
export var removeBodyClass = function (className) {
    document.body.classList.remove(className);
};
export var replaceBodyClass = function (classToAdd, classToRemove) {
    document.body.classList.add(classToAdd);
    document.body.classList.remove(classToRemove);
};
export var addAndRemoveBodyClass = function (classToAdd) {
    if (document.body.classList.contains(classToAdd)) {
        document.body.classList.remove(classToAdd);
    }
    else {
        document.body.classList.add(classToAdd);
    }
};
export var getStorage = function (item) {
    return localStorage.getItem(item);
};
export var setStorage = function (item, value) {
    return localStorage.setItem(item, value);
};
export var addLocalStorageArrayWithLimit = function (item, newItems, limit) {
    var isItem = JSON.parse(localStorage.getItem(item));
    if (!Array.isArray(isItem)) {
        localStorage.setItem(item, []);
    }
    if (isItem) {
        var store = JSON.parse(localStorage.getItem(item));
        if (store.length >= limit) {
            if (store.length > limit) {
                store.splice(0, limit - newItems.length);
                return localStorage.setItem(item, JSON.stringify(__spreadArray(__spreadArray([], store, true), newItems, true)));
            }
            else {
                var diff = newItems.length - store.length;
                var newStore = store.splice(diff, store.length - 1);
                return localStorage.setItem(item, JSON.stringify(__spreadArray(__spreadArray([], newStore, true), newItems, true)));
            }
        }
        else {
            return localStorage.setItem(item, JSON.stringify(__spreadArray(__spreadArray([], store, true), newItems, true)));
        }
    }
    else {
        return localStorage.setItem(item, JSON.stringify(newItems));
    }
};
export var randomID = function (max) {
    var allCapsAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    var allLowerAlpha = "abcdefghijklmnopqrstuvwxyz".split('');
    var allUniqueChars = "~!@#$%^&*()_+-=[]\\{}|;:,./<>?".split('');
    var allNumbers = "0123456789".split('');
    var baseline = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], allCapsAlpha, true), allNumbers, true), allLowerAlpha, true), allUniqueChars, true);
    var generator = function (base, len) {
        return __spreadArray([], Array(len), true).map(function (i) { return base[Math.random() * base.length | 0]; })
            .join('');
    };
    return generator(baseline, max);
};
export var randomNbLtID = function (max) {
    var allLowerAlpha = "abcdefghijklmnopqrstuvwxyz".split('');
    var allNumbers = "0123456789".split('');
    var baseline = __spreadArray(__spreadArray([], allNumbers, true), allLowerAlpha, true);
    var generator = function (base, len) {
        return __spreadArray([], Array(len), true).map(function (i) { return base[Math.random() * base.length | 0]; })
            .join('');
    };
    return generator(baseline, max);
};
export var randomNbID = function (max) {
    var allNumbers = "0123456789".split('');
    var baseline = __spreadArray([], allNumbers, true);
    var generator = function (base, len) {
        return __spreadArray([], Array(len), true).map(function (i) { return base[Math.random() * base.length | 0]; })
            .join('');
    };
    return generator(baseline, max);
};
export var generateStrongPassword = function (max) {
    var allCapsAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    var allLowerAlpha = "abcdefghijklmnopqrstuvwxyz".split('');
    var allUniqueChars = "~!@#$%^&*()_+-=[]\\{}|;:,./<>?".split('');
    var allNumbers = "0123456789".split('');
    var generator = function (base, len) {
        return __spreadArray([], Array(len), true).map(function (i) { return base[Math.random() * base.length | 0]; })
            .join('');
    };
    var charsTypes = [__spreadArray([], allCapsAlpha, true), __spreadArray([], allLowerAlpha, true), __spreadArray([], allUniqueChars, true), __spreadArray([], allNumbers, true)];
    var password = '';
    charsTypes.map(function (charstype) {
        return password += generator(charstype, 50);
    });
    var passwordArr = password.split('');
    var randomized = shuffleArray(passwordArr);
    return generator(randomized, max);
};
export var removeSpecialChars = function (string) {
    var noSpecialChars = string.replace(/[^\w ]/g, ' ');
    return noSpecialChars;
};
export var sanitize = function (string) {
    var sanitized = string.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
    return sanitized;
};
export var convertStringToRegexp = function (text) {
    var regexp = '';
    var textNormalized = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        .toLowerCase();
    regexp = textNormalized
        .replace(/a/g, '[a,á,à,ä,â,ã]')
        .replace(/e/g, '[e,é,ë,è,ê]')
        .replace(/i/g, '[i,í,ï,ì,î]')
        .replace(/o/g, '[o,ó,ö,ò,õ,ô]')
        .replace(/u/g, '[u,ü,ú,ù,û]')
        .replace(/c/g, '[c,ç]')
        .replace(/n/g, '[n,ñ]')
        .replace(/[ªº°]/g, '[ªº°]')
        .replace(/-|\s/g, '[ -]');
    return new RegExp(regexp, 'i');
};
export var isPasswordStrong = function (password) {
    var passwordRegexp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/);
    return passwordRegexp.test(password);
};
export var isEmailValid = function (email) {
    var regexp = new RegExp(/^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i);
    if (regexp.test(email))
        return true;
    else
        return false;
};
export var isPhoneValid = function (phone) {
    var regexp = new RegExp(/^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/);
    if (regexp.test(phone))
        return true;
    else
        return false;
};
export var isValidName = function (string) {
    var regexp = new RegExp(/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/);
    if (regexp.test(string))
        return true;
    else
        return false;
};
export var isValidPathname = function (string) {
    var regexp = new RegExp(/^[0-9a-z-/]+$/);
    if (regexp.test(string))
        return true;
    else
        return false;
};
export var isValidPostcode = function (string) {
    var regexp = new RegExp(/^[0-9]{5}$/);
    if (regexp.test(string))
        return true;
    else
        return false;
};
export var onlyLettersNumbersAndDashes = function (string) {
    var regexp = new RegExp(/^(\w|-)+$/);
    if (regexp.test(string))
        return true;
    else
        return false;
};
export var containsAnyLetters = function (string) {
    var regexp = new RegExp(/[a-zA-Z]/);
    if (regexp.test(string))
        return true;
    else
        return false;
};
export var onlyLetters = function (string) {
    var regexp = new RegExp(/^[a-zA-Z]*$/);
    if (regexp.test(string))
        return true;
    else
        return false;
};
export var containsAnyNumbers = function (string) {
    var regexp = new RegExp(/[0-9]/);
    if (regexp.test(string))
        return true;
    else
        return false;
};
export var onlyNumbers = function (string) {
    var regexp = new RegExp(/^[0-9]*$/);
    if (regexp.test(string))
        return true;
    else
        return false;
};
export var containsSpecialChars = function (string) {
    var regexp = new RegExp(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/);
    if (regexp.test(string))
        return true;
    else
        return false;
};
export var replaceStr = function (str, char) {
    var string = str.replace(char, '');
    return string;
};
export var replaceChar = function (str, char, newChar) {
    var string = str.replace(char, newChar);
    return string;
};
export var doesStringIncludes = function (string, elements) {
    var isElement = false;
    for (var i = 0; i < elements.length; i++) {
        if (string.indexOf(elements[i]) !== -1) {
            isElement = true;
            break;
        }
    }
    return isElement;
};
export var findFirstWordContained = function (string, elements) {
    var isElement;
    for (var i = 0; i < elements.length; i++) {
        if (string.indexOf(elements[i]) !== -1) {
            isElement = elements[i];
            break;
        }
    }
    return isElement;
};
export var randomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
export var checkTheme = function (light, dark) {
    var theme = localStorage.getItem("theme");
    if (theme !== null && theme === "light")
        return light;
    else
        return dark;
};
export var dateParser = function (num) {
    var options = { year: "numeric", month: "short", day: "2-digit" };
    var timestamp = Date.parse(num);
    var date = new Date(timestamp).toLocaleDateString('fr-FR', options);
    return date.toString();
};
export var dateParserWithoutYear = function (num) {
    var options = { month: "short", day: "2-digit" };
    var timestamp = Date.parse(num);
    var date = new Date(timestamp).toLocaleDateString('fr-FR', options);
    return date.toString();
};
export var numericDateParser = function (num) {
    var options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    var timestamp = Date.parse(num);
    var date = new Date(timestamp).toLocaleDateString('fr-FR', options);
    return date.toString();
};
export var ISOtoNavigatorFormat = function (date) {
    return date.substring(0, 10);
};
export var diffBetweenDates = function (first, second) {
    var date1 = new Date(first);
    var date2 = new Date(second);
    var diffTime = Math.abs(date2 - date1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
export var diffBetweenDatesNegativeIfLess = function (first, second) {
    return Math.round((new Date(second) - new Date(first)) / (1000 * 60 * 60 * 24));
};
export function timeFormat(number) {
    var duration = Math.floor(number);
    var h = Math.floor(duration / 3600);
    var m = Math.floor((duration - h * 3600) / 60);
    var s = duration % 60;
    var H = h === 0 ? '' : "".concat(h, ":");
    var M = m < 10 ? "0".concat(m, ":") : "".concat(m, ":");
    var S = s < 10 ? "0".concat(s) : "".concat(s);
    return H + M + S;
}
export var getHourOnly = function (date) {
    var hours = date.getUTCHours();
    var minutes = date.getMinutes();
    return (1 + ((hours - 1))) + "h" + minutes.toString().padStart(2, "0");
};
export var getHoursDiff = function (prev, current) {
    var hourDiff = new Date(current.createdAt) - new Date(prev.createdAt);
    var prevTimeDiff = (hourDiff % 86400000) / 3600000;
    return prevTimeDiff;
};
export function addOneDay(date) {
    var newDate = new Date(date);
    return new Date(newDate.setDate(newDate.getDate() + 1));
}
export var keepNewDateOnly = function (arrayToMap) {
    var array = [];
    arrayToMap.map(function (element, key) {
        return (array = __spreadArray(__spreadArray([], array, true), [{
                index: key,
                date: element.date.substring(0, 10)
            }], false));
    });
    var filteredArray = [];
    array.filter(function (item) {
        var i = filteredArray.findIndex(function (element) { return (element.date === item.date); });
        if (i <= -1) {
            filteredArray.push(item);
        }
        return null;
    });
    return filteredArray;
};
export var convertToLocalDate = function (date) {
    var localDate = date.toLocaleDateString('fr-FR').split('/').reverse().join('-');
    return localDate;
};
export var bySelectedDate = function (array, date) {
    var localDate = date.toLocaleDateString('fr-FR').split('/').reverse().join('-');
    return array.filter(function (element) { return element.date.substring(0, 10) === localDate; });
};
export var thisDay = function (array) {
    return array.filter(function (element) { return element.date.substring(0, 10) === new Date().toISOString().substring(0, 10); });
};
export var lastDay = function (array) {
    return array.filter(function (element) { return element.date.substring(0, 10) === new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().substring(0, 10); });
};
export var timeBetween = function (array, days) {
    var currentDate = new Date();
    var currentDateTime = currentDate.getTime();
    var last30DaysDate = new Date(currentDate.setDate(currentDate.getDate() - days));
    var last30DaysDateTime = last30DaysDate.getTime();
    return array.filter(function (element) {
        var elementDateTime = new Date(element.date).getTime();
        if (elementDateTime <= currentDateTime && elementDateTime > last30DaysDateTime) {
            return true;
        }
        return false;
    }).sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
};
export var convertObjToArr = function (object) {
    var array = Object.entries(object).map(function (_a) {
        var key = _a[0], value = _a[1];
        return (__assign({ key: key }, value));
    });
    return array;
};
export var addItemInArray = function (array, item) {
    return __spreadArray(__spreadArray([], array, true), [item], false);
};
export var addOrRemoveItem = function (array, item, key) {
    if (array.includes(item)) {
        var arr = __spreadArray([], array, true);
        arr.splice(key, 1);
        return arr;
    }
    else {
        return __spreadArray(__spreadArray([], array, true), [item], false);
    }
};
export var deleteItemFromArray = function (array, key) {
    var arr = __spreadArray([], array, true);
    arr.splice(key, 1);
    return arr;
};
export var doesArrayIncludes = function (array, elements) {
    array.filter(function (el) { return elements.some(function (e) { return e === el; }); });
};
export var doesAllArraysInElementContainValues = function (element) {
    var state = false;
    if (typeof element === 'object') {
        for (var i = 0; i < Object.keys(element).length; i++) {
            if (Object.values(element)[i].length === 0) {
                state = false;
                break;
            }
            else if (i === Object.keys(element).length - 1) {
                state = true;
                break;
            }
        }
    }
    else if (Array.isArray(element)) {
        for (var i = 0; i < element.length; i++) {
            if (element[i].length === 0) {
                state = false;
                break;
            }
            else if (i === element.length - 1) {
                state = true;
                break;
            }
        }
    }
    return state;
};
export var doesAtLeastOneArrayInElementContainValues = function (element) {
    var state = false;
    if (typeof element === 'object') {
        for (var i = 0; i < Object.keys(element).length; i++) {
            if (Object.values(element)[i].length > 0) {
                state = true;
                break;
            }
            else if (i === Object.keys(element).length - 1) {
                state = false;
                break;
            }
        }
    }
    else if (Array.isArray(element)) {
        for (var i = 0; i < element.length; i++) {
            if (element[i].length > 0) {
                state = true;
                break;
            }
            else if (i === element.length - 1) {
                state = false;
                break;
            }
        }
    }
    return state;
};
export var keepUniqueObjectsOnlyBasedOnValue = function (array, props) {
    return __spreadArray([], new Map(array.map(function (item) { return [item[props], item]; })).values(), true);
};
export var sortByAlphabetical = function (array, property) {
    array.sort(function (a, b) {
        if (a[property].toLowerCase() < b[property].toLowerCase()) {
            return -1;
        }
        if (a[property].toLowerCase() > b[property].toLowerCase()) {
            return 1;
        }
        return 0;
    });
    return array;
};
export var randomItem = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};
export var randomizedArrayNoRepeats = function (array) {
    var copy = array.slice(0);
    return function () {
        if (copy.length < 1) {
            copy = array.slice(0);
        }
        var index = Math.floor(Math.random() * copy.length);
        var item = copy[index];
        copy.splice(index, 1);
        return item;
    };
};
export var randomColor = randomizedArrayNoRepeats(['blue', 'light-blue', 'turquoise', 'green', 'purple-light', 'red-light', 'yellow', 'orange']);
export var randomBgColor = randomizedArrayNoRepeats(['xbg-blue', 'xbg-light-blue', 'xbg-turquoise', 'xbg-green', 'xbg-purple-light', 'xbg-red-light', 'xbg-orange']);
export var randomBgAndColor = randomizedArrayNoRepeats(['blue xbg-blue', 'light-blue xbg-light-blue', 'turquoise xbg-turquoise', 'green xbg-green', 'purple-light xbg-purple-light', 'red-light xbg-red-light', 'orange xbg-orange']);
export var reverseArray = function (array) {
    return array.map(array.pop, __spreadArray([], array, true));
};
export function divideArrayIntoParts(array, parts) {
    var copy = __spreadArray([], array, true);
    var result = [];
    for (var i = parts; i > 0; i--) {
        result.push(copy.splice(0, Math.ceil(copy.length / i)));
    }
    return result;
}
export function divideArrayIntoSizedParts(array, size) {
    var copy = __spreadArray([], array, true);
    var result = [];
    for (var i = 0; i < copy.length; i += size) {
        result.push(copy.slice(i, i + size));
    }
    return result;
}
export function multiplyArray(array, num) {
    var newArr = [];
    for (var i = 0; i < num; [i++].push.apply(newArr, array))
        ;
    return newArr;
}
export var shuffleArray = function (array) {
    var copy = __spreadArray([], array, true);
    for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }
    return copy;
};
export var groupBy = function (array, parameter) {
    var group = array.reduce(function (r, a) {
        r[a[parameter]] = __spreadArray(__spreadArray([], r[a.id] || [], true), [a], false);
        return r;
    }, {});
    return Object.values(group);
};
export var groupeByAlphabeticalOrder = function (array, parameter) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var sortedArr = {};
    alphabet.map(function (letter, i) {
        return array.reduce(function (a, s) { return sortedArr[letter] = s[parameter].toLowerCase().startsWith(letter.toLowerCase()) ? __spreadArray(__spreadArray([], a, true), [s], false) : a; }, []);
    });
    sortedArr['#'] = array.reduce(function (a, s) { return /^\d/.test(s[parameter]) ? __spreadArray(__spreadArray([], a, true), [s], false) : a; }, []);
    sortedArr['/'] = array.reduce(function (a, s) { return !/^[A-Za-z0-9]/.test(s[parameter]) ? __spreadArray(__spreadArray([], a, true), [s], false) : a; }, []);
    return sortedArr;
};
export var checkIfIsHTML = function (string) {
    var regexp = new RegExp(/<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i);
    if (regexp.test(string))
        return true;
    else
        return false;
};
export var removeHTMLMarkers = function (html) {
    var regex = /(<([^>]+)>)/ig;
    return html.replace(regex, '');
};
export var stringToCharSet = function (str) {
    var buf = [];
    for (var i = str.length - 1; i >= 0; i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
};
export var charSetToChar = function (str) {
    var txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
};
export var isEmpty = function (value) {
    return (value === undefined
        || value === null
        || (typeof value === "object" && Object.keys(value).length === 0)
        || (typeof value === "string" && value.trim().length === 0)
        || (typeof value === "number")
        || (value instanceof Array && value.length === 0));
};
export var fullImage = function (img) {
    return ({
        backgroundImage: "url(".concat(img, ")"),
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover"
    });
};
export var isImage = function (file) {
    var types = ['image/jpg', 'image/jpeg', 'image/bmp', 'image/gif', 'image/png', 'image/svg+xml'];
    return types.some(function (el) { return file.type === el; });
};
export var isVideo = function (file) {
    var types = ['video/mp4', 'video/webm', 'video/x-m4v', 'video/quicktime'];
    return types.some(function (el) { return file.type === el; });
};
export var isFile = function (file) {
    var types = [
        '.7z', '.ade', '.mde', '.adp', '.apk', '.appx', '.appxbundle', '.aspx', '.bat',
        '.com', '.dll', '.exe', '.msi', '.cab', '.cmd', '.cpl', '.dmg', '.gz', '.hta',
        '.ins', '.ipa', '.iso', '.isp', '.jar', '.js', '.jse', '.jsp', '.lib', '.lnk',
        '.msc', '.msix', '.msixbundle', '.msp', '.mst', '.nsh', '.pif', '.ps1', '.scr',
        '.sct', '.wsc', '.shb', '.sys', '.vb', '.vbe', '.vbs', '.vxd', '.wsf', '.wsh', '.tar'
    ];
    return !types.some(function (el) { return file.name.endsWith(el); });
};
export var isAudioFile = function (file) {
    var types = ['.wav', '.ogg', '.mp3', '.flac', '.aiff', '.wma', '.m4a'];
    return !types.some(function (el) { return file.name.endsWith(el); });
};
export var isURL = function (str) {
    var regexp = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
    if (regexp.test(str)) {
        return true;
    }
    else
        return false;
};
export var isURLInText = function (text) {
    var regexp = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+");
    if (regexp.test(text)) {
        return true;
    }
    else
        return false;
};
export var returnURLsInText = function (text) {
    var regexp = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+");
    var txt = text;
    var arr = [];
    while (regexp.test(txt)) {
        var matched = regexp.exec(txt)[0];
        arr.push(matched);
        txt = txt.replace(matched, '');
    }
    return arr;
};
export var isEmbeddable = function (file) {
    var types = ['text/html'];
    return !types.some(function (el) { return file.type === el; });
};
export var addActive = function (state) {
    if (state)
        return 'active';
    else
        return 'unactive';
};
export var addClass = function (state, classe) {
    if (state)
        return classe;
    else
        return 'un' + classe;
};
export var addClassList = function (element, classname) {
    Object.values(element.children).forEach(function (e) {
        e.classList.add(classname);
        if (e.children.length > 0)
            addClassList(e);
    });
};
export var reduceString = function (string, maxLength) {
    if (string.length >= maxLength) {
        if (string.substring((maxLength - 1), maxLength) === " ") {
            var cleanSpaces = string.replace(string.substring((maxLength - 1), maxLength), "");
            string = cleanSpaces.substring(0, maxLength) + "...";
        }
        return string.substring(0, maxLength) + "...";
    }
    else
        return string;
};
export var getDifference = function (one, two) {
    return "+" + (two - one);
};
export var convertStringToURL = function (str) {
    var URL = str.toLowerCase();
    URL = removeAccents(URL);
    URL = URL.charAt(0).toLowerCase() + URL.slice(1);
    URL = URL.replace(/[^\w ]/g, " ");
    URL = URL.replace(/ +/g, " ");
    URL = URL.trim();
    URL = URL.replace(/ /g, "-");
    return URL;
};
export var handleEnterKey = function (event, handler) {
    if (event.key === 'Enter') {
        return handler();
    }
    else
        return;
};
export var geoJSONStructure = function (props) {
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": props
                }
            }
        ]
    };
};
export function getGeoJSONBounds(gj) {
    var coords, bbox;
    if (!gj.hasOwnProperty('type'))
        return;
    coords = getCoordinatesDump(gj);
    bbox = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY,];
    return coords.reduce(function (prev, coord) {
        return [
            Math.min(coord[0], prev[0]),
            Math.min(coord[1], prev[1]),
            Math.max(coord[0], prev[2]),
            Math.max(coord[1], prev[3])
        ];
    }, bbox);
}
export function getCoordinatesDump(gj) {
    var coords;
    if (gj.type === 'Point') {
        coords = [gj.coordinates];
    }
    else if (gj.type === 'LineString' || gj.type === 'MultiPoint') {
        coords = gj.coordinates;
    }
    else if (gj.type === 'Polygon' || gj.type === 'MultiLineString') {
        coords = gj.coordinates.reduce(function (dump, part) {
            return dump.concat(part);
        }, []);
    }
    else if (gj.type === 'MultiPolygon') {
        coords = gj.coordinates.reduce(function (dump, poly) {
            return dump.concat(poly.reduce(function (points, part) {
                return points.concat(part);
            }, []));
        }, []);
    }
    else if (gj.type === 'Feature') {
        coords = getCoordinatesDump(gj.geometry);
    }
    else if (gj.type === 'GeometryCollection') {
        coords = gj.geometries.reduce(function (dump, g) {
            return dump.concat(getCoordinatesDump(g));
        }, []);
    }
    else if (gj.type === 'FeatureCollection') {
        coords = gj.features.reduce(function (dump, f) {
            return dump.concat(getCoordinatesDump(f));
        }, []);
    }
    return coords;
}
export var geolocToFloat = function (string) {
    var lat = string.substr(0, string.indexOf(','));
    var lon = string.substr(string.indexOf(',') + 1, string.length);
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    return [lat, lon];
};
export var download = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, axios({
                    url: file.url,
                    method: 'GET',
                    responseType: 'blob'
                })
                    .then(function (res) {
                    var link = document.createElement('a');
                    link.href = URL.createObjectURL(new Blob([res.data]));
                    link.setAttribute('download', file.name);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
export var highlightSearchResults = function (query, classname) {
    var results = document.getElementsByClassName(classname);
    var regex = new RegExp(query, 'i');
    for (var i = 0; i < results.length; i++) {
        results[i].innerHTML = results[i].innerText.replace(regex, function (match) { return "<span class=\"hightlight\">".concat(match, "</span>"); });
    }
};
var characterMap = {
    "À": "A",
    "Á": "A",
    "Â": "A",
    "Ã": "A",
    "Ä": "A",
    "Å": "A",
    "Ấ": "A",
    "Ắ": "A",
    "Ẳ": "A",
    "Ẵ": "A",
    "Ặ": "A",
    "Æ": "AE",
    "Ầ": "A",
    "Ằ": "A",
    "Ȃ": "A",
    "Ç": "C",
    "Ḉ": "C",
    "È": "E",
    "É": "E",
    "Ê": "E",
    "Ë": "E",
    "Ế": "E",
    "Ḗ": "E",
    "Ề": "E",
    "Ḕ": "E",
    "Ḝ": "E",
    "Ȇ": "E",
    "Ì": "I",
    "Í": "I",
    "Î": "I",
    "Ï": "I",
    "Ḯ": "I",
    "Ȋ": "I",
    "Ð": "D",
    "Ñ": "N",
    "Ò": "O",
    "Ó": "O",
    "Ô": "O",
    "Õ": "O",
    "Ö": "O",
    "Ø": "O",
    "Ố": "O",
    "Ṍ": "O",
    "Ṓ": "O",
    "Ȏ": "O",
    "Ù": "U",
    "Ú": "U",
    "Û": "U",
    "Ü": "U",
    "Ý": "Y",
    "à": "a",
    "á": "a",
    "â": "a",
    "ã": "a",
    "ä": "a",
    "å": "a",
    "ấ": "a",
    "ắ": "a",
    "ẳ": "a",
    "ẵ": "a",
    "ặ": "a",
    "æ": "ae",
    "ầ": "a",
    "ằ": "a",
    "ȃ": "a",
    "ç": "c",
    "ḉ": "c",
    "è": "e",
    "é": "e",
    "ê": "e",
    "ë": "e",
    "ế": "e",
    "ḗ": "e",
    "ề": "e",
    "ḕ": "e",
    "ḝ": "e",
    "ȇ": "e",
    "ì": "i",
    "í": "i",
    "î": "i",
    "ï": "i",
    "ḯ": "i",
    "ȋ": "i",
    "ð": "d",
    "ñ": "n",
    "ò": "o",
    "ó": "o",
    "ô": "o",
    "õ": "o",
    "ö": "o",
    "ø": "o",
    "ố": "o",
    "ṍ": "o",
    "ṓ": "o",
    "ȏ": "o",
    "ù": "u",
    "ú": "u",
    "û": "u",
    "ü": "u",
    "ý": "y",
    "ÿ": "y",
    "Ā": "A",
    "ā": "a",
    "Ă": "A",
    "ă": "a",
    "Ą": "A",
    "ą": "a",
    "Ć": "C",
    "ć": "c",
    "Ĉ": "C",
    "ĉ": "c",
    "Ċ": "C",
    "ċ": "c",
    "Č": "C",
    "č": "c",
    "C̆": "C",
    "c̆": "c",
    "Ď": "D",
    "ď": "d",
    "Đ": "D",
    "đ": "d",
    "Ē": "E",
    "ē": "e",
    "Ĕ": "E",
    "ĕ": "e",
    "Ė": "E",
    "ė": "e",
    "Ę": "E",
    "ę": "e",
    "Ě": "E",
    "ě": "e",
    "Ĝ": "G",
    "Ǵ": "G",
    "ĝ": "g",
    "ǵ": "g",
    "Ğ": "G",
    "ğ": "g",
    "Ġ": "G",
    "ġ": "g",
    "Ģ": "G",
    "ģ": "g",
    "Ĥ": "H",
    "ĥ": "h",
    "Ħ": "H",
    "ħ": "h",
    "Ḫ": "H",
    "ḫ": "h",
    "Ĩ": "I",
    "ĩ": "i",
    "Ī": "I",
    "ī": "i",
    "Ĭ": "I",
    "ĭ": "i",
    "Į": "I",
    "į": "i",
    "İ": "I",
    "ı": "i",
    "Ĳ": "IJ",
    "ĳ": "ij",
    "Ĵ": "J",
    "ĵ": "j",
    "Ķ": "K",
    "ķ": "k",
    "Ḱ": "K",
    "ḱ": "k",
    "K̆": "K",
    "k̆": "k",
    "Ĺ": "L",
    "ĺ": "l",
    "Ļ": "L",
    "ļ": "l",
    "Ľ": "L",
    "ľ": "l",
    "Ŀ": "L",
    "ŀ": "l",
    "Ł": "l",
    "ł": "l",
    "Ḿ": "M",
    "ḿ": "m",
    "M̆": "M",
    "m̆": "m",
    "Ń": "N",
    "ń": "n",
    "Ņ": "N",
    "ņ": "n",
    "Ň": "N",
    "ň": "n",
    "ŉ": "n",
    "N̆": "N",
    "n̆": "n",
    "Ō": "O",
    "ō": "o",
    "Ŏ": "O",
    "ŏ": "o",
    "Ő": "O",
    "ő": "o",
    "Œ": "OE",
    "œ": "oe",
    "P̆": "P",
    "p̆": "p",
    "Ŕ": "R",
    "ŕ": "r",
    "Ŗ": "R",
    "ŗ": "r",
    "Ř": "R",
    "ř": "r",
    "R̆": "R",
    "r̆": "r",
    "Ȓ": "R",
    "ȓ": "r",
    "Ś": "S",
    "ś": "s",
    "Ŝ": "S",
    "ŝ": "s",
    "Ş": "S",
    "Ș": "S",
    "ș": "s",
    "ş": "s",
    "Š": "S",
    "š": "s",
    "Ţ": "T",
    "ţ": "t",
    "ț": "t",
    "Ț": "T",
    "Ť": "T",
    "ť": "t",
    "Ŧ": "T",
    "ŧ": "t",
    "T̆": "T",
    "t̆": "t",
    "Ũ": "U",
    "ũ": "u",
    "Ū": "U",
    "ū": "u",
    "Ŭ": "U",
    "ŭ": "u",
    "Ů": "U",
    "ů": "u",
    "Ű": "U",
    "ű": "u",
    "Ų": "U",
    "ų": "u",
    "Ȗ": "U",
    "ȗ": "u",
    "V̆": "V",
    "v̆": "v",
    "Ŵ": "W",
    "ŵ": "w",
    "Ẃ": "W",
    "ẃ": "w",
    "X̆": "X",
    "x̆": "x",
    "Ŷ": "Y",
    "ŷ": "y",
    "Ÿ": "Y",
    "Y̆": "Y",
    "y̆": "y",
    "Ź": "Z",
    "ź": "z",
    "Ż": "Z",
    "ż": "z",
    "Ž": "Z",
    "ž": "z",
    "ſ": "s",
    "ƒ": "f",
    "Ơ": "O",
    "ơ": "o",
    "Ư": "U",
    "ư": "u",
    "Ǎ": "A",
    "ǎ": "a",
    "Ǐ": "I",
    "ǐ": "i",
    "Ǒ": "O",
    "ǒ": "o",
    "Ǔ": "U",
    "ǔ": "u",
    "Ǖ": "U",
    "ǖ": "u",
    "Ǘ": "U",
    "ǘ": "u",
    "Ǚ": "U",
    "ǚ": "u",
    "Ǜ": "U",
    "ǜ": "u",
    "Ứ": "U",
    "ứ": "u",
    "Ṹ": "U",
    "ṹ": "u",
    "Ǻ": "A",
    "ǻ": "a",
    "Ǽ": "AE",
    "ǽ": "ae",
    "Ǿ": "O",
    "ǿ": "o",
    "Þ": "TH",
    "þ": "th",
    "Ṕ": "P",
    "ṕ": "p",
    "Ṥ": "S",
    "ṥ": "s",
    "X́": "X",
    "x́": "x",
    "Ѓ": "Г",
    "ѓ": "г",
    "Ќ": "К",
    "ќ": "к",
    "A̋": "A",
    "a̋": "a",
    "E̋": "E",
    "e̋": "e",
    "I̋": "I",
    "i̋": "i",
    "Ǹ": "N",
    "ǹ": "n",
    "Ồ": "O",
    "ồ": "o",
    "Ṑ": "O",
    "ṑ": "o",
    "Ừ": "U",
    "ừ": "u",
    "Ẁ": "W",
    "ẁ": "w",
    "Ỳ": "Y",
    "ỳ": "y",
    "Ȁ": "A",
    "ȁ": "a",
    "Ȅ": "E",
    "ȅ": "e",
    "Ȉ": "I",
    "ȉ": "i",
    "Ȍ": "O",
    "ȍ": "o",
    "Ȑ": "R",
    "ȑ": "r",
    "Ȕ": "U",
    "ȕ": "u",
    "B̌": "B",
    "b̌": "b",
    "Č̣": "C",
    "č̣": "c",
    "Ê̌": "E",
    "ê̌": "e",
    "F̌": "F",
    "f̌": "f",
    "Ǧ": "G",
    "ǧ": "g",
    "Ȟ": "H",
    "ȟ": "h",
    "J̌": "J",
    "ǰ": "j",
    "Ǩ": "K",
    "ǩ": "k",
    "M̌": "M",
    "m̌": "m",
    "P̌": "P",
    "p̌": "p",
    "Q̌": "Q",
    "q̌": "q",
    "Ř̩": "R",
    "ř̩": "r",
    "Ṧ": "S",
    "ṧ": "s",
    "V̌": "V",
    "v̌": "v",
    "W̌": "W",
    "w̌": "w",
    "X̌": "X",
    "x̌": "x",
    "Y̌": "Y",
    "y̌": "y",
    "A̧": "A",
    "a̧": "a",
    "B̧": "B",
    "b̧": "b",
    "Ḑ": "D",
    "ḑ": "d",
    "Ȩ": "E",
    "ȩ": "e",
    "Ɛ̧": "E",
    "ɛ̧": "e",
    "Ḩ": "H",
    "ḩ": "h",
    "I̧": "I",
    "i̧": "i",
    "Ɨ̧": "I",
    "ɨ̧": "i",
    "M̧": "M",
    "m̧": "m",
    "O̧": "O",
    "o̧": "o",
    "Q̧": "Q",
    "q̧": "q",
    "U̧": "U",
    "u̧": "u",
    "X̧": "X",
    "x̧": "x",
    "Z̧": "Z",
    "z̧": "z",
};
var chars = Object.keys(characterMap).join('|');
var allAccents = new RegExp(chars, 'g');
export var removeAccents = function (string) {
    return string.replace(allAccents, function (match) {
        return characterMap[match];
    });
};
