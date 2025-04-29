import { ImageGroup } from "../store/gallerySlice";
import { Model } from "../store/modelsSlice";

// Mock data
export const mockModels: Model[] = [
    {
      modelId: 'model_1',
      name: 'Summer Casual',
      gender: 'Female',
      bodyType: 'Athletic',
      createdAt: '2024-04-20T14:22:18Z',
      status: 'completed',
      progress: 100,
      ethnicity: 'Asian',
      hairColor: 'Black',
      hairStyle: 'Long',
      eyeColor: 'Brown',
      height: 'Average (~170cm/5\'7")',
      age: 24,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80'
    },
    {
      modelId: 'model_2',
      name: 'Business Professional',
      gender: 'Male',
      bodyType: 'Average',
      createdAt: '2024-04-19T09:15:00Z',
      status: 'in_progress',
      progress: 67,
      ethnicity: 'Caucasian',
      hairColor: 'Brown',
      hairStyle: 'Short',
      eyeColor: 'Blue',
      height: 'Tall (~180cm/5\'11")',
      age: 32,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
      modelId: 'model_3',
      name: 'Evening Elegance',
      gender: 'Female',
      bodyType: 'Slim',
      createdAt: '2024-04-18T18:30:00Z',
      status: 'queued',
      progress: 0,
      ethnicity: 'Hispanic/Latino',
      hairColor: 'Brown',
      hairStyle: 'Wavy',
      eyeColor: 'Brown',
      height: 'Short (~160cm/5\'3")',
      age: 28,
      imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
      modelId: 'model_4',
      name: 'Urban Streetwear',
      gender: 'Non-binary',
      bodyType: 'Athletic',
      createdAt: '2024-04-17T11:45:00Z',
      status: 'failed',
      progress: 45,
      ethnicity: 'Mixed',
      hairColor: 'Black',
      hairStyle: 'Medium',
      eyeColor: 'Hazel',
      height: 'Average (~170cm/5\'7")',
      age: 26,
      imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80'
    },
    {
      modelId: 'model_5',
      name: 'Bohemian Style',
      gender: 'Female',
      bodyType: 'Curvy',
      createdAt: '2024-04-16T16:20:00Z',
      status: 'completed',
      progress: 100,
      ethnicity: 'Black',
      hairColor: 'Black',
      hairStyle: 'Curly',
      eyeColor: 'Brown',
      height: 'Average (~170cm/5\'7")',
      age: 29,
      imageUrl: 'https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=691&q=80'
    },
    {
      modelId: 'model_6',
      name: 'Sporty Casual',
      gender: 'Male',
      bodyType: 'Athletic',
      createdAt: '2024-04-15T13:40:00Z',
      status: 'completed',
      progress: 100,
      ethnicity: 'East Asian',
      hairColor: 'Black',
      hairStyle: 'Medium',
      eyeColor: 'Brown',
      height: 'Average (~175cm/5\'9")',
      age: 25,
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    }
  ];
  
  // Mock image data grouped by date
  export const mockImageGroups: ImageGroup[] = [
    {
      date: '2024-04-21',
      formattedDate: 'Sun, 21st April, 2024',
      images: [
        {
          imageId: '1',
          imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=720&q=80',
          title: 'Elegant Formal Outfit',
          createdAt: '2024-04-21T15:30:00Z',
          orientation: 'portrait_4_3',
          dripRating: ['Chic', 'Elegant', 'Sophisticated', 'Glamorous', 'Formal']
        },
        {
          imageId: '2',
          imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
          title: 'Luxury Evening Wear',
          createdAt: '2024-04-21T14:20:00Z',
          orientation: 'portrait_16_9',
          dripRating: ['Elegant', 'Glamorous', 'Luxurious', 'Sophisticated', 'Stylish']
        },
        {
          imageId: '3',
          imageUrl: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=672&q=80',
          title: 'Bright Summer Collection',
          createdAt: '2024-04-21T12:10:00Z',
          orientation: 'landscape_16_9',
          dripRating: ['Vibrant', 'Playful', 'Casual', 'Fun', 'Summery']
        },
        {
          imageId: '4',
          imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=673&q=80',
          title: 'City Street Fashion',
          createdAt: '2024-04-21T10:15:00Z',
          orientation: 'square_hd',
          dripRating: ['Urban', 'Stylish', 'Edgy', 'Modern', 'Trendy']
        }
      ]
    },
    {
      date: '2024-04-20',
      formattedDate: 'Sat, 20th April, 2024',
      images: [
        {
          imageId: '5',
          imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80',
          title: 'Professional Business Look',
          createdAt: '2024-04-20T19:45:00Z',
          orientation: 'portrait_4_3',
          dripRating: ['Professional', 'Sophisticated', 'Polished', 'Formal', 'Elegant']
        },
        {
          imageId: '6',
          imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80',
          title: 'Evening Gown Collection',
          createdAt: '2024-04-20T18:30:00Z',
          orientation: 'landscape_4_3',
          dripRating: ['Glamorous', 'Elegant', 'Sophisticated', 'Luxurious', 'Chic']
        },
        {
          imageId: '7',
          imageUrl: 'https://images.unsplash.com/photo-1632149877166-f75d49000351?ixlib=rb-4.0.3&auto=format&fit=crop&w=664&q=80',
          title: 'Urban Fashion Style',
          createdAt: '2024-04-20T16:40:00Z',
          orientation: 'portrait_16_9',
          dripRating: ['Urban', 'Edgy', 'Stylish', 'Modern', 'Trendy']
        }
      ]
    },
    {
      date: '2024-04-19',
      formattedDate: 'Fri, 19th April, 2024',
      images: [
        {
          imageId: '8',
          imageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80',
          title: 'Casual Summer Outfit',
          createdAt: '2024-04-19T16:20:00Z',
          dripRating: ['Casual', 'Fun', 'Vibrant', 'Summery', 'Relaxed']
        },
        {
          imageId: '9',
          imageUrl: 'https://images.unsplash.com/photo-1576185850227-1f72b7f8d483?ixlib=rb-4.0.3&auto=format&fit=crop&w=725&q=80',
          title: 'Winter Collection',
          createdAt: '2024-04-19T14:10:00Z',
          dripRating: ['Cozy', 'Elegant', 'Sophisticated', 'Warm', 'Seasonal']
        }
      ]
    }
  ];