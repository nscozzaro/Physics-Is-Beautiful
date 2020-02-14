"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const codesandbox_json_1 = __importDefault(require("./codesandbox.json"));
const codesandbox_nu_json_1 = __importDefault(require("./codesandbox-nu.json"));
exports.default = [
    {
        name: 'CodeSandbox',
        id: 'codesandbox',
        content: codesandbox_json_1.default,
    },
    {
        name: 'CodeSandbox Nu',
        id: 'codesandboxNu',
        content: codesandbox_nu_json_1.default,
    },
    {
        name: 'Night Owl',
        id: 'nightOwl',
        url: 'https://cdn.jsdelivr.net/gh/sdras/night-owl-vscode-theme@ff58e0d3967ef968492ce8c9809239f0511b9b70/themes/Night%20Owl-color-theme.json',
    },
    {
        name: 'Night Owl (No Italics)',
        id: 'nightOwlNoItalics',
        url: 'https://cdn.jsdelivr.net/gh/sdras/night-owl-vscode-theme@ff58e0d3967ef968492ce8c9809239f0511b9b70/themes/Night%20Owl-color-theme-noitalic.json',
    },
    {
        name: 'Atom Dark',
        id: 'atomDark',
        type: 'dark',
        url: 'https://cdn.jsdelivr.net/gh/akamud/vscode-theme-onedark@11ef483921495ea6c086f56149dfa0ca6225ae53/themes/OneDark.json',
    },
    {
        name: 'Cobalt 2',
        id: 'cobalt2',
        url: 'https://cdn.jsdelivr.net/gh/wesbos/cobalt2-vscode/theme/cobalt2.json',
    },
    {
        name: 'Palenight',
        id: 'palenight',
        url: 'https://cdn.jsdelivr.net/gh/whizkydee/vscode-material-palenight-theme/themes/palenight.json',
    },
    {
        name: 'Palenight Italic',
        id: 'palenightItalic',
        url: 'https://cdn.jsdelivr.net/gh/whizkydee/vscode-material-palenight-theme/themes/palenight-italic.json',
    },
    {
        name: 'Shades of Purple',
        id: 'shadesOfPurple',
        url: 'https://cdn.jsdelivr.net/gh/ahmadawais/shades-of-purple-vscode@983101b2e9f57638fbc1bd5c551f5c84e561756e/themes/shades-of-purple-color-theme.json',
    },
    {
        name: 'Lucy',
        id: 'lucy',
        url: 'https://cdn.jsdelivr.net/gh/juliettepretot/lucy-vscode@f27d836399d906bc7f7af5fd3950126240be969c/dist/color-theme.json',
    },
    {
        name: 'High Contrast',
        id: 'highContrast',
        get: () => Promise.resolve().then(() => __importStar(require('./high-contrast.json'))),
    },
    {
        name: 'VSCode Light',
        id: 'vscodeLight',
        get: () => Promise.resolve().then(() => __importStar(require('./vscode-light'))),
    },
    {
        name: 'Atom Light',
        id: 'atomLight',
        url: 'https://cdn.jsdelivr.net/gh/akamud/vscode-theme-onelight/themes/OneLight.json',
    },
    {
        name: 'Solarized Light',
        id: 'solarizedLight',
        url: 'https://cdn.jsdelivr.net/gh/Microsoft/vscode@d2b6bbb46fbdf535e2c96b3e00ac56ac1d427a69/extensions/theme-solarized-light/themes/solarized-light-color-theme.json',
    },
];
