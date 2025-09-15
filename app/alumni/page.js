'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedAction } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  MapPin, 
  Briefcase, 
  Calendar,
  MessageSquare,
  UserPlus,
  Filter,
  ArrowLeft,
  Linkedin,
  Github,
  Globe
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

function AlumniDirectoryPage() {
  const { user, userProfile } = useAuth();
  const executeWithAuth = useProtectedAction();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock alumni data
  const alumniData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      major: 'Computer Science',
      graduationYear: '2021',
      currentRole: 'Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      bio: 'Passionate about AI and machine learning. Love mentoring new graduates in tech.',
      skills: ['JavaScript', 'Python', 'Machine Learning', 'React'],
      mentorshipStatus: 'available',
      connections: 156,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        github: 'https://github.com/sarahjohnson'
      }
    },
    {
      id: 2,
      name: 'Michael Chen',
      major: 'Business Administration',
      graduationYear: '2019',
      currentRole: 'Product Manager',
      company: 'Microsoft',
      location: 'Seattle, WA',
      bio: 'Leading product teams to build user-centric solutions. Always happy to discuss career transitions.',
      skills: ['Product Strategy', 'Data Analysis', 'Leadership', 'Agile'],
      mentorshipStatus: 'available',
      connections: 243,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/michaelchen',
        portfolio: 'https://michaelchen.dev'
      }
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      major: 'Psychology',
      graduationYear: '2020',
      currentRole: 'UX Researcher',
      company: 'Adobe',
      location: 'San Jose, CA',
      bio: 'Bridging the gap between psychology and technology. Specializing in user behavior research.',
      skills: ['User Research', 'Psychology', 'Data Analysis', 'Design Thinking'],
      mentorshipStatus: 'available',
      connections: 189,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/emilyrodriguez'
      }
    },
    {
      id: 4,
      name: 'David Kim',
      major: 'Computer Science',
      graduationYear: '2022',
      currentRole: 'Full Stack Developer',
      company: 'Apple',
      location: 'Cupertino, CA',
      bio: 'Recent grad working on innovative mobile applications. Open to connecting with current students.',
      skills: ['Swift', 'Node.js', 'React Native', 'iOS Development'],
      mentorshipStatus: 'available',
      connections: 98,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/davidkim',
        github: 'https://github.com/davidkim'
      }
    },
    {
      id: 5,
      name: 'Lisa Zhang',
      major: 'Marketing',
      graduationYear: '2018',
      currentRole: 'Marketing Director',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      bio: 'Building brands and driving growth through innovative marketing strategies.',
      skills: ['Digital Marketing', 'Brand Strategy', 'Analytics', 'Growth Hacking'],
      mentorshipStatus: 'limited',
      connections: 324,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/lisazhang'
      }
    }
  ];

  const majors = [...new Set(alumniData.map(alumni => alumni.major))];
  const years = [...new Set(alumniData.map(alumni => alumni.graduationYear))].sort((a, b) => b - a);

  const filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.currentRole.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMajor = selectedMajor === 'all' || alumni.major === selectedMajor;
    const matchesYear = selectedYear === 'all' || alumni.graduationYear === selectedYear;
    
    return matchesSearch && matchesMajor && matchesYear;
  });

  const handleConnect = (alumniName) => {
    executeWithAuth(() => {
      alert(`Connection request sent to ${alumniName}!`);
    });
  };

  const handleMessage = (alumniName) => {
    executeWithAuth(() => {
      alert(`Opening message with ${alumniName}!`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
                <p className="text-gray-600 mt-1">Connect with {alumniData.length}+ alumni from your college</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, company, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Majors</option>
                    {majors.map(major => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumni) => (
            <Card key={alumni.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Profile Header */}
                <div className="flex items-center mb-4">
                  <img 
                    src={alumni.avatar} 
                    alt={alumni.name} 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{alumni.name}</h3>
                    <p className="text-gray-600">{alumni.currentRole}</p>
                    <p className="text-sm text-gray-500">{alumni.company}</p>
                  </div>
                  <Badge 
                    variant={alumni.mentorshipStatus === 'available' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {alumni.mentorshipStatus === 'available' ? 'Available' : 'Limited'}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{alumni.major} • Class of {alumni.graduationYear}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{alumni.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{alumni.connections} connections</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {alumni.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {alumni.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {alumni.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{alumni.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    {alumni.socialLinks.linkedin && (
                      <Button size="sm" variant="outline" className="p-2">
                        <Linkedin className="h-3 w-3" />
                      </Button>
                    )}
                    {alumni.socialLinks.github && (
                      <Button size="sm" variant="outline" className="p-2">
                        <Github className="h-3 w-3" />
                      </Button>
                    )}
                    {alumni.socialLinks.portfolio && (
                      <Button size="sm" variant="outline" className="p-2">
                        <Globe className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleConnect(alumni.name)}
                    className="flex-1"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleMessage(alumni.name)}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AlumniDirectoryPageWithProtection() {
  return (
    <ProtectedRoute>
      <AlumniDirectoryPage />
    </ProtectedRoute>
  );
}
