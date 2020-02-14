"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@storybook/react");
const addon_knobs_1 = require("@storybook/addon-knobs");
const _1 = __importDefault(require("."));
const stories = react_2.storiesOf('components/ContributorsBadge', module);
stories.add('Default', () => (react_1.default.createElement(_1.default, { username: addon_knobs_1.text('name', 'SaraVieira') })));
