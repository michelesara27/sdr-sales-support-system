import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '../contexts/ProjectContext';
import { useToast } from '@/components/ui/use-toast';
import { CreateProjectData } from '../types/project';

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createProject, updateProject, getProject } = useProjects();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    productDetails: '',
    targetAudience: '',
    objections: [],
    valueArguments: '',
    approachGuide: '',
  });

  const [newObjection, setNewObjection] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const project = getProject(id);
      if (project) {
        setFormData({
          name: project.name,
          description: project.description,
          productDetails: project.productDetails,
          targetAudience: project.targetAudience,
          objections: project.objections,
          valueArguments: project.valueArguments,
          approachGuide: project.approachGuide,
        });
      } else {
        toast({
          title: 'Project not found',
          description: 'The project you are trying to edit does not exist.',
          variant: 'destructive',
        });
        navigate('/projects');
      }
    }
  }, [isEditing, id, getProject, navigate, toast]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.productDetails.trim()) {
      newErrors.productDetails = 'Product details are required';
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    }

    if (!formData.valueArguments.trim()) {
      newErrors.valueArguments = 'Value arguments are required';
    }

    if (!formData.approachGuide.trim()) {
      newErrors.approachGuide = 'Approach guide is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && id) {
        updateProject(id, formData);
        toast({
          title: 'Project updated',
          description: 'Your project has been updated successfully.',
        });
      } else {
        createProject(formData);
        toast({
          title: 'Project created',
          description: 'Your new project has been created successfully.',
        });
      }
      navigate('/projects');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateProjectData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addObjection = () => {
    if (newObjection.trim() && !formData.objections.includes(newObjection.trim())) {
      setFormData(prev => ({
        ...prev,
        objections: [...prev.objections, newObjection.trim()]
      }));
      setNewObjection('');
    }
  };

  const removeObjection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objections: prev.objections.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addObjection();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Project' : 'Create New Project'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditing ? 'Update your project details' : 'Set up a new sales project'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about your sales project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., CRM Software Sales"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the project"
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <Label htmlFor="productDetails">Product/Service Details *</Label>
                <Textarea
                  id="productDetails"
                  value={formData.productDetails}
                  onChange={(e) => handleInputChange('productDetails', e.target.value)}
                  placeholder="Detailed description of your product or service"
                  rows={4}
                  className={errors.productDetails ? 'border-red-500' : ''}
                />
                {errors.productDetails && (
                  <p className="text-sm text-red-600 mt-1">{errors.productDetails}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>
                Define your ideal customer profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="targetAudience">Target Audience/Persona *</Label>
                <Textarea
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Describe your target audience, their roles, company size, industry, etc."
                  rows={6}
                  className={errors.targetAudience ? 'border-red-500' : ''}
                />
                {errors.targetAudience && (
                  <p className="text-sm text-red-600 mt-1">{errors.targetAudience}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Common Objections */}
        <Card>
          <CardHeader>
            <CardTitle>Common Objections</CardTitle>
            <CardDescription>
              List the most common objections you encounter from prospects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newObjection}
                onChange={(e) => setNewObjection(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a common objection"
                className="flex-1"
              />
              <Button type="button" onClick={addObjection} disabled={!newObjection.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.objections.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.objections.map((objection, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {objection}
                    <button
                      type="button"
                      onClick={() => removeObjection(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Value Arguments and Approach */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Value Arguments</CardTitle>
              <CardDescription>
                Key value propositions and differentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="valueArguments">Value Arguments & Differentials *</Label>
                <Textarea
                  id="valueArguments"
                  value={formData.valueArguments}
                  onChange={(e) => handleInputChange('valueArguments', e.target.value)}
                  placeholder="Key benefits, ROI metrics, competitive advantages..."
                  rows={6}
                  className={errors.valueArguments ? 'border-red-500' : ''}
                />
                {errors.valueArguments && (
                  <p className="text-sm text-red-600 mt-1">{errors.valueArguments}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approach Guide</CardTitle>
              <CardDescription>
                Tone of voice and best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="approachGuide">Approach Guide *</Label>
                <Textarea
                  id="approachGuide"
                  value={formData.approachGuide}
                  onChange={(e) => handleInputChange('approachGuide', e.target.value)}
                  placeholder="Tone of voice, communication style, best practices..."
                  rows={6}
                  className={errors.approachGuide ? 'border-red-500' : ''}
                />
                {errors.approachGuide && (
                  <p className="text-sm text-red-600 mt-1">{errors.approachGuide}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/projects')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
}
