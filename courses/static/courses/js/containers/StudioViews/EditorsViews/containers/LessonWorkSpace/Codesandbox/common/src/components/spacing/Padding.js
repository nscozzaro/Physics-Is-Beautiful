"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
const get_spacing_1 = __importDefault(require("./get-spacing"));
exports.default = styled_components_1.default.div `
  padding: ${get_spacing_1.default};
  box-sizing: border-box;
`;
