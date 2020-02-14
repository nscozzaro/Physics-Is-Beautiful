"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
exports.default = styled_components_1.default.div `
  display: flex;
  flex-direction: row;

  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: ${props => props.alignItems || 'center'};
`;
