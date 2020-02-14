"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_generator_1 = require("./url-generator");
const invalidUrls = [
    'github.com/',
    'github.com/user/',
    'http://github.com/',
    'http://github.com/user/',
    'http://www.github.com/',
    'http://www.github.com/user/',
    'https://github.com/user/',
    'https://www.github.com/user/',
    'www.github.com/',
    'www.github.com/user/',
];
const validUrls = [
    'github.com/user/repo',
    'http://github.com/user/repo',
    'http://www.github.com/user/repo',
    'https://github.com/user/repo',
    'https://www.github.com/user/repo',
    'www.github.com/user/repo',
];
describe('url-generator', () => {
    describe('gitHubToSandboxUrl', () => {
        validUrls.forEach(inputUrl => {
            test(`handles ${inputUrl} urls`, () => {
                expect(url_generator_1.gitHubToSandboxUrl(inputUrl)).toBe('/s/github/user/repo');
            });
        });
    });
    describe('gitHubRepoPattern', () => {
        validUrls.forEach(inputUrl => {
            test(`validates ${inputUrl} as truthy`, () => {
                expect(url_generator_1.gitHubRepoPattern.test(inputUrl)).toBeTruthy();
            });
        });
        invalidUrls.forEach(inputUrl => {
            test(`validates ${inputUrl} as falsy`, () => {
                expect(url_generator_1.gitHubRepoPattern.test(inputUrl)).toBeFalsy();
            });
        });
    });
});
