import { Button } from '../Button';
import { Badge } from '../Badge';
import { Card, KPICard } from '../Card';
import { Input, Textarea, Select } from '../Input';
import { Tabs } from '../Tabs';
import { Camera, Download, Filter, Search, X } from 'lucide-react';
import { useState } from 'react';

interface DesignSystemProps {
  onExit?: () => void;
}

export function DesignSystem({ onExit }: DesignSystemProps) {
  const [activeTab, setActiveTab] = useState('components');

  return (
    <div className="min-h-screen bg-[#F5F8F5]">
      {onExit && (
        <div className="sticky top-0 z-50 bg-white border-b border-[rgba(0,0,0,0.12)] h-14 md:h-16 flex items-center justify-between px-4 md:px-6">
          <h2 className="text-[#1B1B1B]">Design System</h2>
          <button
            onClick={onExit}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Exit"
            title="Exit to role selection"
          >
            <X size={20} className="text-[#605E5C]" />
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        {/* Header */}
        <div>
          <h1>Atkore LPA Design System</h1>
          <p className="mt-2 text-[#605E5C]">
            Reusable components for the Process Audit application
          </p>
        </div>

        {/* Colors */}
        <section>
          <h2 className="mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-24 bg-[#4CAC48] rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-[#605E5C]">#4CAC48</p>
            </div>
            <div>
              <div className="h-24 bg-[#6AD96A] rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Primary Hover</p>
              <p className="text-xs text-[#605E5C]">#6AD96A</p>
            </div>
            <div>
              <div className="h-24 bg-[#EEF7EE] rounded-lg mb-2 border border-[rgba(0,0,0,0.12)]"></div>
              <p className="text-sm font-medium">Accent Surface</p>
              <p className="text-xs text-[#605E5C]">#EEF7EE</p>
            </div>
            <div>
              <div className="h-24 bg-[#D13438] rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Destructive</p>
              <p className="text-xs text-[#605E5C]">#D13438</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="mb-4">Typography</h2>
          <Card>
            <div className="space-y-4">
              <div>
                <h1>Heading 1 - 24px Medium</h1>
                <p className="text-xs text-[#605E5C] mt-1">Used for main page titles</p>
              </div>
              <div>
                <h2>Heading 2 - 20px Medium</h2>
                <p className="text-xs text-[#605E5C] mt-1">Used for section headers</p>
              </div>
              <div>
                <h3>Heading 3 - 16px Medium</h3>
                <p className="text-xs text-[#605E5C] mt-1 text-[15px]">Used for card titles</p>
              </div>
              <div>
                <h4>Heading 4 - 14px Medium</h4>
                <p className="text-xs text-[#605E5C] mt-1">Used for labels and small headers</p>
              </div>
              <div>
                <p>Body text - 14px Regular</p>
                <p className="text-xs text-[#605E5C] mt-1">Default body text throughout the app</p>
              </div>
              <div>
                <p className="text-xs">Caption - 12px Regular</p>
                <p className="text-xs text-[#605E5C] mt-1">Used for metadata and secondary information</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="mb-4">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h4 className="mb-4">Primary Button</h4>
              <div className="space-y-4">
                <Button variant="primary">Start Audit</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" loading>Loading</Button>
                <Button variant="primary">
                  <Camera size={16} />
                  With Icon
                </Button>
              </div>
            </Card>

            <Card>
              <h4 className="mb-4">Secondary Button</h4>
              <div className="space-y-4">
                <Button variant="secondary">Cancel</Button>
                <Button variant="secondary" disabled>Disabled</Button>
                <Button variant="secondary">
                  <Download size={16} />
                  Export
                </Button>
              </div>
            </Card>

            <Card>
              <h4 className="mb-4">Tertiary Button</h4>
              <div className="space-y-4">
                <Button variant="tertiary">View Details</Button>
                <Button variant="tertiary" disabled>Disabled</Button>
              </div>
            </Card>

            <Card>
              <h4 className="mb-4">Destructive Button</h4>
              <div className="space-y-4">
                <Button variant="destructive">Delete</Button>
                <Button variant="destructive" disabled>Disabled</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="mb-4">Status Badges</h2>
          <Card>
            <div className="flex flex-wrap gap-3">
              <Badge variant="accepted">Accepted</Badge>
              <Badge variant="pending">Pending Acceptance</Badge>
              <Badge variant="denied">Denied</Badge>
              <Badge variant="in-progress">In Progress</Badge>
              <Badge variant="submitted">Submitted</Badge>
              <Badge variant="overdue">Overdue</Badge>
            </div>
          </Card>
        </section>

        {/* Form Controls */}
        <section>
          <h2 className="mb-4">Form Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h4 className="mb-4">Text Input</h4>
              <div className="space-y-4">
                <Input label="Label" placeholder="Enter text" />
                <Input label="With error" error="This field is required" />
                <Input label="Disabled" disabled value="Disabled input" />
              </div>
            </Card>

            <Card>
              <h4 className="mb-4">Textarea</h4>
              <Textarea label="Notes" placeholder="Enter additional notes..." />
            </Card>

            <Card>
              <h4 className="mb-4">Select Dropdown</h4>
              <Select label="Status">
                <option>Select an option</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
              </Select>
            </Card>

            <Card>
              <h4 className="mb-4">Search Input</h4>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#605E5C]" />
                <Input placeholder="Search audits..." className="pl-10" />
              </div>
            </Card>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <h4 className="mb-2">Standard Card</h4>
              <p className="text-sm text-[#605E5C]">
                Basic card component with padding, border, and rounded corners
              </p>
            </Card>

            <Card onClick={() => alert('Card clicked')}>
              <h4 className="mb-2">Clickable Card</h4>
              <p className="text-sm text-[#605E5C]">
                This card has hover effects and is interactive
              </p>
            </Card>

            <KPICard label="Completed Audits" value="42" trend="+12% this month" />
          </div>
        </section>

        {/* Tabs */}
        <section>
          <h2 className="mb-4">Tabs</h2>
          <Card>
            <Tabs
              tabs={[
                { id: 'tab1', label: 'Today', count: 5 },
                { id: 'tab2', label: 'Upcoming', count: 12 },
                { id: 'tab3', label: 'Completed', count: 38 }
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className="mt-4">
              <p className="text-sm text-[#605E5C]">Content for {activeTab}</p>
            </div>
          </Card>
        </section>

        {/* Spacing System */}
        <section>
          <h2 className="mb-4">Spacing System (4px Grid)</h2>
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-1 h-8 bg-[#4CAC48]"></div>
                <span className="text-sm">4px (spacing-1)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-[#4CAC48]"></div>
                <span className="text-sm">8px (spacing-2)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-8 bg-[#4CAC48]"></div>
                <span className="text-sm">12px (spacing-3)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-8 bg-[#4CAC48]"></div>
                <span className="text-sm">16px (spacing-4)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-8 bg-[#4CAC48]"></div>
                <span className="text-sm">24px (spacing-6)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-[#4CAC48]"></div>
                <span className="text-sm">32px (spacing-8)</span>
              </div>
            </div>
          </Card>
        </section>

        {/* Border Radius */}
        <section>
          <h2 className="mb-4">Border Radius</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-24 bg-[#4CAC48] rounded mb-2"></div>
              <p className="text-sm">Small - 4px</p>
            </div>
            <div>
              <div className="h-24 bg-[#4CAC48] rounded-lg mb-2"></div>
              <p className="text-sm">Medium - 8px</p>
            </div>
            <div>
              <div className="h-24 bg-[#4CAC48] rounded-xl mb-2"></div>
              <p className="text-sm">Large - 12px</p>
            </div>
            <div>
              <div className="h-24 w-24 bg-[#4CAC48] rounded-full mb-2"></div>
              <p className="text-sm">Full - 999px</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}