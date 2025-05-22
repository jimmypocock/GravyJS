import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Editor from '../components/Editor';

describe('Editor', () => {
  const defaultProps = {
    placeholder: 'Start typing...',
    onInput: jest.fn(),
    onKeyDown: jest.fn(),
    onMouseUp: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders contentEditable div with correct attributes', () => {
    render(<Editor {...defaultProps} />);
    
    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveAttribute('contentEditable', 'true');
    expect(editor).toHaveAttribute('data-placeholder', 'Start typing...');
    expect(editor).toHaveAttribute('aria-multiline', 'true');
    expect(editor).toHaveAttribute('tabIndex', '0');
  });

  test('applies custom className', () => {
    render(<Editor {...defaultProps} className="custom-class" />);
    
    const editor = screen.getByRole('textbox');
    expect(editor).toHaveClass('gravy-content', 'custom-class');
  });

  test('handles input events with debouncing', () => {
    jest.useFakeTimers();
    render(<Editor {...defaultProps} />);
    
    const editor = screen.getByRole('textbox');
    
    fireEvent.input(editor);
    expect(defaultProps.onInput).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(100);
    expect(defaultProps.onInput).toHaveBeenCalledTimes(1);
    
    jest.useRealTimers();
  });

  test('handles keyDown events', () => {
    render(<Editor {...defaultProps} />);
    
    const editor = screen.getByRole('textbox');
    fireEvent.keyDown(editor, { key: 'Enter' });
    
    expect(defaultProps.onKeyDown).toHaveBeenCalledTimes(1);
  });

  test('handles mouseUp events', () => {
    render(<Editor {...defaultProps} />);
    
    const editor = screen.getByRole('textbox');
    fireEvent.mouseUp(editor);
    
    expect(defaultProps.onMouseUp).toHaveBeenCalledTimes(1);
  });

  test('uses aria-label when provided', () => {
    render(<Editor {...defaultProps} aria-label="Custom label" />);
    
    const editor = screen.getByRole('textbox');
    expect(editor).toHaveAttribute('aria-label', 'Custom label');
  });

  test('falls back to placeholder for aria-label', () => {
    render(<Editor {...defaultProps} placeholder="Type something" />);
    
    const editor = screen.getByRole('textbox');
    expect(editor).toHaveAttribute('aria-label', 'Type something');
  });
});