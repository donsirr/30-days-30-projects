import ScholarshipSearch from '@/components/ScholarshipSearch';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Explore Scholarships | Iskolar-Hub',
    description: 'Browse and filter available scholarships in the Philippines.',
};

export default function ExplorePage() {
    return (
        <div className="container mx-auto px-4 py-8 pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Explore Scholarships</h1>
                <p className="text-gray-500 mt-2">Browse our database of over 50+ localized grants.</p>
            </div>

            <ScholarshipSearch />
        </div>
    );
}
