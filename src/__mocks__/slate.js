// Mock createEditor
export const createEditor = () => ({
  children: [{ type: 'paragraph', children: [{ text: '' }] }],
  selection: null,
  operations: [],
  marks: null,
  isInline: jest.fn(() => false),
  isVoid: jest.fn(() => false),
  normalizeNode: jest.fn(),
  onChange: jest.fn(),
  addMark: jest.fn(),
  removeMark: jest.fn(),
  deleteBackward: jest.fn(),
  deleteForward: jest.fn(),
  insertBreak: jest.fn(),
  insertText: jest.fn(),
  apply: jest.fn(),
});

// Mock Transforms
export const Transforms = {
  insertText: jest.fn(),
  delete: jest.fn(),
  setNodes: jest.fn(),
  insertNodes: jest.fn(),
  removeNodes: jest.fn(),
  wrapNodes: jest.fn(),
  unwrapNodes: jest.fn(),
  splitNodes: jest.fn(),
  select: jest.fn(),
  deselect: jest.fn(),
  move: jest.fn(),
  setSelection: jest.fn(),
};

// Mock Editor
export const Editor = {
  isBlock: jest.fn(() => false),
  isInline: jest.fn(() => false),
  isVoid: jest.fn(() => false),
  isEditor: jest.fn(() => true),
  above: jest.fn(),
  after: jest.fn(),
  before: jest.fn(),
  deleteBackward: jest.fn(),
  deleteForward: jest.fn(),
  deleteFragment: jest.fn(),
  edges: jest.fn(),
  end: jest.fn(),
  first: jest.fn(),
  fragment: jest.fn(),
  insertBreak: jest.fn(),
  insertNode: jest.fn(),
  insertText: jest.fn(),
  isEdge: jest.fn(),
  isEmpty: jest.fn(),
  isEnd: jest.fn(),
  isStart: jest.fn(),
  last: jest.fn(),
  leaf: jest.fn(),
  levels: jest.fn(),
  marks: jest.fn(),
  next: jest.fn(),
  node: jest.fn(),
  nodes: jest.fn(),
  parent: jest.fn(),
  path: jest.fn(),
  point: jest.fn(),
  positions: jest.fn(),
  previous: jest.fn(),
  range: jest.fn(),
  start: jest.fn(),
  string: jest.fn(),
  unhangRange: jest.fn(),
  void: jest.fn(),
  withoutNormalizing: jest.fn((editor, fn) => fn()),
};

// Mock Node
export const Node = {
  string: jest.fn((node) => node.text || ''),
  texts: jest.fn(function* () {}),
  isNode: jest.fn(() => true),
  isNodeList: jest.fn(() => true),
};

// Mock Element
export const Element = {
  isElement: jest.fn(() => true),
  isElementList: jest.fn(() => true),
};

// Mock Text
export const Text = {
  isText: jest.fn((value) => typeof value === 'object' && 'text' in value),
  isTextList: jest.fn(() => true),
};

// Mock Path
export const Path = {
  ancestors: jest.fn(),
  common: jest.fn(),
  compare: jest.fn(),
  endsAfter: jest.fn(),
  endsAt: jest.fn(),
  endsBefore: jest.fn(),
  equals: jest.fn(),
  hasPrevious: jest.fn(),
  isAfter: jest.fn(),
  isAncestor: jest.fn(),
  isBefore: jest.fn(),
  isChild: jest.fn(),
  isCommon: jest.fn(),
  isDescendant: jest.fn(),
  isParent: jest.fn(),
  isPath: jest.fn(),
  isSibling: jest.fn(),
  levels: jest.fn(),
  next: jest.fn(),
  parent: jest.fn(),
  previous: jest.fn(),
  relative: jest.fn(),
  transform: jest.fn(),
};