'use client'

import React from 'react';
import { useParams } from 'next/navigation';

import { HeroSection } from '@/components/common/HeroSection';
import CourseGrid from '@/components/learning-hub/CourseGrid';

// Mock data - replace with your actual data source
const courseData = {
  'crop-farming': {
    title: 'Crop Farming',
    subtitle: 'Growing plants such as grains, fruits, and vegetables for food, fuel, or industrial use.',
    cards: [
      {
        id: '1',
        title: 'Save Our Soil',
        image: '/about.jpg',
        description: 'Learn about soil conservation and sustainable practices'
      },
      {
        id: '2',
        title: 'Sustainable Farming NOW',
        image: '/about.jpg',
        description: 'Immediate steps for sustainable farming'
      },
      {
        id: '3',
        title: 'Future of Food at Risk',
        image: '/about.jpg',
        description: 'Understanding challenges in food security'
      },
      {
        id: '4',
        title: 'Modern Agriculture',
        image: '/about.jpg',
        description: 'Latest technologies in crop farming'
      },
      {
        id: '5',
        title: 'Crop Rotation & Organic Practices',
        image: '/about.jpg',
        description: 'Organic farming methods and crop rotation'
      },
      {
        id: '6',
        title: 'Pest & Disease Management',
        image: '/about.jpg',
        description: 'Managing pests and diseases naturally'
      }
    ]
  },
  'livestock-farming': {
    title: 'Livestock Farming',
    subtitle: 'Raising animals for meat, dairy, eggs, or wool. Examples include cattle ranching, poultry farming, and sheep farming.',
    cards: [
      {
        id: '7',
        title: 'Ethical Meat Matters',
        image: '/about.jpg',
        description: 'Ethical considerations in livestock farming'
      },
      {
        id: '8',
        title: 'Dairy Crisis & Solutions',
        image: '/about.jpg',
        description: 'Addressing challenges in dairy farming'
      },
      {
        id: '9',
        title: 'Rethinking Animal Farming',
        image: '/about.jpg',
        description: 'Innovative approaches to animal husbandry'
      },
      {
        id: '10',
        title: 'Sustainable Livestock',
        image: '/about.jpg',
        description: 'Sustainable practices in livestock management'
      }
    ]
  },
  'aquaponics-hydroponics': {
    title: 'Aquaponics & Hydroponics Farming',
    subtitle: 'Soilless farming systems where plants grow in nutrient-rich water solutions or combined with fish farming (aquaponics), creating a sustainable cycle.',
    cards: [
      {
        id: '11',
        title: 'Farming Without Soil',
        image: '/about.jpg',
        description: 'Introduction to soilless farming methods'
      },
      {
        id: '12',
        title: 'Plants = The future...',
        image: '/about.jpg',
        description: 'Future prospects of hydroponic farming'
      },
      {
        id: '13',
        title: 'Revolutionizing Agriculture',
        image: '/about.jpg',
        description: 'How aquaponics is changing farming'
      },
      {
        id: '14',
        title: 'Urban Farming',
        image: '/about.jpg',
        description: 'Implementing hydroponics in urban spaces'
      },
      {
        id: '15',
        title: 'Water Management & Irrigation',
        image: '/about.jpg',
        description: 'Efficient water usage in hydroponic systems'
      }
    ]
  }
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const course = courseData[courseId as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h1>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection
              backgroundImage="/whatWeOffer.jpg"
              title={course.title}
              subtitle={course.subtitle}
              ctaButtons={[
                
                
              ]}
            />
      <CourseGrid cards={course.cards} />
    </div>
  );
}