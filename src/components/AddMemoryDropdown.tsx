'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Upload,
  Link2,
  PenTool,
  FileText,
  X,
  Settings,
} from 'lucide-react';

interface AddMemoryDropdownProps {
  onAddContent?: (content: string) => void;
}

export default function AddMemoryDropdown({
  onAddContent,
}: AddMemoryDropdownProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [instructionModalOpen, setInstructionModalOpen] = useState(false);

  // Upload Files Modal State
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [fileDescription, setFileDescription] = useState('');

  // Add Content Modal State
  const [contentTitle, setContentTitle] = useState('');
  const [contentDescription, setContentDescription] = useState('');

  // Add Instruction Modal State
  const [newInstruction, setNewInstruction] = useState('');

  // Connector services matching the design shown in the image
  const connectorServices = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Import your professional profile and connections',
      icon: '🔗',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Connect your repositories and contributions',
      icon: '💻',
      color: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      description: 'Import your tweets and social presence',
      icon: '🐦',
      color: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
    },
    {
      id: 'portfolio',
      name: 'Portfolio Website',
      description: 'Connect your personal website or portfolio',
      icon: '🌐',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      id: 'resume',
      name: 'Resume/CV',
      description: 'Upload your resume or curriculum vitae',
      icon: '📄',
      color: 'bg-green-500/10 text-green-400 border-green-500/20',
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'Import your published articles and thoughts',
      icon: '✍️',
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    },
  ];

  const handleFileUpload = () => {
    if (selectedFiles && fileDescription.trim()) {
      // Handle file upload logic here
      console.log(
        'Uploading files:',
        selectedFiles,
        'Description:',
        fileDescription
      );
      setUploadModalOpen(false);
      setSelectedFiles(null);
      setFileDescription('');
    }
  };

  const handleAddContent = () => {
    if (contentTitle.trim()) {
      const fullContent = `I'd like to tell you about "${contentTitle}". ${contentDescription ? `This is about ${contentDescription}. ` : ''}Let me share the details with you...`;
      onAddContent?.(fullContent);
      setContentModalOpen(false);
      setContentTitle('');
      setContentDescription('');
    }
  };

  const handleConnectService = (serviceId: string) => {
    // Handle service connection logic here
    console.log('Connecting to service:', serviceId);
    setConnectModalOpen(false);
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      // Handle instruction logic here
      console.log('Adding instruction:', newInstruction);
      setInstructionModalOpen(false);
      setNewInstruction('');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs border-[hsl(0_0%_18%)] hover:bg-[hsl(0_0%_8%)] hover:border-primary/30"
          >
            <Plus className="h-3 w-3 mr-1.5" />
            Add Memory
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-56 bg-[hsl(0_0%_8%)] border-[hsl(0_0%_18%)]"
        >
          <DropdownMenuItem
            onClick={() => setUploadModalOpen(true)}
            className="cursor-pointer hover:bg-[hsl(0_0%_12%)] focus:bg-[hsl(0_0%_12%)]"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setConnectModalOpen(true)}
            className="cursor-pointer hover:bg-[hsl(0_0%_12%)] focus:bg-[hsl(0_0%_12%)]"
          >
            <Link2 className="h-4 w-4 mr-2" />
            Connect to Service
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setContentModalOpen(true)}
            className="cursor-pointer hover:bg-[hsl(0_0%_12%)] focus:bg-[hsl(0_0%_12%)]"
          >
            <PenTool className="h-4 w-4 mr-2" />
            Add Content
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setInstructionModalOpen(true)}
            className="cursor-pointer hover:bg-[hsl(0_0%_12%)] focus:bg-[hsl(0_0%_12%)]"
          >
            <Settings className="h-4 w-4 mr-2" />
            Add Instruction
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Upload Files Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Files
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Upload documents, images, or other files to add to your memory.
              Provide a description to help your AI understand the context.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="file-upload"
                className="text-sm text-muted-foreground"
              >
                Choose Files
              </Label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(e.target.files)}
                className="w-full mt-1 px-3 py-2 bg-[#0d1117] border border-[hsl(0_0%_18%)] rounded-md text-white file:mr-3 file:py-1 file:px-2 file:border-0 file:bg-primary file:text-black file:text-xs file:rounded"
              />
              {selectedFiles && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="file-description"
                className="text-sm text-muted-foreground"
              >
                Description
              </Label>
              <Textarea
                id="file-description"
                placeholder="Describe what these files contain and why they're important to your story..."
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                className="mt-1 bg-[#0d1117] border-[hsl(0_0%_18%)] text-white resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={handleFileUpload}
              disabled={!selectedFiles || !fileDescription.trim()}
              className="flex-1 bg-primary hover:bg-primary/90 text-black"
            >
              Upload Files
            </Button>
            <Button
              onClick={() => setUploadModalOpen(false)}
              variant="outline"
              className="flex-1 border-[hsl(0_0%_18%)] hover:bg-[#0d1117]"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connect to Service Modal */}
      <Dialog open={connectModalOpen} onOpenChange={setConnectModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Connect to Service
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Connect your accounts and services to automatically import your
              data and expand your AI's knowledge.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {connectorServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleConnectService(service.id)}
                className="relative bg-[hsl(0_0%_6%)] border border-[hsl(0_0%_18%)] rounded-lg p-4 transition-all hover:scale-105 cursor-pointer hover:border-[hsl(0_0%_24%)] group"
              >
                <div
                  className={`inline-flex p-2 rounded-lg mb-3 ${service.color}`}
                >
                  <span className="text-lg">{service.icon}</span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-2">
                  {service.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {service.description}
                </p>

                <Button
                  size="sm"
                  className="w-full mt-3 bg-primary hover:bg-primary/90 text-black"
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setConnectModalOpen(false)}
              variant="outline"
              className="border-[hsl(0_0%_18%)] hover:bg-[#0d1117]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Content Modal */}
      <Dialog open={contentModalOpen} onOpenChange={setContentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Add Content
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Start a new conversation topic with your AI trainer. Give it a
              title and description, then the AI will help you develop the
              content through conversation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="content-title"
                className="text-sm text-muted-foreground"
              >
                Title
              </Label>
              <Input
                id="content-title"
                placeholder="e.g., My Journey into Tech"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                className="mt-1 bg-[#0d1117] border-[hsl(0_0%_18%)] text-white"
              />
            </div>

            <div>
              <Label
                htmlFor="content-desc"
                className="text-sm text-muted-foreground"
              >
                Description (Optional)
              </Label>
              <Input
                id="content-desc"
                placeholder="Brief description of this content..."
                value={contentDescription}
                onChange={(e) => setContentDescription(e.target.value)}
                className="mt-1 bg-[#0d1117] border-[hsl(0_0%_18%)] text-white"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Once you add this, the AI will help you write the content
                through conversation.
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={handleAddContent}
              disabled={!contentTitle.trim()}
              className="flex-1 bg-primary hover:bg-primary/90 text-black"
            >
              Add Content
            </Button>
            <Button
              onClick={() => setContentModalOpen(false)}
              variant="outline"
              className="flex-1 border-[hsl(0_0%_18%)] hover:bg-[#0d1117]"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Instruction Modal */}
      <Dialog
        open={instructionModalOpen}
        onOpenChange={setInstructionModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Add Instruction for Your Twin
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Give your AI Twin specific guidance on how to respond. These
              instructions will help your twin maintain consistency across all
              conversations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="instruction"
                className="text-sm text-muted-foreground"
              >
                Instruction
              </Label>
              <Textarea
                id="instruction"
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                placeholder="e.g., Always mention my passion for helping students when discussing career advice..."
                rows={4}
                className="mt-1 bg-[#0d1117] border-[hsl(0_0%_18%)] text-white resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Be specific and clear. Your twin will follow these guidelines in
                all conversations.
              </p>
            </div>

            {/* Example Instructions */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Example instructions:
              </p>
              <div className="space-y-2">
                {[
                  'Always mention my 5+ years of mentoring experience',
                  'Keep responses under 2 paragraphs for better readability',
                  'Emphasize my startup background when discussing entrepreneurship',
                  'Never give financial advice, redirect to professionals',
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setNewInstruction(example)}
                    className="w-full text-left p-2 text-xs bg-[hsl(0_0%_6%)] hover:bg-[hsl(0_0%_12%)] border border-[hsl(0_0%_18%)] hover:border-[hsl(0_0%_24%)] rounded text-muted-foreground hover:text-white transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={handleAddInstruction}
              disabled={!newInstruction.trim()}
              className="flex-1 bg-primary hover:bg-primary/90 text-black"
            >
              Add Instruction
            </Button>
            <Button
              onClick={() => {
                setInstructionModalOpen(false);
                setNewInstruction('');
              }}
              variant="outline"
              className="flex-1 border-[hsl(0_0%_18%)] hover:bg-[#0d1117]"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
