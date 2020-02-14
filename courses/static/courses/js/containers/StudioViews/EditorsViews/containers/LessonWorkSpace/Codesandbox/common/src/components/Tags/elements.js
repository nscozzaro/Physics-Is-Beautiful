"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importStar(require("styled-components"));
// import CrossIcon from 'react-icons/lib/md/clear';
const md_1 = require("react-icons/md");
exports.TagContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -0.2rem;
  margin-right: -0.2rem;
  ${props => props.align === 'right' && `justify-content: flex-end;`};
`;
exports.Container = styled_components_1.default.span `
  position: relative;
  color: white;
  background-color: ${props => props.theme.secondary};
  padding: 0.3em 0.5em;
  border-radius: 4px;
  font-weight: 500;

  ${props => props.canRemove &&
    styled_components_1.css `
      padding-right: 1.5rem;
    `};
`;
exports.DeleteIcon = styled_components_1.default(md_1.MdClear) `
  transition: 0.3s ease all;
  position: absolute;
  right: 0.3rem;
  top: 0;
  bottom: 0;

  margin: auto;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);

  &:hover {
    color: white;
  }
`;
