import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../../Button';

describe('Button Component', () => {
    it('renders correctly with children', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('displays loading spinner when loading is true', () => {
        render(<Button loading={true}>Click Me</Button>);
        // The loading spinner is an SVG with animate-spin class
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled={true}>Click Me</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('is disabled when loading prop is true', () => {
        render(<Button loading={true}>Click Me</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
