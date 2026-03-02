import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompanyDetails from '../../components/CompanyDetails';
import useAuthStore from '../../../../store/useAuthStore';
import api from '../../../../utils/api';

// Mock the auth store
vi.mock('../../../../store/useAuthStore', () => ({
    default: vi.fn(),
}));

// Mock the api utility
vi.mock('../../../../utils/api', () => ({
    default: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}));

describe('CompanyDetails Component', () => {
    const mockUser = {
        company: {
            id: 'test-comp-id',
        },
    };

    const mockCompanyData = {
        name: 'Test Tech Corp',
        website: 'https://testtech.corp',
        industry: 'Technology',
        size: '11-50',
        email: 'contact@testtech.corp',
        phone: '+1 234 567 890',
        address: '123 Cloud Avenue',
        city: 'Cyber City',
        country: 'DigiLand',
        openingTime: '09:00',
        closingTime: '18:00',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.mockReturnValue({ user: mockUser });
        api.get.mockResolvedValue({ data: mockCompanyData });
    });

    it('renders company details correctly after loading', async () => {
        render(<CompanyDetails />);

        // Check loading state (if loading is quick we might miss it)
        // expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Test Tech Corp')).toBeInTheDocument();
            expect(screen.getByText('Technology')).toBeInTheDocument();
            expect(screen.getByText('contact@testtech.corp')).toBeInTheDocument();
        });
    });

    it('displays placeholder dashes when data is missing', async () => {
        const sparseData = { name: 'Simple Co', email: 'simple@mail.com' };
        api.get.mockResolvedValue({ data: sparseData });

        render(<CompanyDetails />);

        await waitFor(() => {
            expect(screen.getByText('Simple Co')).toBeInTheDocument();
            // Check for dashes in other fields
            const dashTexts = screen.getAllByText('-');
            expect(dashTexts.length).toBeGreaterThan(0);
        });
    });
});
